package com.collabdesk.app.auth.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabdesk.app.auth.dto.RegisterRequest;
import com.collabdesk.app.auth.dto.SetupAccountRequestDto;
import com.collabdesk.app.auth.repository.RefreshTokenRepository;
import com.collabdesk.app.user.entity.Role;
import com.collabdesk.app.user.entity.User;
import com.collabdesk.app.user.repository.UserRepository;
import com.collabdesk.app.util.EmailService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;


    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use.");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setRole(Role.valueOf(registerRequest.getRole().toUpperCase()));
        
        String token = UUID.randomUUID().toString();
        user.setAccountSetupToken(token);
        user.setAccountSetupTokenExpiry(LocalDateTime.now().plusHours(24)); 
        user.setEnabled(false); 

        User savedUser = userRepository.save(user);
        
        emailService.sendAccountSetupEmail(savedUser.getEmail(), token);

        return savedUser;
    }
    
    @Transactional
    public void setupAccount(SetupAccountRequestDto setupDto) {
        User user = userRepository.findByAccountSetupToken(setupDto.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired setup token."));

        if (user.getAccountSetupTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired setup token.");
        }

        user.setPassword(passwordEncoder.encode(setupDto.getPassword()));
        user.setEnabled(true);
        user.setAccountSetupToken(null); 
        user.setAccountSetupTokenExpiry(null);

        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(10)); 
        userRepository.save(user);

        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null); 
        user.setOtpExpiryTime(null);
        userRepository.save(user);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(token -> refreshTokenRepository.delete(token));
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
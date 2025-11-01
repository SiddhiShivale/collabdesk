package com.collabdesk.app.user.service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabdesk.app.mapper.UserMapper;
import com.collabdesk.app.team.entity.Team;
import com.collabdesk.app.team.repository.TeamRepository;
import com.collabdesk.app.user.dto.ProfileResponseDto;
import com.collabdesk.app.user.dto.UserDto;
import com.collabdesk.app.user.dto.UserUpdateDto;
import com.collabdesk.app.user.entity.Role;
import com.collabdesk.app.user.entity.User;
import com.collabdesk.app.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeamRepository teamRepository; 

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder; 

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        String currentAdminEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findAllWithSoftDeleted().stream()
                .filter(user -> !user.getEmail().equals(currentAdminEmail))
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
    }
    
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return userMapper.toUserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long userId, UserUpdateDto userUpdateDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (existingUser.getRole() == Role.TEAM_LEAD && userUpdateDto.getRole() != Role.TEAM_LEAD) {
            List<Team> ledTeams = teamRepository.findByLead_Id(userId);
            if (!ledTeams.isEmpty()) {
                String teamNames = ledTeams.stream().map(Team::getName).collect(Collectors.joining(", "));
                throw new IllegalStateException(
                    "Cannot change role from TEAM_LEAD. This user is still the lead of team(s): " + teamNames + ". Please assign a new lead to that team first."
                );
            }
        }

        userRepository.findByEmail(userUpdateDto.getEmail()).ifPresent(user -> {
            if (!user.getId().equals(userId)) {
                throw new IllegalStateException("Email " + userUpdateDto.getEmail() + " is already in use.");
            }
        });

        existingUser.setName(userUpdateDto.getName());
        existingUser.setEmail(userUpdateDto.getEmail());
        existingUser.setRole(userUpdateDto.getRole());

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toUserDto(updatedUser);
    }

    @Transactional
    public void toggleUserActivation(Long userId) {
        User user = userRepository.findByIdEvenIfDeleted(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (!user.isDeleted()) {
            List<Team> ledTeams = teamRepository.findByLead_Id(userId);
            if (!ledTeams.isEmpty()) {
                String teamNames = ledTeams.stream().map(Team::getName).collect(Collectors.joining(", "));
                throw new IllegalStateException(
                    "Cannot deactivate user. They are the lead of team(s): " + teamNames + ". Please assign a new lead first."
                );
            }
        }
        
        user.setDeleted(!user.isDeleted());

        userRepository.save(user);
    }
    
    @Transactional
    public ProfileResponseDto updateProfileName(String name) {
        User currentUser = getCurrentUserEntity();
        currentUser.setName(name);
        User updatedUser = userRepository.save(currentUser);
        return ProfileResponseDto.fromEntity(updatedUser);
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentUserEntity();
        
        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("The current password entered is incorrect.");
        }
        
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        
        userRepository.save(currentUser);
    }
    
    @Transactional(readOnly = true)
    public ProfileResponseDto getCurrentUserProfile() {
        User currentUser = getCurrentUserEntity();
        return ProfileResponseDto.fromEntity(currentUser);
    }
    
    private User getCurrentUserEntity() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found in database"));
    }
    
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

}
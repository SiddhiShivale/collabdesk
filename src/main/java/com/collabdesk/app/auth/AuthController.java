package com.collabdesk.app.auth;

import com.collabdesk.app.auth.dto.AuthRequest;
import com.collabdesk.app.auth.dto.AuthResponse;
import com.collabdesk.app.auth.dto.RefreshTokenResponse;
import com.collabdesk.app.auth.dto.RegisterRequest;
import com.collabdesk.app.auth.entity.RefreshToken;
import com.collabdesk.app.mapper.UserMapper;
import com.collabdesk.app.user.UserRepository;
import com.collabdesk.app.user.entity.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${application.security.jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest authRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow();
            String accessToken = jwtService.generateToken(org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password("").authorities("ROLE_" + user.getRole().name()).build());
            RefreshToken refreshToken = jwtService.createRefreshToken(user.getEmail());

            addRefreshTokenToCookie(response, refreshToken.getToken());

            return ResponseEntity.ok(new AuthResponse(accessToken, userMapper.toUserDto(user)));
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest) {
        User registeredUser = authService.registerUser(registerRequest);
        return ResponseEntity.ok(userMapper.toUserDto(registeredUser));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("Refresh token is missing!");
        }

        RefreshToken verifiedToken = jwtService.verifyRefreshToken(refreshToken);
        User user = verifiedToken.getUser();
        String newAccessToken = jwtService.generateToken(org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password("").authorities("ROLE_" + user.getRole().name()).build());

        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> refreshTokenRepository.delete(token));
        }
        
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword() {
        // Placeholder for OTP generation and email sending logic
        return ResponseEntity.ok("Password reset instructions sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword() {
        // Placeholder for OTP validation and password update logic
        return ResponseEntity.ok("Password has been reset successfully.");
    }

    private void addRefreshTokenToCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); 
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshTokenExpirationMs / 1000));
        response.addCookie(cookie);
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
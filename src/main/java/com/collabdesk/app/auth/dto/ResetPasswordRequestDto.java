package com.collabdesk.app.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ResetPasswordRequestDto {

    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "OTP cannot be blank")
    private String otp;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

}
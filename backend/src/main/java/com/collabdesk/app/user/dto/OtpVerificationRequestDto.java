package com.collabdesk.app.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerificationRequestDto {
    @NotBlank(message = "OTP cannot be blank")
    private String otp;
}
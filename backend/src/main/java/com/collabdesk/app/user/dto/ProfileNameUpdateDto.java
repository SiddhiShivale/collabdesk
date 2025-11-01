package com.collabdesk.app.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileNameUpdateDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;
}
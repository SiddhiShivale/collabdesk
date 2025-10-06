package com.collabdesk.app.team.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class AddMemberRequestDto {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

}
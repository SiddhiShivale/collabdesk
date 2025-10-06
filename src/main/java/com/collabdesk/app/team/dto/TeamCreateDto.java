package com.collabdesk.app.team.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TeamCreateDto {

    @NotBlank(message = "Team name cannot be blank")
    private String name;

    @NotNull(message = "Team lead ID cannot be null")
    private Long teamLeadId;
}
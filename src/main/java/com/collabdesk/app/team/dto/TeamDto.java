package com.collabdesk.app.team.dto;

import com.collabdesk.app.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TeamDto {
    private Long id;
    private String name;
    private UserDto lead;
    private List<UserDto> members;
}
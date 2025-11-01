package com.collabdesk.app.task.dto;

import java.time.LocalDate;
import java.util.List;

import com.collabdesk.app.task.entity.Importance;
import com.collabdesk.app.team.dto.TeamDto;
import com.collabdesk.app.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private Importance importance;
    private LocalDate dueDate;
    private List<UserAssignmentStatusDto> assignments;
    private UserDto creator;
    private TeamDto team;
    private TaskResponseDto dependsOn;
}
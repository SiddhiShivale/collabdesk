package com.collabdesk.app.task.dto;

import com.collabdesk.app.task.entity.TaskStatus;
import com.collabdesk.app.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskAssignmentDto {
    private Long id;
    private TaskResponseDto task;
    private UserDto user;
    private TaskStatus status;
}
package com.collabdesk.app.task.dto;

import com.collabdesk.app.task.TaskStatus;
import com.collabdesk.app.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private UserDto assignee;
    private UserDto creator;

}
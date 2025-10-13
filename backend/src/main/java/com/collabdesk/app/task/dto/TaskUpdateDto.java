package com.collabdesk.app.task.dto;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import com.collabdesk.app.task.entity.TaskStatus;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskUpdateDto {

    private String title;
    private String description;
    private TaskStatus status;
    private Long teamId;
    private List<Long> assigneeIds;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;
}
package com.collabdesk.app.task.dto;

import com.collabdesk.app.task.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskUpdateDto {

    private String title;
    private String description;
    private TaskStatus status;
    private Long assigneeId;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;

}

package com.collabdesk.app.task.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskCreateDto {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String description;

    @NotNull(message = "Team ID cannot be null")
    private Long teamId;

    @NotEmpty(message = "There must be at least one assignee")
    private List<Long> assigneeIds;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;

}
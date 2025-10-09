package com.collabdesk.app.task.dto;

import com.collabdesk.app.task.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskStatusUpdateDto {

    @NotNull(message = "Status cannot be null")
    private TaskStatus status;

}
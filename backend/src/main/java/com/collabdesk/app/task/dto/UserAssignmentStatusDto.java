package com.collabdesk.app.task.dto;

import com.collabdesk.app.task.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAssignmentStatusDto {
    private Long userId;
    private String userName;
    private TaskStatus status;
}
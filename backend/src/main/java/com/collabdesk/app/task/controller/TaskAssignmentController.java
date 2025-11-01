package com.collabdesk.app.task.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.task.dto.TaskAssignmentDto;
import com.collabdesk.app.task.dto.TaskStatusUpdateDto;
import com.collabdesk.app.task.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/task-assignments")
public class TaskAssignmentController {

    @Autowired
    private TaskService taskService;

    @PatchMapping("/{assignmentId}/status")
    @PreAuthorize("@taskSecurityService.isAssigneeOfAssignment(#assignmentId, principal.username)")
    public ResponseEntity<TaskAssignmentDto> updateTaskAssignmentStatus(
            @PathVariable Long assignmentId,
            @RequestBody @Valid TaskStatusUpdateDto statusUpdateDto) {
        TaskAssignmentDto updatedAssignment = taskService.updateTaskAssignmentStatus(assignmentId, statusUpdateDto.getStatus());
        return ResponseEntity.ok(updatedAssignment);
    }
}
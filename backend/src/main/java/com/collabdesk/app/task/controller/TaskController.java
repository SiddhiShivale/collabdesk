package com.collabdesk.app.task.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskStatusUpdateDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import com.collabdesk.app.task.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@PostMapping("/tasks")
	@PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
	public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid TaskCreateDto createDto) {
		TaskResponseDto createdTask = taskService.createTask(createDto);
		return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
	}
	
	@GetMapping("/tasks")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<TaskResponseDto>> getAllTasksForAdmin() {
        List<TaskResponseDto> tasks = taskService.getAllTasksForAdmin();
        return ResponseEntity.ok(tasks);
    }

	@GetMapping("/tasks/{id}")
	public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable("id") Long taskId) {
		TaskResponseDto task = taskService.getTaskById(taskId);
		return ResponseEntity.ok(task);
	}

	@PutMapping("/tasks/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
	public ResponseEntity<TaskResponseDto> updateTask(@PathVariable("id") Long taskId,
			@RequestBody @Valid TaskUpdateDto updateDto) {
		TaskResponseDto updatedTask = taskService.updateTask(taskId, updateDto);
		return ResponseEntity.ok(updatedTask);
	}

	@DeleteMapping("/tasks/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
	public ResponseEntity<Void> deleteTask(@PathVariable("id") Long taskId) {
		taskService.deleteTask(taskId);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/tasks/{id}/status")
	@PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD') or @taskSecurityService.isTaskAssignee(#taskId, principal.username)")
	public ResponseEntity<TaskResponseDto> updateTaskStatus(@PathVariable("id") Long taskId,
			@RequestBody @Valid TaskStatusUpdateDto statusUpdateDto) {
		TaskResponseDto updatedTask = taskService.updateTaskStatus(taskId, statusUpdateDto.getStatus());
		return ResponseEntity.ok(updatedTask);
	}

	@GetMapping("/tasks/prioritized")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<TaskResponseDto>> getPrioritizedTasks() {
		List<TaskResponseDto> tasks = taskService.getTasksWithSmartPrioritization();
		return ResponseEntity.ok(tasks);
	}

	@GetMapping("/teams/{teamId}/tasks")
	@PreAuthorize("hasRole('ADMIN') or @teamSecurityService.isTeamMemberOrLead(#teamId, principal.username)")
	public ResponseEntity<List<TaskResponseDto>> getTasksForTeam(@PathVariable Long teamId) {
		List<TaskResponseDto> tasks = taskService.getTasksByTeamId(teamId);
		return ResponseEntity.ok(tasks);
	}
}
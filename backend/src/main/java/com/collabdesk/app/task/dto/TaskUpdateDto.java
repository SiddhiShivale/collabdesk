package com.collabdesk.app.task.dto;

import java.time.LocalDate;
import java.util.List;

import com.collabdesk.app.task.entity.Importance;
import com.collabdesk.app.task.entity.TaskStatus;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TaskUpdateDto {

	private String title;
	private String description;
	private Importance importance;
	private TaskStatus status;
	private Long teamId;
	private List<Long> assigneeIds;

	@FutureOrPresent(message = "Due date must be in the present or future")
	private LocalDate dueDate;

	private Long dependsOnTaskId;
}
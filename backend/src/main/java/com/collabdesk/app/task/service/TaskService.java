package com.collabdesk.app.task.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabdesk.app.analytics.dto.AnalyticsDto;
import com.collabdesk.app.mapper.TaskMapper;
import com.collabdesk.app.task.Task;
import com.collabdesk.app.task.TaskStatus;
import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import com.collabdesk.app.task.repository.TaskRepository;
import com.collabdesk.app.team.Team;
import com.collabdesk.app.team.repository.TeamRepository;
import com.collabdesk.app.user.User;
import com.collabdesk.app.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TaskService {

	@Autowired
	private TaskRepository taskRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private TaskMapper taskMapper;

	@Transactional(readOnly = true)
	public AnalyticsDto getSystemAnalytics() {
		List<Task> allTasks = taskRepository.findAll();
		long totalTasks = allTasks.size();

		long totalUsers = userRepository.count();
		long totalTeams = teamRepository.count();

		Map<String, Long> tasksByStatus = allTasks.stream()
				.collect(Collectors.groupingBy(task -> task.getStatus().name(), Collectors.counting()));

		long doneTasks = tasksByStatus.getOrDefault(TaskStatus.DONE.name(), 0L);

		long overdueTasks = allTasks.stream().filter(task -> task.getDueDate() != null
				&& task.getDueDate().isBefore(LocalDate.now()) && task.getStatus() != TaskStatus.DONE).count();

		double completionRate = (totalTasks > 0)

				? Math.round(((double) doneTasks / totalTasks) * 10000.0) / 100.0
				: 0.0;

		Map<String, Long> tasksByTeam = allTasks.stream()
				.filter(task -> task.getTeam() != null && task.getStatus() != TaskStatus.DONE)
				.collect(Collectors.groupingBy(task -> task.getTeam().getName(), Collectors.counting()));

		return new AnalyticsDto(totalTasks, totalUsers, totalTeams, overdueTasks, completionRate, tasksByStatus,
				tasksByTeam);
	}

	@Transactional
	public TaskResponseDto createTask(TaskCreateDto createDto) {
		User creator = getCurrentUser();
		Team team = teamRepository.findById(createDto.getTeamId())
				.orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + createDto.getTeamId()));

		List<User> assignees = userRepository.findAllById(createDto.getAssigneeIds());
		if (assignees.size() != createDto.getAssigneeIds().size()) {
			throw new EntityNotFoundException("One or more assignees not found.");
		}

		Task task = taskMapper.toTask(createDto);
		task.setCreator(creator);
		task.setTeam(team);
		task.setAssignees(assignees);
		task.setStatus(TaskStatus.TO_DO); // Initial status

		Task savedTask = taskRepository.save(task);
		return taskMapper.toTaskResponseDto(savedTask);
	}

	@Transactional(readOnly = true)
	public TaskResponseDto getTaskById(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));
		return taskMapper.toTaskResponseDto(task);
	}

	@Transactional(readOnly = true)
	public List<TaskResponseDto> getAllTasksForAdmin() {
		List<Task> tasks = taskRepository.findAll();
		return taskMapper.toTaskResponseDtoList(tasks);
	}

	@Transactional
	public TaskResponseDto updateTask(Long taskId, TaskUpdateDto updateDto) {
		Task existingTask = taskRepository.findById(taskId)
				.orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

		taskMapper.updateTaskFromDto(updateDto, existingTask);

		if (updateDto.getTeamId() != null) {
			Team newTeam = teamRepository.findById(updateDto.getTeamId())
					.orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + updateDto.getTeamId()));
			existingTask.setTeam(newTeam);
		}

		if (updateDto.getAssigneeIds() != null && !updateDto.getAssigneeIds().isEmpty()) {
			List<User> newAssignees = userRepository.findAllById(updateDto.getAssigneeIds());
			existingTask.setAssignees(newAssignees);
		}

		Task updatedTask = taskRepository.save(existingTask);
		return taskMapper.toTaskResponseDto(updatedTask);
	}

	@Transactional
	public TaskResponseDto updateTaskStatus(Long taskId, TaskStatus status) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));
		task.setStatus(status);
		Task updatedTask = taskRepository.save(task);
		return taskMapper.toTaskResponseDto(updatedTask);
	}

	@Transactional
	public void deleteTask(Long taskId) {
		if (!taskRepository.existsById(taskId)) {
			throw new EntityNotFoundException("Task not found with ID: " + taskId);
		}
		taskRepository.deleteById(taskId);
	}

	@Transactional(readOnly = true)
	public List<TaskResponseDto> getTasksByTeamId(Long teamId) {
		if (!teamRepository.existsById(teamId)) {
			throw new EntityNotFoundException("Team not found with ID: " + teamId);
		}
		return taskRepository.findByTeamId(teamId).stream().map(taskMapper::toTaskResponseDto)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<TaskResponseDto> getTasksWithSmartPrioritization() {
		List<Task> tasks = taskRepository.findAll();

		Comparator<Task> comparator = Comparator.comparingInt(this::calculatePriorityScore).reversed();

		return tasks.stream().sorted(comparator).map(taskMapper::toTaskResponseDto).collect(Collectors.toList());
	}

	private int calculatePriorityScore(Task task) {
		int score = 0;

		// Priority based on status
		switch (task.getStatus()) {
		case IN_PROGRESS:
			score += 1000;
			break;
		case TO_DO:
			score += 500;
			break;
		case BLOCKED:
			score -= 500;
			break;
		case DONE:
			return Integer.MIN_VALUE;
		}

		// Priority based on due date
		if (task.getDueDate() != null) {
			long daysUntilDue = ChronoUnit.DAYS.between(LocalDate.now(), task.getDueDate());
			if (daysUntilDue < 0) {
				score += 2000; // Overdue tasks are critical
			} else if (daysUntilDue <= 3) {
				score += 500; // Due soon
			} else if (daysUntilDue <= 7) {
				score += 200; // Due within a week
			}
		}

		return score;
	}

	private User getCurrentUser() {
		String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new EntityNotFoundException("Current user not found in database"));
	}
}
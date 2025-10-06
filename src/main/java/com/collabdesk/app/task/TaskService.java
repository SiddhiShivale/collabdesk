package com.collabdesk.app.task;

import com.collabdesk.app.mapper.TaskMapper;
import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import com.collabdesk.app.task.entity.Task;
import com.collabdesk.app.user.UserRepository;
import com.collabdesk.app.user.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Transactional
    public TaskResponseDto createTask(TaskCreateDto createDto) {
        User creator = getCurrentUser();
        User assignee = userRepository.findById(createDto.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("Assignee not found with ID: " + createDto.getAssigneeId()));

        Task task = taskMapper.toTask(createDto);
        task.setCreator(creator);
        task.setAssignee(assignee);
        task.setStatus(TaskStatus.TO_DO);

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
    public List<TaskResponseDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskMapper::toTaskResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDto updateTask(Long taskId, TaskUpdateDto updateDto) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

        taskMapper.updateTaskFromDto(updateDto, existingTask);

        if (updateDto.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(updateDto.getAssigneeId())
                    .orElseThrow(() -> new EntityNotFoundException("Assignee not found with ID: " + updateDto.getAssigneeId()));
            existingTask.setAssignee(newAssignee);
        }

        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toTaskResponseDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Task not found with ID: " + taskId);
        }
        taskRepository.deleteById(taskId);
    }

    /**
     * Smart Prioritization Engine:
     * Sorts tasks based on a priority score.
     * Priority is determined by:
     * 1. Due date (closer dates are higher priority).
     * 2. Status (TO_DO and IN_PROGRESS are higher than DONE or BLOCKED).
     */
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getTasksWithSmartPrioritization() {
        List<Task> tasks = taskRepository.findAll();

        Comparator<Task> comparator = Comparator.comparingInt(this::calculatePriorityScore).reversed();

        return tasks.stream()
                .sorted(comparator)
                .map(taskMapper::toTaskResponseDto)
                .collect(Collectors.toList());
    }

    private int calculatePriorityScore(Task task) {
        int score = 0;

        // Higher score for more urgent statuses
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
                return Integer.MIN_VALUE; // Already done, lowest priority
        }

        // Higher score for tasks with closer due dates
        if (task.getDueDate() != null) {
            long daysUntilDue = ChronoUnit.DAYS.between(LocalDate.now(), task.getDueDate());
            if (daysUntilDue < 0) {
                score += 2000; // Overdue tasks are highest priority
            } else if (daysUntilDue <= 3) {
                score += 500; // Due within 3 days
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
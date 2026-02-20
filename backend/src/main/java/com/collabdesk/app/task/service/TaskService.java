package com.collabdesk.app.task.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabdesk.app.analytics.dto.AnalyticsDto;
import com.collabdesk.app.mapper.TaskAssignmentMapper;
import com.collabdesk.app.mapper.TaskMapper;
import com.collabdesk.app.task.dto.TaskAssignmentDto;
import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import com.collabdesk.app.task.entity.Task;
import com.collabdesk.app.task.entity.TaskAssignment;
import com.collabdesk.app.task.entity.TaskStatus;
import com.collabdesk.app.task.repository.TaskAssignmentRepository;
import com.collabdesk.app.task.repository.TaskRepository;
import com.collabdesk.app.team.entity.Team;
import com.collabdesk.app.team.repository.TeamRepository;
import com.collabdesk.app.user.entity.User;
import com.collabdesk.app.user.repository.UserRepository;
import com.collabdesk.app.util.EmailService;

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
    private TaskAssignmentRepository taskAssignmentRepository;
    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private TaskAssignmentMapper taskAssignmentMapper; 
    @Autowired
    private EmailService emailService;

    @Transactional(readOnly = true)
    public AnalyticsDto getSystemAnalytics() {
        long totalTasks = taskRepository.count();
        long totalUsers = userRepository.count();
        long totalTeams = teamRepository.count();


        Map<String, Long> tasksByStatus = taskAssignmentRepository.countTasksByStatus().stream()
                .collect(Collectors.toMap(obj -> obj[0].toString(), obj -> (Long) obj[1]));

        long totalAssignments = tasksByStatus.values().stream().mapToLong(Long::longValue).sum();
        long doneAssignments = tasksByStatus.getOrDefault(TaskStatus.DONE.name(), 0L);
        double completionRate = (totalAssignments > 0)
                ? Math.round(((double) doneAssignments / totalAssignments) * 100.0)
                : 0.0;

        long overdueTasks = taskRepository.countOverdueTasks();
        Map<String, Long> tasksByTeam = taskRepository.countActiveTasksByTeam().stream()
                .collect(Collectors.toMap(obj -> (String) obj[0], obj -> (Long) obj[1]));


        return new AnalyticsDto(totalTasks, totalUsers, totalTeams, overdueTasks, completionRate, tasksByStatus, tasksByTeam);
    }

    @Transactional
    public TaskResponseDto createTask(TaskCreateDto createDto) {
        User creator = getCurrentUserEntity();
        Team team = teamRepository.findById(createDto.getTeamId())
                .orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + createDto.getTeamId()));

        List<User> assignees = userRepository.findAllById(createDto.getAssigneeIds());
        if (assignees.size() != createDto.getAssigneeIds().size()) {
            throw new EntityNotFoundException("One or more assignees not found.");
        }

        Task task = new Task();
        task.setTitle(createDto.getTitle());
        task.setDescription(createDto.getDescription());
        task.setImportance(createDto.getImportance());
        task.setDueDate(createDto.getDueDate());
        task.setCreator(creator);
        task.setTeam(team);

        if (createDto.getDependsOnTaskId() != null) {
            Task dependency = taskRepository.findById(createDto.getDependsOnTaskId())
                    .orElseThrow(() -> new EntityNotFoundException("Dependency task not found."));
            task.setDependsOn(dependency);
        }

        Task savedTask = taskRepository.save(task);

        List<TaskAssignment> assignments = new ArrayList<>();
        for (User assignee : assignees) {
            TaskAssignment assignment = new TaskAssignment(null, savedTask, assignee, TaskStatus.TO_DO);
            assignments.add(assignment);
            emailService.sendTaskAssignmentEmail(assignee.getEmail(), savedTask.getTitle(), creator.getName());
        }
        taskAssignmentRepository.saveAll(assignments);
        savedTask.setAssignments(assignments);

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
    	return taskMapper.toTaskResponseDtoList(taskRepository.findAllWithDetails());
    }

    @Transactional
    public TaskResponseDto updateTask(Long taskId, TaskUpdateDto updateDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

        if (updateDto.getTitle() != null) task.setTitle(updateDto.getTitle());
        if (updateDto.getDescription() != null) task.setDescription(updateDto.getDescription());
        if (updateDto.getImportance() != null) task.setImportance(updateDto.getImportance());
        if (updateDto.getDueDate() != null) task.setDueDate(updateDto.getDueDate());

        if (updateDto.getDependsOnTaskId() != null) {
            if (updateDto.getDependsOnTaskId().equals(task.getId())) {
                 throw new IllegalArgumentException("A task cannot depend on itself.");
            }
            Task dependency = taskRepository.findById(updateDto.getDependsOnTaskId())
                    .orElseThrow(() -> new EntityNotFoundException("Dependency task not found."));
            task.setDependsOn(dependency);
        } else {
            task.setDependsOn(null); 
        }
        
        if (updateDto.getAssigneeIds() != null) {
            List<User> newAssignees = userRepository.findAllById(updateDto.getAssigneeIds());
            if (newAssignees.size() != updateDto.getAssigneeIds().size()) {
                throw new EntityNotFoundException("One or more assignees not found.");
            }

            Map<Long, TaskAssignment> currentAssignmentsMap = task.getAssignments().stream()
                    .collect(Collectors.toMap(a -> a.getUser().getId(), Function.identity()));

            task.getAssignments().removeIf(assignment -> !updateDto.getAssigneeIds().contains(assignment.getUser().getId()));

            for (User assignee : newAssignees) {
                if (!currentAssignmentsMap.containsKey(assignee.getId())) {
                    TaskAssignment newAssignment = new TaskAssignment(null, task, assignee, TaskStatus.TO_DO);
                    task.getAssignments().add(newAssignment);
                    emailService.sendTaskAssignmentEmail(assignee.getEmail(), task.getTitle(), task.getCreator().getName());
                }
            }
        }

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
    	  return taskMapper.toTaskResponseDtoList(taskRepository.findByTeamIdWithDetails(teamId));
    }

    @Transactional
    public TaskAssignmentDto updateTaskAssignmentStatus(Long assignmentId, TaskStatus newStatus) {
        TaskAssignment assignment = taskAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Task assignment not found with ID: " + assignmentId));

        Task task = assignment.getTask();
        if (newStatus == TaskStatus.IN_PROGRESS && task.getDependsOn() != null &&
            isDependencyIncompleteForUser(task.getDependsOn(), assignment.getUser())) {
            throw new IllegalStateException("Cannot start task until its dependency is completed.");
        }

        assignment.setStatus(newStatus);
        TaskAssignment updatedAssignment = taskAssignmentRepository.save(assignment);
        emailService.sendTaskStatusUpdateEmail(assignment.getUser().getEmail(), task.getTitle(), newStatus.name());
        return taskAssignmentMapper.toTaskAssignmentDto(updatedAssignment);
    }

    private boolean isDependencyIncompleteForUser(Task dependency, User user) {
        return taskAssignmentRepository.findByTaskIdAndUserId(dependency.getId(), user.getId())
                .map(assignment -> assignment.getStatus() != TaskStatus.DONE)
                .orElse(true);
    }

    @Transactional(readOnly = true)
    public List<TaskAssignmentDto> getPrioritizedTasksForCurrentUser() {
        User currentUser = getCurrentUserEntity();
        List<TaskAssignment> assignments = taskAssignmentRepository.findByUserId(currentUser.getId());
        assignments.sort(Comparator.comparingInt((TaskAssignment a) -> calculatePriorityScore(a.getTask())).reversed());
        return assignments.stream()
                .map(taskAssignmentMapper::toTaskAssignmentDto)
                .collect(Collectors.toList());
    }

    private int calculatePriorityScore(Task task) {
        int score = 0;
        if (task.getImportance() != null) {
            switch (task.getImportance()) {
                case HIGH: score += 1500; break;
                case MEDIUM: score += 750; break;
                case LOW: score += 100; break;
            }
        }
        if (task.getDueDate() != null) {
            long daysUntilDue = ChronoUnit.DAYS.between(LocalDate.now(), task.getDueDate());
            if (daysUntilDue < 0) score += 2000;
            else if (daysUntilDue <= 3) score += 500;
            else if (daysUntilDue <= 7) score += 200;
        }
        return score;
    }

    private User getCurrentUserEntity() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found in database"));
    }
}
package com.collabdesk.app.task.service;

import com.collabdesk.app.task.entity.Task;
import com.collabdesk.app.task.repository.TaskAssignmentRepository;
import com.collabdesk.app.task.repository.TaskRepository;
import com.collabdesk.app.user.entity.User;
import com.collabdesk.app.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("taskSecurityService")
public class TaskSecurityService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;

    @Transactional(readOnly = true)
    public boolean isAssigneeOfAssignment(Long assignmentId, String userEmail) {
        return taskAssignmentRepository.findById(assignmentId)
                .map(assignment -> assignment.getUser().getEmail().equals(userEmail))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean canViewTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) return false;
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return false;
        if (user.getRole().name().equals("ADMIN")) return true;
        return task.getTeam().getMembers().stream().anyMatch(member -> member.getEmail().equals(userEmail));
    }

    @Transactional(readOnly = true)
    public boolean canDeleteTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) return false;
        return task.getCreator().getEmail().equals(userEmail);
    }
}
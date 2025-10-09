package com.collabdesk.app.task;

import com.collabdesk.app.task.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("taskSecurityService")
public class TaskSecurityService {

    @Autowired
    private TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public boolean isTaskAssignee(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return false;
        }
        return task.getAssignees().stream()
                .anyMatch(assignee -> assignee.getEmail().equals(userEmail));
    }
}
package com.collabdesk.app.task.service;

import com.collabdesk.app.task.entity.Task;
import com.collabdesk.app.task.entity.TaskAssignment;
import com.collabdesk.app.task.entity.TaskStatus;
import com.collabdesk.app.task.repository.TaskRepository;
import com.collabdesk.app.util.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 9 * * ?") 
    public void sendDueDateReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Task> tasksDueTomorrow = taskRepository.findAll().stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().equals(tomorrow))
                .toList();

        for (Task task : tasksDueTomorrow) {
            for (TaskAssignment assignment : task.getAssignments()) {
                if (assignment.getStatus() != TaskStatus.DONE) {
                    emailService.sendTaskDueDateReminderEmail(
                            assignment.getUser().getEmail(),
                            task.getTitle(),
                            task.getDueDate()
                    );
                }
            }
        }
    }
}
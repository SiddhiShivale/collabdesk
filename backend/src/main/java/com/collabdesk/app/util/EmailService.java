package com.collabdesk.app.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;
    
    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;
    
    @Value("${application.frontend.url}")
    private String frontendUrl;


    public void sendOtpEmail(String to, String otp) {
        Context context = new Context();
        context.setVariable("otp", otp);
        sendHtmlEmail(to, "Your CollabDesk Password Reset OTP", "password-reset-template", context);
    }
    
    public void sendTaskAssignmentEmail(String to, String taskTitle, String assignerName) {
        Context context = new Context();
        context.setVariable("title", "New Task Assigned");
        context.setVariable("messageBody", "A new task has been assigned to you by <strong>" + assignerName + "</strong>.");
        context.setVariable("taskTitle", taskTitle);
        sendHtmlEmail(to, "New Task Assigned: " + taskTitle, "task-notification-template", context);
    }
    
    public void sendTaskStatusUpdateEmail(String to, String taskTitle, String newStatus) {
        Context context = new Context();
        context.setVariable("title", "Task Status Updated");
        context.setVariable("messageBody", "The status of the following task was updated to: <strong>" + newStatus + "</strong>.");
        context.setVariable("taskTitle", taskTitle);
        sendHtmlEmail(to, "Task Status Updated: " + taskTitle, "task-notification-template", context);
    }
    
    public void sendTaskDueDateReminderEmail(String to, String taskTitle, LocalDate dueDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        Context context = new Context();
        context.setVariable("title", "Task Due Date Reminder");
        context.setVariable("messageBody", "This is a reminder that the following task is due soon. <br/>Due Date: <strong>" + dueDate.format(formatter) + "</strong>.");
        context.setVariable("taskTitle", taskTitle);
        sendHtmlEmail(to, "Task Reminder: " + taskTitle, "task-notification-template", context);
    }
    
    public void sendAccountSetupEmail(String to, String token) {
        Context context = new Context();
        context.setVariable("setupUrl", frontendUrl + "/setup-account?token=" + token);
        sendHtmlEmail(to, "Welcome to CollabDesk! Set Up Your Account", "account-setup-template", context);
    }
    
    private void sendHtmlEmail(String to, String subject, String templateName, Context context) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            String htmlContent = templateEngine.process("email/" + templateName, context);
            helper.setTo(to);
            helper.setFrom(senderEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
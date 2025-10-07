package com.collabdesk.app.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            mailMessage.setFrom(senderEmail);
            mailMessage.setTo(to);
            mailMessage.setSubject("Your CollabDesk Password Reset OTP");
            mailMessage.setText("Hello,\n\n"
                    + "Your one-time password for resetting your CollabDesk account password is: " + otp + "\n\n"
                    + "This OTP is valid for 10 minutes. If you did not request this, please ignore this email.\n\n"
                    + "Thank you,\nThe CollabDesk Team");

            javaMailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}
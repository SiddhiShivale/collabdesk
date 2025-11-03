package com.collabdesk.app.config;

import com.collabdesk.app.user.entity.Role;
import com.collabdesk.app.user.entity.User;
import com.collabdesk.app.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${collabdesk.admin.email}")
    private String adminEmail;

    @Value("${collabdesk.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
 
        List<User> adminUsers = userRepository.findByRole(Role.ADMIN);

        if (adminUsers.isEmpty()) {
            log.info("No ADMIN user found. Creating default admin user...");

            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true); 

            userRepository.save(admin);
            log.info("Default ADMIN user created successfully with email: {}", adminEmail);
        } else {
            log.info("Admin user already exists. Skipping creation.");
        }
    }
}
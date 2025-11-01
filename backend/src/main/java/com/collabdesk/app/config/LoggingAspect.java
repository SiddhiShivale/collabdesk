package com.collabdesk.app.config;

import java.time.LocalDateTime;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.collabdesk.app.log.entity.Log;
import com.collabdesk.app.log.repository.LogRepository;
import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class LoggingAspect {

    @Autowired
    private LogRepository logRepository;

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restControllerMethods() {}

    @AfterReturning(pointcut = "restControllerMethods()", returning = "result")
    public void logSuccessfulActivity(JoinPoint joinPoint, Object result) {
        logActivity(joinPoint, null);
    }

    @AfterThrowing(pointcut = "restControllerMethods()", throwing = "exception")
    public void logFailedActivity(JoinPoint joinPoint, Throwable exception) {
        logActivity(joinPoint, exception);
    }

    private void logActivity(JoinPoint joinPoint, Throwable exception) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        
        String username = "anonymous";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            username = authentication.getName();
        }

        if (request.getRequestURI().contains("/api/logs")) {
            return;
        }

        String action = request.getMethod() + " " + request.getRequestURI();
        String details;
        if (exception != null) {
            details = "Failed: " + exception.getMessage();
        } else {
            details = "Successfully executed " + joinPoint.getSignature().getName();
        }

        Log log = new Log();
        log.setUsername(username);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        log.setDetails(details);
        
        logRepository.save(log);
    }
}
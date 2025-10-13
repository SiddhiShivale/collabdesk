package com.collabdesk.app.analytics.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.analytics.dto.AnalyticsDto;
import com.collabdesk.app.task.service.TaskService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

	@Autowired
	private TaskService taskService;
	
	@GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDto> getAnalyticsDashboard() {
        AnalyticsDto analytics = taskService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }
}

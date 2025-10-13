package com.collabdesk.app.analytics.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class AnalyticsDto {

	private long totalTasks;
    private long totalUsers;
    private long totalTeams;
    private long overdueTasks;
    private double completionRate;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByTeam;
}

package com.collabdesk.app.log.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.log.entity.Log;
import com.collabdesk.app.log.repository.LogRepository;

@RestController
@RequestMapping("/api/logs")
@PreAuthorize("hasRole('ADMIN')")
public class LogController {
    @Autowired private LogRepository logRepository;

    @GetMapping
    public ResponseEntity<Page<Log>> getAllLogs(
        @PageableDefault(sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(logRepository.findAll(pageable));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Log>> getAllLogs() {
        return ResponseEntity.ok(logRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp")));
    }
}
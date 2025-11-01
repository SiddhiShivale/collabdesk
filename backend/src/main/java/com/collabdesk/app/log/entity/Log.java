package com.collabdesk.app.log.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "logs")
public class Log {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    private String username;
    private String action;
    private LocalDateTime timestamp;
    private String details;
}
package com.collabdesk.app.task.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.collabdesk.app.task.entity.TaskAssignment;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByUserId(Long userId);
    Optional<TaskAssignment> findByTaskIdAndUserId(Long taskId, Long userId);
    
    @Query("SELECT t.status, COUNT(t) FROM TaskAssignment t GROUP BY t.status")
    List<Object[]> countTasksByStatus();
}
package com.collabdesk.app.task.repository;

import com.collabdesk.app.task.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByUserId(Long userId);
    Optional<TaskAssignment> findByTaskIdAndUserId(Long taskId, Long userId);
}
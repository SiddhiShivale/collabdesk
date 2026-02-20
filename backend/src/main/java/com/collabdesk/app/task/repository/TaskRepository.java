package com.collabdesk.app.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.collabdesk.app.task.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	
	List<Task> findByTeamId(Long teamId);
	
	@Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.creator LEFT JOIN FETCH t.team LEFT JOIN FETCH t.assignments WHERE t.team.id = :teamId")
	List<Task> findByTeamIdWithDetails(Long teamId);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.creator LEFT JOIN FETCH t.team LEFT JOIN FETCH t.assignments")
    List<Task> findAllWithDetails();

    @Query("SELECT COUNT(DISTINCT t) FROM Task t JOIN t.assignments a WHERE t.dueDate < CURRENT_DATE AND a.status != 'DONE'")
    long countOverdueTasks();

    @Query("SELECT t.team.name, COUNT(DISTINCT t) FROM Task t JOIN t.assignments a WHERE a.status != 'DONE' GROUP BY t.team.name")
    List<Object[]> countActiveTasksByTeam();
}
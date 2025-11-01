package com.collabdesk.app.team.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabdesk.app.team.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
	
	Optional<Team> findByName(String username);
	Optional<Team> findByLead_Email(String email);
    List<Team> findByLead_Id(Long leadId);
    List<Team> findByMembers_Id(Long memberId);
	
}
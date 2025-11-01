package com.collabdesk.app.team.controller;

import com.collabdesk.app.team.dto.AddMemberRequestDto;
import com.collabdesk.app.team.dto.TeamCreateDto;
import com.collabdesk.app.team.dto.TeamDto;
import com.collabdesk.app.team.service.TeamService;
import com.collabdesk.app.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeamDto> createTeam(@RequestBody @Valid TeamCreateDto createDto) {
        TeamDto createdTeam = teamService.createTeam(createDto);
        return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }
    
    @DeleteMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId); 
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN') or @teamSecurityService.isTeamLead(#teamId, principal.username)")
    public ResponseEntity<TeamDto> updateTeam(
            @PathVariable Long teamId, 
            @RequestBody @Valid TeamCreateDto updateDto) { 
        
        TeamDto updatedTeam = teamService.updateTeam(teamId, updateDto); 
        return ResponseEntity.ok(updatedTeam);
    }

    @GetMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN') or @teamSecurityService.isTeamMemberOrLead(#teamId, principal.username)")
    public ResponseEntity<TeamDto> getTeamById(@PathVariable Long teamId) {
        TeamDto team = teamService.getTeamById(teamId);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/{teamId}/members")
    @PreAuthorize("hasRole('ADMIN') or @teamSecurityService.isTeamMemberOrLead(#teamId, principal.username)")
    public ResponseEntity<List<UserDto>> getMembersOfTeam(@PathVariable Long teamId) {
        List<UserDto> members = teamService.getMembersOfTeam(teamId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("hasRole('ADMIN') or @teamSecurityService.isTeamLead(#teamId, principal.username)")
    public ResponseEntity<TeamDto> addMemberToTeam(@PathVariable Long teamId, @RequestBody @Valid AddMemberRequestDto addMemberDto) {
        TeamDto updatedTeam = teamService.addMemberToTeam(teamId, addMemberDto.getUserId());
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("@teamSecurityService.isTeamLead(#teamId, principal.username)")
    public ResponseEntity<TeamDto> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamDto updatedTeam = teamService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @GetMapping("/my-team")
    @PreAuthorize("hasRole('TEAM_LEAD')")
    public ResponseEntity<TeamDto> getMyTeam(Principal principal) {
        TeamDto team = teamService.getTeamByLeadUsername(principal.getName());
        return ResponseEntity.ok(team);
    }
    
    
}
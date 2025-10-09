package com.collabdesk.app.team;

import com.collabdesk.app.mapper.TeamMapper;
import com.collabdesk.app.mapper.UserMapper;
import com.collabdesk.app.team.dto.TeamCreateDto;
import com.collabdesk.app.team.dto.TeamDto;
import com.collabdesk.app.team.entity.Team;
import com.collabdesk.app.user.UserRepository;
import com.collabdesk.app.user.dto.UserDto;
import com.collabdesk.app.user.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public TeamDto createTeam(TeamCreateDto dto) {
        User teamLead = userRepository.findById(dto.getTeamLeadId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + dto.getTeamLeadId()));

        Team team = new Team();
        team.setName(dto.getName());
        team.setLead(teamLead);
        team.setMembers(new ArrayList<>(List.of(teamLead))); // The lead is also a member

        Team savedTeam = teamRepository.save(team);
        return teamMapper.toTeamDto(savedTeam);
    }

    @Transactional
    public TeamDto addMemberToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + teamId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (team.getMembers().stream().anyMatch(member -> member.getId().equals(userId))) {
            throw new IllegalStateException("User is already a member of this team.");
        }

        team.getMembers().add(user);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toTeamDto(updatedTeam);
    }

    @Transactional
    public TeamDto removeMemberFromTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + teamId));

        if (team.getLead().getId().equals(userId)) {
            throw new IllegalArgumentException("The team lead cannot be removed from the team.");
        }

        boolean removed = team.getMembers().removeIf(member -> member.getId().equals(userId));
        if (!removed) {
            throw new EntityNotFoundException("User with ID " + userId + " is not a member of this team.");
        }

        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toTeamDto(updatedTeam);
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + teamId));
        return teamMapper.toTeamDto(team);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getMembersOfTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with ID: " + teamId));
        return team.getMembers().stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(teamMapper::toTeamDto)
                .collect(Collectors.toList());
    }
}
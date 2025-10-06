package com.collabdesk.app.team;

import com.collabdesk.app.team.entity.Team;
import com.collabdesk.app.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("teamSecurityService")
public class TeamSecurityService {

    @Autowired
    private TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public boolean isTeamLead(Long teamId, String userEmail) {
        Team team = teamRepository.findById(teamId).orElse(null);
        return team != null && team.getLead().getEmail().equals(userEmail);
    }

    @Transactional(readOnly = true)
    public boolean isTeamMemberOrLead(Long teamId, String userEmail) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            return false;
        }
        // Check if the user is the lead
        if (team.getLead().getEmail().equals(userEmail)) {
            return true;
        }
        // Check if the user is in the members list
        return team.getMembers().stream().anyMatch(member -> member.getEmail().equals(userEmail));
    }
}
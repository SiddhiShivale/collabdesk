package com.collabdesk.app.mapper;

import com.collabdesk.app.team.dto.TeamDto;
import com.collabdesk.app.team.entity.Team;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface TeamMapper {
	
    TeamDto toTeamDto(Team team);
    
    Team toTeam(TeamDto teamDto);
}
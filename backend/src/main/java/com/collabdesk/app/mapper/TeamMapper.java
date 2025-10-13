package com.collabdesk.app.mapper;

import com.collabdesk.app.team.Team;
import com.collabdesk.app.team.dto.TeamDto;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface TeamMapper {
	
    //Maps a Team entity to a TeamDto.
    TeamDto toTeamDto(Team team);

    //Maps a TeamDto to a Team entity.
    Team toTeam(TeamDto teamDto);
}
package com.collabdesk.app.mapper;

import com.collabdesk.app.user.User;
import com.collabdesk.app.user.dto.UserDto;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
    //Maps a User entity to a UserDto.
    UserDto toUserDto(User user);

    //Maps a UserDto to a User entity.
    User toUser(UserDto userDto);
}
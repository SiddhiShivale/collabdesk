package com.collabdesk.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.collabdesk.app.user.dto.UserDto;
import com.collabdesk.app.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	 @Mapping(source = "enabled", target = "enabled") 
	 @Mapping(source = "deleted", target = "deleted")
	 UserDto toUserDto(User user);

	 User toUser(UserDto userDto);
}
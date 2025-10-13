package com.collabdesk.app.user.dto;

import com.collabdesk.app.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ProfileResponseDto {
	private Long id;
    private String name;
    private String email;
    private String role;
    
	public static ProfileResponseDto fromEntity(User user) {
		return new ProfileResponseDto(
	            user.getId(),
	            user.getName(),
	            user.getEmail(),
	            user.getRole().name() 	
	        );
	}
}

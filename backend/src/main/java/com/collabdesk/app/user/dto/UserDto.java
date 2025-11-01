package com.collabdesk.app.user.dto;

import com.collabdesk.app.user.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean enabled; 
    private boolean deleted;
}
package com.collabdesk.app.auth.dto;

import com.collabdesk.app.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private UserDto user;
}
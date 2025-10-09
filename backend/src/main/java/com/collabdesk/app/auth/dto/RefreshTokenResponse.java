package com.collabdesk.app.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {
    private String accessToken;
}
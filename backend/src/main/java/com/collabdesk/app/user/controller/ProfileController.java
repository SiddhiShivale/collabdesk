package com.collabdesk.app.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.user.dto.ProfileResponseDto;
import com.collabdesk.app.user.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
	
	@Autowired
	private UserService userService;

	@GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile() {
        ProfileResponseDto profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }
}

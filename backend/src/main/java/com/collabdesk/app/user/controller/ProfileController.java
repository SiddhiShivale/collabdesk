package com.collabdesk.app.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabdesk.app.user.dto.PasswordChangeRequestDto;
import com.collabdesk.app.user.dto.ProfileNameUpdateDto;
import com.collabdesk.app.user.dto.ProfileResponseDto;
import com.collabdesk.app.user.service.UserService;

import jakarta.validation.Valid;

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
	
    @PutMapping
    public ResponseEntity<ProfileResponseDto> updateProfileName(@RequestBody @Valid ProfileNameUpdateDto nameUpdateDto) {
        ProfileResponseDto profile = userService.updateProfileName(nameUpdateDto.getName());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/password")
	public ResponseEntity<Void> changePassword(@RequestBody @Valid PasswordChangeRequestDto passwordDto) {
		userService.changePassword(passwordDto.getCurrentPassword(), passwordDto.getNewPassword());
		return ResponseEntity.ok().build();
	}
}

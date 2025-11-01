package com.collabdesk.app.user.controller;

import com.collabdesk.app.user.dto.UserDto;
import com.collabdesk.app.user.dto.UserUpdateDto;
import com.collabdesk.app.user.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") Long userId, @RequestBody @Valid UserUpdateDto userUpdateDto) {
        UserDto updatedUser = userService.updateUser(userId, userUpdateDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/toggle-activation") 
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleUserActivation(@PathVariable("id") Long userId) {
        userService.toggleUserActivation(userId);
        return ResponseEntity.noContent().build();
    }
    
}
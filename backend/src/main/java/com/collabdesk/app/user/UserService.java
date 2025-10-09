package com.collabdesk.app.user;

import com.collabdesk.app.mapper.UserMapper;
import com.collabdesk.app.user.dto.UserDto;
import com.collabdesk.app.user.dto.UserUpdateDto;
import com.collabdesk.app.user.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
    	  return userRepository.findByRoleNot(Role.ADMIN).stream()
                  .map(userMapper::toUserDto)
                  .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return userMapper.toUserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long userId, UserUpdateDto userUpdateDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Check if the new email is already taken by another user
        userRepository.findByEmail(userUpdateDto.getEmail()).ifPresent(user -> {
            if (!user.getId().equals(userId)) {
                throw new IllegalStateException("Email " + userUpdateDto.getEmail() + " is already in use.");
            }
        });

        existingUser.setName(userUpdateDto.getName());
        existingUser.setEmail(userUpdateDto.getEmail());
        existingUser.setRole(userUpdateDto.getRole());

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toUserDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
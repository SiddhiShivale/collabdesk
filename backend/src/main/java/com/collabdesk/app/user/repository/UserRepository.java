package com.collabdesk.app.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.collabdesk.app.user.entity.Role;
import com.collabdesk.app.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByEmail(String email);
    List<User> findByRoleNot(Role role);
    Optional<User> findByAccountSetupToken(String token);
    List<User> findByRole(Role role);

    @Query(value = "SELECT * FROM users WHERE id = ?1", nativeQuery = true)
    Optional<User> findByIdEvenIfDeleted(Long id);

    @Query(value = "SELECT * FROM users", nativeQuery = true)
    List<User> findAllWithSoftDeleted();
}
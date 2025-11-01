package com.collabdesk.app.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collabdesk.app.log.entity.Log;

public interface LogRepository extends JpaRepository<Log, Long>{

}

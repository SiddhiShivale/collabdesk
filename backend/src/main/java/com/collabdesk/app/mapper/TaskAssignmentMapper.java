package com.collabdesk.app.mapper;

import com.collabdesk.app.task.dto.TaskAssignmentDto;
import com.collabdesk.app.task.entity.TaskAssignment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TaskMapper.class, UserMapper.class})
public interface TaskAssignmentMapper {
    TaskAssignmentDto toTaskAssignmentDto(TaskAssignment taskAssignment);
    TaskAssignment toTaskAssignment(TaskAssignmentDto taskAssignmentDto);
}
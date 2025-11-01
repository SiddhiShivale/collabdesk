package com.collabdesk.app.mapper;

import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.UserAssignmentStatusDto;
import com.collabdesk.app.task.entity.Task;
import com.collabdesk.app.task.entity.TaskAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TeamMapper.class})
public interface TaskMapper {

    @Mapping(source = "dependsOn", target = "dependsOn")
    @Mapping(source = "assignments", target = "assignments") 
    TaskResponseDto toTaskResponseDto(Task task);

    List<TaskResponseDto> toTaskResponseDtoList(List<Task> tasks);

    default List<UserAssignmentStatusDto> mapAssignments(List<TaskAssignment> assignments) {
        if (assignments == null) {
            return null;
        }
        return assignments.stream()
                .map(assignment -> new UserAssignmentStatusDto(
                        assignment.getUser().getId(),
                        assignment.getUser().getName(),
                        assignment.getStatus()
                ))
                .collect(Collectors.toList());
    }

}
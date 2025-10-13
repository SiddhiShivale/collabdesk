package com.collabdesk.app.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import com.collabdesk.app.task.entity.Task;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TeamMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "team", ignore = true) 
    @Mapping(target = "assignees", ignore = true) 
    Task toTask(TaskCreateDto taskCreateDto);

    TaskResponseDto toTaskResponseDto(Task task);
    
    List<TaskResponseDto> toTaskResponseDtoList(List<Task> tasks);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "team", ignore = true) 
    @Mapping(target = "assignees", ignore = true) 
    void updateTaskFromDto(TaskUpdateDto taskUpdateDto, @MappingTarget Task task);
    
    
}
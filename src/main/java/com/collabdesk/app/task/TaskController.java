package com.collabdesk.app.task;

import com.collabdesk.app.task.dto.TaskCreateDto;
import com.collabdesk.app.task.dto.TaskResponseDto;
import com.collabdesk.app.task.dto.TaskUpdateDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid TaskCreateDto createDto) {
        TaskResponseDto createdTask = taskService.createTask(createDto);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable("id") Long taskId) {
        TaskResponseDto task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        List<TaskResponseDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/prioritized")
    public ResponseEntity<List<TaskResponseDto>> getPrioritizedTasks() {
        List<TaskResponseDto> tasks = taskService.getTasksWithSmartPrioritization();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable("id") Long taskId, @RequestBody @Valid TaskUpdateDto updateDto) {
        TaskResponseDto updatedTask = taskService.updateTask(taskId, updateDto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
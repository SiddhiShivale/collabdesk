import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus } from '../../core/models/task-model';

@Pipe({
  name: 'filterByStatus',
  standalone: true, 
})
export class FilterByStatusPipe implements PipeTransform {

  transform(tasks: Task[], status: TaskStatus): Task[] {
    if (!tasks || !status) {
      return [];
    }

    console.warn("filterByStatus pipe is deprecated and should not be used with the new data model.");
    return tasks.filter(task => 
      task.assignments && task.assignments.some(a => a.status === status)
    );
  }
}
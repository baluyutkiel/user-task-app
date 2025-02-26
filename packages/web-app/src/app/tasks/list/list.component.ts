import { Component } from '@angular/core';

import { Task } from '@take-home/shared';
import { take } from 'rxjs';
import { TasksService } from '../tasks.service';
import { Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Component({
    selector: 'take-home-list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: false
})
export class ListComponent {
  constructor(
    private storageService: StorageService,
    protected tasksService: TasksService,
    private router: Router,
  ) {
    this.getTaskList();
  }

  onDoneTask(item: Task): void {
    // mark as completed
    // save updated task to storage
    // Task (Optional?) : Updated functionality for Done Task
    item.completed = true;
    this.storageService.updateTaskItem(item);
    this.tasksService.getTasksFromStorage();
  }

  onDeleteTask(item: Task): void {
    // mark as archived
    // save updated task to storage
    // refresh list without archived items
    // Task (optional?) : Updated functionality for Delete Button
    item.isArchived = true;
    this.storageService.updateTaskItem(item);
    this.tasksService.getTasksFromStorage();
  }

  onAddTask(): void {
    // Task 1 (1/4): User should naviagte to a form when clicking Add Task
    this.router.navigate(['add']);
  }

  private getTaskList(): void {
    this.tasksService
      .getTasksFromApi()
      .pipe(take(1))
      .subscribe(async (tasks) => {
        tasks.forEach(async (task) => {
          await this.storageService.updateTaskItem(task);
        });
        await this.tasksService.getTasksFromStorage();
      });
  }
}

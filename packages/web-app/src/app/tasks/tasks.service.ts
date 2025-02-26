import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@take-home/shared';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getTasksFromApi(): Observable<Task[]> {
    const endpointUrl = '/api/tasks';
    return this.http.get<Task[]>(endpointUrl);
  }

  async getTasksFromStorage(): Promise<void> {
    this.tasks = await this.storageService.getTasks();
    this.filterTask('isArchived');
  }

  filterTask(key: keyof Task): void {
    switch (key) {
      case 'isArchived':
        this.tasks = this.tasks.filter((task) => !task.isArchived);
        break;
      case 'priority':
        // Task 2 (1/2) : Add filtering for 'High Priority' tasks
        this.tasks = this.tasks.filter((task) => task.priority === 'HIGH');
        break;
      case 'scheduledDate':
        // Task 2 (2/2): Add filtering for 'Due Today' tasks
        const today = new Date();
        this.tasks = this.tasks.filter(task => {
          const taskDate = new Date(task.scheduledDate);
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth()
          );
        });
        
        break;
      case 'completed':
        this.tasks = this.tasks.filter((task) => !task.completed);
    }
  }

  searchTask(search: string): void {
    if (search) {
      // Task 3 (1/2) : Implement a simple search that searches for all tasks that contain the search term in it's **title**
      this.tasks = this.tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
    } else {
      // Task 3 (2/2) : Clearing the search should reload all tasks
      this.getTasksFromStorage();
    }
  }
}

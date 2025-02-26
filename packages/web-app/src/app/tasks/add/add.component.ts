import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskPriority } from '@take-home/shared';
import { StorageService } from '../../storage/storage.service';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'take-home-add-component',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    standalone: false
})
export class AddComponent {
  protected addTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, {
      // Task 1 (2/4): Form should only allow tasks to be created which have
      // a title of at least 10 characters
      validators: [Validators.required, Validators.minLength(10)],
    }),
    description: new FormControl(null),
    priority: new FormControl(
      { value: TaskPriority.MEDIUM, disabled: false },
      {
        validators: Validators.required,
      },
    ),
    dueDate: new FormControl(new Date()), // Sets Default Date
  });
  protected priorities = Object.values(TaskPriority);
  protected minDate: Date = new Date();
  protected maxDate: Date = new Date();

  constructor(private storageService: StorageService, private router: Router) {
    this.maxDate.setDate(this.maxDate.getDate() + 6);
  }

  onSubmit() {
    const newTask: Task = {
      ...this.addTaskForm.getRawValue(),
      uuid: faker.string.uuid(),
      isArchived: false,
      // Task (Optional): allow user to set scheduled date using MatDatePicker
      // scheduledDate: new Date(),
      scheduledDate: this.addTaskForm.value.dueDate,
    };
    // Task 1 (3/4) : Add task should be included in the task list.
    this.storageService.updateTaskItem(newTask);
    this.router.navigateByUrl('/');
  }

  onCancel(): void {
    // Task 1 (4/4) : User should be navigated back home if adding or cancelling the form
    this.router.navigateByUrl('/');
  }
}

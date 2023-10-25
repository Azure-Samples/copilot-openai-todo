import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './task';
import { TaskItemComponent } from './task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  template: `
    <app-task-item 
      *ngFor="let task of tasks; trackBy: trackByTitle"
      [task]="task"
      (toggleCompleted)="toggleCompleted.emit(task)"
    ></app-task-item>
    <div class="count">{{ tasks.length }} item<span *ngIf="tasks.length !== 1">s</span></div>
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 400px;
      border: 1px solid #ccd;
      margin-bottom: 20px;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .count {
      padding: 5px;
      color: #99a;
      text-align: center;
    }
  `]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() toggleCompleted = new EventEmitter<Task>();

  trackByTitle(_index: number, task: Task) {
    return task.title;
  }
}

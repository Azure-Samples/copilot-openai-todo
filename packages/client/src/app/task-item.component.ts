import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './task';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label>
      <input type="checkbox" [checked]="task.completed" (change)="toggleCompleted.emit(!task.completed)" />
      {{ task.title }}
    </label>
  `,
  styles: [`
    :host {
      display: block;
      padding: 10px;
      border-bottom: 1px solid #ccd;
    }

    label {
      display: flex;
      align-items: center;
      color: #334;
      font-size: 1.2em;
    }

    input {
      position: relative;
      margin-right: 30px;
      width: 0;
      height: 20px;
    }

    input:before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      background-color: #e7e7e8;
    }

    label:hover input:before {
      background-color: #d7d7d8;
    }

    label input:checked:before {
      background-color: #29f;
    }

    input:checked:after {
      content: '';
      position: absolute;
      left: 7px;
      top: 3px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  `],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleCompleted = new EventEmitter<boolean>();
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilter } from './task.service';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label for="filter">Show tasks:</label>
    <select id="filter" [value]="filter" (change)="filterTasks($event)">
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
    </select>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    label {
      color: #667;
    }

    select {
      border-radius: 10px;
      padding: 5px;
      margin-left: 10px;
    }
  `]
})
export class TaskFilterComponent {
  @Input() filter!: TaskFilter;
  @Output() filterChange = new EventEmitter<TaskFilter>();

  filterTasks(event: Event) {
    const select = event.target as HTMLSelectElement;
    const filter = select.value as TaskFilter;
    this.filterChange.emit(filter);
  }
}

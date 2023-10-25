import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task } from './task';
import { getTasks, addTask, setTaskCompleted, TaskFilter } from './task.service';
import { TaskFilterComponent } from './task-filter.component';
import { TaskAddComponent } from './task-add.component';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskAddComponent, TaskListComponent, TaskFilterComponent],
  template: `
    <h1>TODO</h1>
    <app-task-add (added)="addTask($event)"></app-task-add>
    <app-task-list [tasks]="tasks" (toggleCompleted)="toggleTaskCompleted($event)"></app-task-list>
    <app-task-filter [filter]="currentFilter" (filterChange)="filterTasks($event)"></app-task-filter>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
      flex: 1 0 auto;
      flex-direction: column;
      align-items: center;
      background-color: #f0f0f2;
    }

    h1 {
      font-size: 5em;
      color: #29f;
      text-transform: lowercase;
      font-weight: 100;
      margin: 20px 0;
    }
  `],
})
export class AppComponent {
  tasks: Task[] = [];
  currentFilter: TaskFilter = TaskFilter.All;
  routes: Record<string, any> = {
    '/tasks/all': { title: 'All tasks' },
    '/tasks/active': { title: 'Active tasks' },
    '/tasks/completed': { title: 'Completed tasks' }
  };

  constructor() {
    window.onpopstate = () => this.updateRoute();
    this.updateRoute();
  }

  updateRoute() {
    const path = window.location.pathname;
    const routeData = this.routes[path];
    if (!routeData) {
      // Fallback route
      return this.navigate('/tasks/all');
    }
  
    document.title = `Todo - ${routeData.title}`;

    switch (path) {
      case '/tasks/active':
        this.currentFilter = TaskFilter.Active;
        break;
      case '/tasks/completed':
        this.currentFilter = TaskFilter.Completed;
        break;
      default:
        this.currentFilter = TaskFilter.All;
        break;
    }

    this.updateTasks();
  }

  navigate(path: string) {
    window.history.pushState({}, path, window.location.origin + path);
    this.updateRoute();
  }

  async updateTasks() {
    this.tasks = await getTasks(this.currentFilter);
  }

  async addTask(description: string) {
    await addTask(description);
    await this.updateTasks();
  }

  async toggleTaskCompleted(task: Task) {
    await setTaskCompleted(task, !task.completed);
    await this.updateTasks();
  }

  filterTasks(filter: TaskFilter) {
    this.navigate(`/tasks/${filter}`);
  }
}

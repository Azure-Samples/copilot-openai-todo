import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task } from './task';
import { getTasks, addTask, setTaskCompleted, TaskFilter } from './task.service';
import { TaskFilterComponent } from './task-filter.component';
import { TaskAddComponent } from './task-add.component';
import { TaskListComponent } from './task-list.component';
import { LoaderComponent } from './loader.component';
import { AddTask } from './add-task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskAddComponent, TaskListComponent, TaskFilterComponent, LoaderComponent],
  template: `
    <h1>TODO</h1>
    <app-task-add (added)="addTask($event)" [disabled]="loading"></app-task-add>
    <app-loader [loading]="loading"></app-loader>
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
      text-transform: lowercase;
      font-weight: 100;
      margin: 20px 0;
      color: #29f;
      background: linear-gradient(to right, #29f, #7cf);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `],
})
export class AppComponent {
  loading: boolean = false;
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
      return this.navigate('/tasks/active');
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
    this.loading = true;
    this.tasks = await getTasks(this.currentFilter);
    this.loading = false;
  }

  async addTask(data: AddTask) {
    this.loading = true;
    await addTask(data.title, data.useAiPlanner);
    await this.updateTasks();
    this.loading = false;
  }

  async toggleTaskCompleted(task: Task) {
    await setTaskCompleted(task, !task.completed);
    await this.updateTasks();
  }

  filterTasks(filter: TaskFilter) {
    this.navigate(`/tasks/${filter}`);
  }
}

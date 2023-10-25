import { Task } from './task';
import { environment } from '../environments/environment';

let userId = localStorage.getItem('userId');
if (!userId) {
  userId = Math.random().toString(36).substring(2);
  localStorage.setItem('userId', userId);
}
const apiUrl = `${environment.api}`;

let tasks: Task[] | undefined;

export enum TaskFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed'
}

export async function getTasks(filter: TaskFilter = TaskFilter.All): Promise<Task[]> {
  if (tasks === undefined) {
    const response = await fetch(`${apiUrl}/users/${userId}/tasks/`);
    tasks = await response.json() as Task[];
  }

  switch (filter) {
    case TaskFilter.Active:
      return tasks.filter(task => !task.completed);
    case TaskFilter.Completed:
      return tasks.filter(task => task.completed);
    default:
      return [...tasks];
  }
}

export async function addTask(title: string) {
  const response = await fetch(`${apiUrl}/users/${userId}/tasks/`, {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' }
  });
  const task = await response.json() as Task;
  tasks?.push(task);
}

export async function setTaskCompleted(task: Task, completed: boolean) {
  task.completed = completed;
  await fetch(`${apiUrl}/tasks/${task.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
    headers: { 'Content-Type': 'application/json' }
  });
}

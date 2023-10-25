import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="text" placeholder="What needs to be done?" (change)="addTask($event)" />
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 400px;
      display: flex;
      align-items: center;
      border: 1px solid #ccd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    
    input {
      border: 0;
      padding: 10px;
      margin-bottom: 20px;
      background-color: #fff;
      color: #334;
      font-size: 1.2em;
      width: 100%;
      margin: 0;
    }
    
    input::placeholder {
      color: #ccc;
      font-style: italic;
    }
  `]
})
export class TaskAddComponent {
  @Output() added = new EventEmitter<string>();

  addTask(event: Event) {
    const input = event.target as HTMLInputElement;
    const title = input.value;
    input.value = '';
    this.added.emit(title);
  }
}

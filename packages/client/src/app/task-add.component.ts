import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTask } from './add-task';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-container">
      <input type="text" placeholder="What needs to be done?" (change)="addTask($event)" [disabled]="disabled"/>
    </div>
    <input type="checkbox" id="aiPlanner" name="aiPlanner" (change)="toggleAIPlanner($event)">
    <label for="aiPlanner">Enable AI Planner</label>
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 400px;
      margin-bottom: 20px;
    }

    .input-container {
      display: flex;
      align-items: center;
      border: 1px solid #ccd;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      margin-bottom: 10px;
    }

    input[type="text"] {
      border: 0;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 10px;
      background-color: #fff;
      color: #334;
      font-size: 1.2em;
      width: 100%;
      margin: 0;
    }

    label:has(input[disabled]) {
      color: #ccc;
    }

    input::placeholder {
      color: #ccc;
      font-style: italic;
    }
  `]
})
export class TaskAddComponent {
  @Input() disabled: boolean = false;
  @Output() added = new EventEmitter<AddTask>();
  useAiPlanner: boolean = false;

  addTask(event: Event) {
    const input = event.target as HTMLInputElement;
    const title = input.value;
    input.value = '';
    this.added.emit({ title, useAiPlanner: this.useAiPlanner });
  }

  toggleAIPlanner(event: Event) {
    const input = event.target as HTMLInputElement;
    const useAiPlanner = input.checked;
    this.useAiPlanner = useAiPlanner;
  }
}

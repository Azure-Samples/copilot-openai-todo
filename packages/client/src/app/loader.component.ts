import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    imports: [CommonModule],
    template: `
    <div [class.loading]="loading" class="loader"></div>
  `,
    styles: [`
    .loader {
      width: 400px;
      height: 4px;
      overflow: hidden;
      transform: scaleX(0);
      transform-origin: center left;
    }
    .loading {
      background-color: #29f;
      animation: cubic-bezier(0.85, 0, 0.15, 1) 2s infinite load-animation;
    }

    @keyframes load-animation {
      0% {
        transform: scaleX(0);
        transform-origin: center left;
      }
      50% {
        transform: scaleX(1);
        transform-origin: center left;
      }
      51% {
        transform: scaleX(1);
        transform-origin: center right;
      }
      100% {
        transform: scaleX(0);
        transform-origin: center right;
      }
    }
  `]
})
export class LoaderComponent {
  @Input() loading: boolean = false;
}

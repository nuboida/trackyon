import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'olla-loading-spinner',
  template: `
    <div class="loading-shade" *ngIf="loading">
      <div class="spinner-box">
        <div class="three-quarter-spinner"></div>
      </div>
    </div>
  `,
  styles: [`

  .spinner-box {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }

  .three-quarter-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #4e73df;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin .5s linear 0s infinite;
    -webkit-animation: spin .5s linear 0s infinite;
  }


  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to{
      transform: rotate(359deg);
    }
  }

  @-webkit-keyframes spin {
    from {
      transform: rotate(0);
    }
    to{
      transform: rotate(359deg);
    }
  }

  `]
})
export class LoadingSpinnerComponent {
  @Input() loading!: boolean | null;
}

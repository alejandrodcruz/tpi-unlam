import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'dashboard-panel',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './dashboard-panel.component.html'
})
export class DashboardPanelComponent {

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() url: SafeResourceUrl | undefined;
  @Input() modalDescription: string | undefined;
  @Input() tooltipText: string | undefined;

  constructor() { }

  openModal() {
    const modal = document.getElementById(this.title) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-device-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-popup.component.html',
  styleUrl: './device-popup.component.css'
})
export class DevicePopupComponent {
@Input() isOpen: boolean = false;
@Output() closePopup = new EventEmitter<void>();

step:number = 1;

close() {
  this.closePopup.emit();
}

nextStep() {
  if (this.step < 5) {
    this.step++;
  }
}

previousStep() {
  if (this.step > 1) {
    this.step--;
  }
}

submitCode() {
  console.log("Código ingresado");
  this.nextStep();
}
}

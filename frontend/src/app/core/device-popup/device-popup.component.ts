import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-device-popup',
  standalone: true,
  imports: [CommonModule,
            LoadingComponent
  ],
  templateUrl: './device-popup.component.html',
  styleUrl: './device-popup.component.css'
})
export class DevicePopupComponent {
@Input() isOpen: boolean = false;
@Output() closePopup = new EventEmitter<void>();

step:number = 1;
isLoading: boolean = false;

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
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false;
    this.step = 5;
  }, 4000);

  console.log("Código ingresado");
  this.nextStep();
}
}

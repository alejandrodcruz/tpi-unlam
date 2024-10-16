import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-device-popup',
  standalone: true,
  imports: [CommonModule,
            LoadingComponent,
            FormsModule, CommonModule
  ],
  templateUrl: './device-popup.component.html',
  styleUrl: './device-popup.component.css'
})
export class DevicePopupComponent {
@Input() isOpen: boolean = false;
@Output() closePopup = new EventEmitter<void>();
 constructor(private deviceService: DeviceService) { }
step:number = 1;
isLoading: boolean = false;
pairingCode: string = '';
errorMessage: string = '';
successMessage: string = '';
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
  if (!this.pairingCode) {
    this.errorMessage = 'Por favor, ingresa el código de emparejamiento.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.deviceService.pairDevice(this.pairingCode).subscribe({
    next: (response) => {
      setTimeout(() => {
      this.isLoading = false;
      this.successMessage = response;
      console.log('Dispositivo emparejado:', response);
    },3000);
    },
    error: (error) => {
      setTimeout(() => {
      this.isLoading = false;
      console.error('Error al emparejar el dispositivo:', error);
      if (error.status === 400) {
        this.errorMessage = error.error;
      } else {
        this.errorMessage = 'Ocurrió un error al emparejar el dispositivo.';
      }
    },3000);
    }
  });

  this.nextStep();

}
}

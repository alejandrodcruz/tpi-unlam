import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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
 constructor(private deviceService: DeviceService, private cdr: ChangeDetectorRef) { }
step:number = 1;
isLoading: boolean = false;
pairingCode: string = '';
errorMessage: string = '';
successMessage: string = '';
close() {
  this.closePopup.emit();
}

nextStep() {
  if (this.step < 6) {
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
      console.log('Respuesta exitosa:', response);
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = response.message;
        console.log('Dispositivo emparejado:', response);
        this.nextStep();
      }, 2000);
    },
    error: (error) => {
      console.log('Respuesta con error:', error);
      setTimeout(() => {
        this.isLoading = false;
        console.error('Error al emparejar el dispositivo:', error);
        if (error.status === 400) {
          this.errorMessage = error.error.message;  // Cambia para acceder a la propiedad "message"
        } else {
          this.errorMessage = 'Ocurrió un error al emparejar el dispositivo.';
        }
      }, 2000);
    }
  });

}

}

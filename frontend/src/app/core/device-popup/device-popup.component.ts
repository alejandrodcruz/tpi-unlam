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

  this.deviceService.pairDevice(this.pairingCode)
  setTimeout(() => {
    this.isLoading = false;
    this.nextStep();
    },3000);

}
}

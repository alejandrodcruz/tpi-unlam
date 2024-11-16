import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../shared/services/device.service';
import { Address } from '../../shared/domain/address';
import { AddressService } from '../../shared/services/address.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-device-popup',
  standalone: true,
  imports: [CommonModule,
            LoadingComponent,
          FormsModule, CommonModule,
  ],
  templateUrl: './device-popup.component.html'
})
export class DevicePopupComponent {
@Input() isOpen: boolean = false;
@Output() closePopup = new EventEmitter<void>();

step:number = 1;
isLoading: boolean = false;
pairingCode: string = '';
nameDevice: string = '';
errorMessage: string = '';
successMessage: string = '';
addresses: Address[] = [];
selectedAddressId: number | null = null;

deviceNames: string[] = [
  'Ventilador',
  'Televisor',
  'Secador de Pelo',
  'Router WiFi',
  'Radiador Eléctrico',
  'Plancha',
  'Microondas',
  'Lavavajillas',
  'Lavarropas',
  'Lámpara LED',
  'Impresora Láser',
  'Horno Eléctrico',
  'Heladera',
  'Extractor de Aire',
  'Computadora',
  'Cargador de Celular',
  'Calefactor Eléctrico',
  'Cafetera',
  'Bomba de Agua',
  'Aire Acondicionado'
];

constructor( private deviceService: DeviceService,
  private addressService: AddressService,
  private authService: AuthService,
) { }

ngOnInit(): void {
  const userId = this.authService.getUserId();
  if (userId !== null) {
    this.addressService.getAddressesByUser(userId).subscribe({
      next: (addresses) => this.addresses = addresses,
      error: (err) => console.error('Error al obtener direcciones:', err)
    });
  } else {
    console.error("Error: userId no encontrado.");
  }
}

close() {
  this.closePopup.emit();
  window.location.reload();
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
  if (!this.selectedAddressId) {
    this.errorMessage = 'Por favor, selecciona una dirección.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.deviceService.pairDevice(this.pairingCode, this.nameDevice,  this.selectedAddressId).subscribe({
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

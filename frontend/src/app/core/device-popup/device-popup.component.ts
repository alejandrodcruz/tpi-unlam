import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../shared/services/device.service';
import { Address } from '../../shared/domain/address';
import { AddressService } from '../../shared/services/address.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './device-popup.component.html'
})
export class DevicePopupComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  step: number = 1;
  isLoading: boolean = false;
  pairingCode: string = '';
  nameDevice: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  selectedAddressType: string = '';

  deviceNames: string[] = [];

  addressTypeOptions = [
    { value: 'HOME', label: 'Casa' },
    { value: 'BUSINESS', label: 'Negocio' },
    { value: 'WORKSHOP', label: 'Taller' }
  ];

  deviceNamesHome: string[] = [
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

  deviceNamesBusiness: string[] = [
    'Fotocopiadora',
    'Impresora Multifuncional',
    'Servidor de Oficina',
    'Cafetera Industrial',
    'Aire Acondicionado',
    'Sistema de Iluminación LED',
    'Enfriador de Agua',
    'Máquina Destructora de Papel',
    'Proyector',
    'Sistema de Videoconferencia'
  ];

  deviceNamesWorkshop: string[] = [
    'Taladro Eléctrico',
    'Sierra Circular',
    'Amoladora Angular',
    'Compresor de Aire',
    'Soldadora Eléctrica',
    'Lijadora Eléctrica',
    'Fresadora',
    'Caladora Eléctrica',
    'Pistola de Calor',
    'Torno Eléctrico'
  ];

  constructor(
    private deviceService: DeviceService,
    private addressService: AddressService,
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.addressService.getAddressesByUser(userId).subscribe({
        next: (addresses) => {
          this.addresses = addresses;
          if (this.addresses.length > 0) {
            this.selectedAddressId = this.addresses[0].id;
            this.onAddressChange();
          }
        },
        error: (err) => console.error('Error al obtener direcciones:', err)
      });
    } else {
      this.toast.warning("No cuentas con usuario activo.");
      this.authService.logout();
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
    if (!this.nameDevice) {
      this.errorMessage = 'Por favor, selecciona un dispositivo.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.deviceService.pairDevice(this.pairingCode, this.nameDevice, this.selectedAddressId).subscribe({
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
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Ocurrió un error al emparejar el dispositivo.';
          }
        }, 2000);
      }
    });
  }

  onAddressChange() {
    const selectedAddress = this.addresses.find(addr => addr.id === this.selectedAddressId);
    if (selectedAddress) {
      this.selectedAddressType = selectedAddress.type;
      console.log('Tipo de dirección seleccionada:', this.selectedAddressType);
      this.updateDeviceNames();
    }
  }

  updateDeviceNames() {
    switch (this.selectedAddressType) {
      case 'HOME':
        this.deviceNames = this.deviceNamesHome;
        break;
      case 'BUSINESS':
        this.deviceNames = this.deviceNamesBusiness;
        break;
      case 'WORKSHOP':
        this.deviceNames = this.deviceNamesWorkshop;
        break;
      default:
        this.deviceNames = [];
    }
    console.log('Dispositivos disponibles para', this.selectedAddressType, ':', this.deviceNames);
  }
  getAddressTypeLabel(type: string): string {
    const option = this.addressTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  }


}

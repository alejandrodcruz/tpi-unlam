import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { PanelTitleComponent } from '../panel-title/panel-title.component';

// Declarar MercadoPago para evitar errores de TypeScript
declare var MercadoPago: any;

@Component({
  selector: 'app-misuscription',
  standalone: true,
  imports: [SidebarComponent, CommonModule, PanelTitleComponent],
  templateUrl: './misuscription.component.html',
  styleUrls: ['./misuscription.component.css']
})
export class MisuscriptionComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const mp = new MercadoPago('APP_USR-b7a395dd-bddd-4d7a-a6f8-a91643a6b3b8', {
      locale: 'es-AR' // Configurar la localización en español de Argentina
    });

    // Obtener el botón de pago por su ID
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {
      // Si el botón existe, agregar un listener para el evento 'click'
      checkoutBtn.addEventListener('click', () => {
        mp.checkout({
          preference: {
            id: '7240899774876345' // Reemplazar con tu ID de preferencia real
          },
          render: {
            container: '.checkout-container', // Nombre de la clase donde se renderizará el botón de pago
            label: 'Pagar',
          }
        });
      });
    }

    // Función para manejar el pago exitoso de cualquier plan
    function handlePayment(plan: string) {
      setTimeout(() => {
        // Abrir el modal de pago exitoso
        const modalPagoExitoso = document.getElementById('modal-pago-exitoso') as HTMLInputElement;
        if (modalPagoExitoso) {
          modalPagoExitoso.checked = true;
        }
      }, 1000); // Simulación de un retardo en el pago
    }

    // Evento para el botón de pago del Plan Personal
    const payButtonPersonal = document.getElementById('pay-button-plan-personal');
    if (payButtonPersonal) {
      payButtonPersonal.addEventListener('click', () => {
        handlePayment('Personal');
      });
    }

    // Evento para el botón de pago del Plan Empresarial
    const payButtonEmpresarial = document.getElementById('pay-button-plan-empresarial');
    if (payButtonEmpresarial) {
      payButtonEmpresarial.addEventListener('click', () => {
        handlePayment('Empresarial');
      });
    }

    // Evento para el botón de pago del Plan Profesional
    const payButtonProfesional = document.getElementById('pay-button-plan-profesional');
    if (payButtonProfesional) {
      payButtonProfesional.addEventListener('click', () => {
        handlePayment('Profesional');
      });
    }
  }

}

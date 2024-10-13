import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { PanelTitleComponent } from '../panel-title/panel-title.component';

// Declarar MercadoPago para evitar errores de TypeScript
declare var MercadoPago: any;

@Component({
  selector: 'app-misuscription', // Selector del componente que se usará en la plantilla HTML
  standalone: true, // Indica que este componente es independiente y no necesita un módulo
  imports: [SidebarComponent, CommonModule, PanelTitleComponent], // Importaciones necesarias para el componente
  templateUrl: './misuscription.component.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['./misuscription.component.css'] // Ruta del archivo de estilos CSS
})
export class MisuscriptionComponent implements OnInit {

  constructor() { }

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    // Crear una instancia de MercadoPago usando la clave pública (reemplazar con la tuya)
    const mp = new MercadoPago('YOUR_PUBLIC_KEY', {
      locale: 'es-AR' // Cambiar a la configuración regional deseada
    });

    // Obtener el botón de pago por su ID para agregar un evento de clic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      // Si el botón existe, agregar un listener para el evento 'click'
      checkoutBtn.addEventListener('click', () => {
        // Configurar el proceso de checkout de MercadoPago
        mp.checkout({
          preference: {
            id: 'YOUR_PREFERENCE_ID' // Reemplazar con tu ID de preferencia
          },
          render: {
            container: '.checkout-container', // Nombre de la clase donde se renderizará el botón de pago
            label: 'Pagar', // Cambiar la etiqueta del botón (opcional)
          }
        });
      });
    }
  }
}

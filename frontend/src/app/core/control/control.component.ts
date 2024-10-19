import {Component, HostListener} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent {electrodomesticos = [
  { id: 1, nombre: 'Aire Acondicionado', imagen: 'https://habitar.com.ar/media/catalog/product/cache/f4dc15f47a3b25bbb2d7109304089b38/s/5/s52.jpg', activo: false },
  { id: 2, nombre: 'Heladera', imagen: 'https://d2eebw31vcx88p.cloudfront.net/garbarino/uploads/93b02e6e0e319f2fb35804d65d006577c78247e2.jpg', activo: false },
  { id: 3, nombre: 'Televisor', imagen: 'https://images.fravega.com/f300/b02f3e46c89fe14a5c4689ba6ac9bc08.jpg', activo: false },
  { id: 4, nombre: 'Lavarropas', imagen: 'https://fabricasunidas.com.ar/wp-content/uploads/2024/01/NEXT7.10-ECO-1.jpg', activo: false },
  { id: 5, nombre: 'Microondas', imagen: 'https://images.fravega.com/f300/0161b6afd18a5227c1a76ed80ef00dd3.jpg', activo: false },
  { id: 6, nombre: 'Computadora', imagen: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKAbAHwHJkc-V131QZKaV-AzLbl_86C_Gv1TdBsvQCG7MhC8tyabaEL5_tIKp659gingRQn6XB17th-Ejvqbx0-DuCwbrEtwJqlIteSByREIl5jbR1bA3Iu6hPH8gi2lIIvsN6t4hGTX4/s1600/Screenshot_1.png', activo: false },
  { id: 7, nombre: 'Calefactor', imagen: 'https://http2.mlstatic.com/D_NQ_NP_793701-MLA76374933872_052024-O.webp', activo: false },
  { id: 8, nombre: 'Ventilador', imagen: 'https://static.hendel.com/media/catalog/product/cache/0c3e9ac8430b5a3e77d1544ae1698a10/5/1/51761-min.jpg', activo: false }
];
  hover: boolean = false;

  activarElectrodomestico(id: number) {
    this.electrodomesticos = this.electrodomesticos.map(e =>
      e.id === id ? { ...e, activo: !e.activo } : e
    );
  }

}

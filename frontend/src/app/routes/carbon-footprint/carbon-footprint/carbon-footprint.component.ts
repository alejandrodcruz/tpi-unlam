import { Component } from '@angular/core';
import { CardInfoComponent } from '../../../core/card/card-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carbon-footprint',
  standalone: true,
  imports: [CardInfoComponent,CommonModule],
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css'
})
export class CarbonFootprintComponent {

}

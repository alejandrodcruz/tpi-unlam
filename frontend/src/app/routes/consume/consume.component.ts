import { Component } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { DatePipe, CommonModule } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {CardRealTimeComponent} from "../../core/card-real-time/card-real-time.component";


@Component({
  selector: 'consume',
  standalone: true,
  imports: [
    CommonModule,
    CardInfoComponent,
    FormsModule,
    DatePipe,
    PanelTitleComponent,
    CardRealTimeComponent,
  ],
  templateUrl: './consume.component.html'
})
export class ConsumeComponent {

}

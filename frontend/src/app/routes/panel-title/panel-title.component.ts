import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-panel-title',
  standalone: true,
  imports: [],
  styleUrl: './panel-title.component.css',
  template: `
    <div class="grid grid-cols-1 gap-4 mb-4 bg-white px-10 py-4">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="text-pretty">{{ description }}</p>
    </div> `
})
export class PanelTitleComponent {

  @Input() title: string = 'Título por defecto';
  @Input() description: string = 'Descripción por defecto';
}

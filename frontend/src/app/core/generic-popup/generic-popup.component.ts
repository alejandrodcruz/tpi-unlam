import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-generic-popup',
  standalone: true,
  imports: [FormsModule, CommonModule], // Incluir FormsModule
  templateUrl: './generic-popup.component.html',
  styleUrls: ['./generic-popup.component.css']
})
export class GenericPopupComponent {

  @Input() title: string = '';
  @Input() message: string = '';

  // Nuevos Inputs para manejar el campo de entrada
  @Input() showInput: boolean = false;
  @Input() inputPlaceholder: string = '';
  @Input() initialInputValue: string = '';

  @Output() confirm = new EventEmitter<string | undefined>(); // Cambiar tipo a string | undefined
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>;

  inputValue: string = '';

  open(): void {
    if (this.showInput) {
      this.inputValue = this.initialInputValue;
    }
    this.modalRef.nativeElement.showModal();
  }

  close(): void {
    this.modalRef.nativeElement.close();
  }

  onConfirm(): void {
    if (this.showInput) {
      this.confirm.emit(this.inputValue);
    } else {
      this.confirm.emit(undefined); // Emisión explícita de 'undefined'
    }
    this.close();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }
}

import { Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generic-popup',
  standalone: true,
  imports: [],
  templateUrl: './generic-popup.component.html',
  styleUrl: './generic-popup.component.css'
})
export class GenericPopupComponent {

  @Input() title: string = '';
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>;

  open(): void {
    this.modalRef.nativeElement.showModal();
  }

  close(): void {
    this.modalRef.nativeElement.close();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.close();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }
}

import { Component, Inject, Input, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  openModal() {
    const modal = this.document.getElementById('modal');
    if (modal) {
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      modal.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    }
  }

  closeModal() {
    const modal = this.document.getElementById('modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
    }
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  @Input() modalTitle = '';
}
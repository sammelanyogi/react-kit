import React, { ReactElement } from "react";

export type ModalInfo = {
  id: string,
  element: React.ReactElement,
}

export class ModalController {
  private modalSerial: number = 0;
  private visibleModals: Array<{
    id: string,
    element: React.ReactElement,
  }> = [];

  private updatePortal: (modals: ModalInfo[]) => void;

  listen(updatePortal: (modals: ModalInfo[]) => void) {
    if (this.updatePortal) {
      console.warn('Multiple Modal portals being registered');
    }

    this.updatePortal = updatePortal;
  }

  createId() {
    return `modal-${++this.modalSerial}`;
  }

  show(id: string, element: React.ReactElement) {
    const idx = this.visibleModals.findIndex(k => k.id === id);
    if (idx >= 0) {
      this.visibleModals.splice(idx, 1);
    }

    this.visibleModals.push({
      id,
      element,
    });

    this.updatePortal(this.visibleModals.slice(0));
  }

  hide(id: string) {
    const idx = this.visibleModals.findIndex(k => k.id === id);
    if (idx === -1) return;


    this.visibleModals.splice(idx, 1);
    this.updatePortal(this.visibleModals.slice(0));
  }

  update(id: string, element: React.ReactElement) {
    const idx = this.visibleModals.findIndex(k => k.id === id);
    if (idx === -1) return;

    this.visibleModals[idx].element = element;
    this.updatePortal(this.visibleModals.slice(0));
  }
}

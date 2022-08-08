import React from "react";

export type ModalElement = {
  key: string,
  element: React.ReactElement,
  hide: (res: any, auto: boolean) => void,
}

class Modal {
  readonly key: string;
  private controller: ModalController;

  constructor(controller: ModalController, key: string) {
    this.key = key;
    this.controller = controller;
  }

  show(Component: React.FC, onClose?: (res: undefined | any, auto: boolean) => void) {
    this.controller.add({
      key: this.key,
      element: React.createElement(this.controller.Wrapper, {}, React.createElement(Component, {})),
      hide: (res, auto) => {
        if (this.controller.remove(this.key)) {
          if (onClose) {
            onClose(res, auto);
          }
        }
      }
    });
  }
}

export class ModalController {
  readonly Wrapper: React.FC;
  private modalSerial: number = 0;

  private visibleModals: Array<ModalElement> = [];

  private updateRoot: (elements: Array<ModalElement>) => void;

  constructor(Wrapper: React.FC) {
    this.Wrapper = Wrapper;
  }

  get elements() {
    return this.visibleModals;
  }

  subscribe(updateRoot: (modals: Array<ModalElement>) => void) {
    this.updateRoot = updateRoot;
  }

  add(modal: ModalElement) {
    if (!this.updateRoot) {
      throw new Error('Trying to display modal without a Modal Root');
    }

    let existing = false;
    this.visibleModals = this.visibleModals.map(visible => {
      if (visible.key === modal.key) {
        existing = true;
        return modal;
      }
      return visible;
    });

    if (!existing) {
      this.visibleModals.push(modal);
    }

    this.updateRoot(this.visibleModals);
  }

  remove(key: string) {
    const idx = this.visibleModals.findIndex(k => k.key === key);
    if (idx === -1) return false;

    // In most of the cases the key being removed is at the end
    if (idx === this.visibleModals.length-1) {
      this.visibleModals = this.visibleModals.slice(0, -1);
    } else {
      this.visibleModals = this.visibleModals.slice(0);
      this.visibleModals.splice(idx, 1);
    }
    this.updateRoot(this.visibleModals);
    return true;
  }

  createModal() {
    this.modalSerial += 1;
    return new Modal(this, `m-${this.modalSerial}`);
  }
}

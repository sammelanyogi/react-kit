import { ReactElement } from "react";

export type ModalInfo = {
  id: string,
  element: ReactElement,
}

export class ModalManager {
  /**
   * Serial number for generating unique id
   */
  serial: number = 0;

  /**
   * The list of currently visible models registered
   * via the hook
   */
  readonly modals: Array<{
    id: string,
    setNode: (node: number) => void,
    zIndex?: number,
  }> = [];

  /**
   * The one and only host that needs to be triggered
   * for rendering the Modal view
   */
  triggerHost?: (serial: number) => void;

  /**
   * Hook registration for portal rendering. A view is mounted
   * for the modal within the Host and then a portal is created
   * when this hook fires.
   * 
   * @param setNode 
   * @returns 
   */
  register(setNode: (node: number) => void, zIndex?: number) {
    const id = `modal${++this.serial}`;
    const obj = {
      id,
      setNode,
      zIndex,
    };
    this.modals.push(obj);

    if (this.triggerHost) this.triggerHost(this.serial);

    return () => {
      const idx = this.modals.indexOf(obj);
      if (idx >= 0) this.modals.splice(idx, 1);
    }
  }

  /**
   * Listen for addition of new modals
   * @param host 
   * @returns 
   */
  listen(host: (serial: number) => void) {
    this.triggerHost = host;
    return () => {
      this.triggerHost = undefined;
    }
  }

  /**
   * Hook callback once the View container for modal portal
   * is registred
   * @param id 
   * @param handle 
   */
  mount(id: string, handle: number | null) {
    const modal = this.modals.find(m => m.id === id);
    if (modal) modal.setNode(handle || 0);
  }
}

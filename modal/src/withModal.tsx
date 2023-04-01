import React from "react";
import { ModalContext } from "./ModalContext.js";
import { ModalManager } from "./ModalManager.js";
import { ModalHost } from "./ModalHost.js";

export function withModal<T extends {}>(App: React.FC<T>) {
  const modalManager = new ModalManager();
  return (props: T) => {
    return (
      <ModalContext.Provider value={modalManager}>
        <App {...props} />
        <ModalHost />
      </ModalContext.Provider>
    );
  }
}

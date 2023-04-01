import { createContext } from 'react';
import { ModalManager } from "./ModalManager.js";

export const ModalContext = createContext<ModalManager>(null as never);

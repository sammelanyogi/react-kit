import React from 'react';
import { useCurrentRoute } from "./useCurrentRoute.js";


/**
 * Standard Outlet that can be used with map that returns a
 * React Component
 * @returns 
 */
export function Outlet() {
  const Route = useCurrentRoute();

  return <Route />
}
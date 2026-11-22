import { useApp } from './useApp';
/** Derived dashboard metrics, recomputed whenever activities or goals change. */
export const useMetrics = () => useApp().metrics;

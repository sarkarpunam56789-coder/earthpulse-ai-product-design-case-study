import { Car, Zap, Utensils, ShoppingBag, Droplets, Trash2, LucideIcon } from 'lucide-react';
import { Category } from '../types';

export const CATEGORIES: Record<Category, { label: string; icon: LucideIcon; color: string }> = {
  transport: { label: 'Transport', icon: Car, color: '#16783C' },
  electricity: { label: 'Electricity', icon: Zap, color: '#F5A524' },
  food: { label: 'Food', icon: Utensils, color: '#8A6BC2' },
  shopping: { label: 'Shopping', icon: ShoppingBag, color: '#D9585F' },
  water: { label: 'Water', icon: Droplets, color: '#2F80C8' },
  waste: { label: 'Waste', icon: Trash2, color: '#3FA796' },
};

export const CARBON_CATEGORIES: Category[] = ['transport', 'electricity', 'food', 'shopping'];
export const ALL_CATEGORIES: Category[] = ['transport', 'electricity', 'food', 'shopping', 'water', 'waste'];

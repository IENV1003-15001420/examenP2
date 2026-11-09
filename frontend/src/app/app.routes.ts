import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pizzeria/dashboard/dashboard').then(c => c.Dashboard) 
  }
];
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-resume-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-ventas.html'
})
export class ResumeVentas {
  
  inputDia: string = '';
  inputMes: string = '';

  ventasEncontradas: any[] = [];
  totalAcumulado: number = 0;
  
  ventaSeleccionada: any = null;
  modoVista: string = 'resumen'; 

  constructor(private pizzeriaService: PizzeriaService) {}

  buscarPorDia() {
    if (!this.inputDia.trim()) return;
    
    this.pizzeriaService.consultarVentasPorDia(this.inputDia).subscribe({
      next: (datos: any) => {
        this.procesarResultados(datos);
      },
      error: (err: any) => console.error(err)
    });
  }

  buscarPorMes() {
    if (!this.inputMes.trim()) return;
    
    this.pizzeriaService.consultarVentasPorMes(this.inputMes).subscribe({
      next: (datos: any) => {
        this.procesarResultados(datos);
      },
      error: (err: any) => console.error(err)
    });
  }

  procesarResultados(datos: any[]) {
    this.ventasEncontradas = datos;
    this.totalAcumulado = this.ventasEncontradas.reduce((acc, v) => acc + v.total, 0);
    this.modoVista = 'resumen';
  }

  verDetalle(venta: any) {
    this.ventaSeleccionada = venta;
    this.modoVista = 'detalle';
  }

  volverResumen() {
    this.ventaSeleccionada = null;
    this.modoVista = 'resumen';
  }
}
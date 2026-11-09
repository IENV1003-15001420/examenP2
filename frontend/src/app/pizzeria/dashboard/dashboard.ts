import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapturaPedido } from '../captura-pedido/captura-pedido';
import { DetallePedido } from '../detalle-pedido/detalle-pedido';
import { ResumeVentas } from '../resume-ventas/resume-ventas';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CapturaPedido, DetallePedido, ResumeVentas],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  pedidoActual: any[] = [];

  constructor(private pizzeriaService: PizzeriaService) {}

  recibirPizza(nuevaPizza: any) {
    this.pedidoActual = [...this.pedidoActual, nuevaPizza];
  }
  guardarPedidoCompleto(totalPagar: number) {
    const datosCliente = this.pedidoActual[0];
    const payload = {
      nombre: datosCliente.nombre,
      direccion: datosCliente.direccion,
      telefono: datosCliente.telefono,
      fecha: datosCliente.fecha,
      total: totalPagar,
      pizzas: this.pedidoActual 
    };
    this.pizzeriaService.guardarPedido(payload).subscribe({
      next: (response: any) => {
        alert('¡Pedido guardado exitosamente en la base de datos MySQL!');
        this.pedidoActual = [];
      },
      error: (err: any) => {
        console.error('Error al guardar en Flask:', err);
        alert('Hubo un error al guardar el pedido en la base de datos.');
      }
    });
  }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-pedido.html'
})
export class DetallePedido {
  @Input() listaPizzas: any[] = [];
  @Output() GuardarPedido = new EventEmitter<number>();
  pizzaSeleccionada: number = -1;

  seleccionarPizza(index: number) {
    this.pizzaSeleccionada = index;
  }
  quitarPizza() {
    if (this.pizzaSeleccionada === -1) {
      alert('Primero selecciona una pizza de la tabla para quitarla.');
      return;
    }
    this.listaPizzas.splice(this.pizzaSeleccionada, 1);
    this.pizzaSeleccionada = -1;
  }
  terminarPedido() {
    if (this.listaPizzas.length === 0) {
      alert('No puedes terminar un pedido vacío.');
      return;
    }
    let totalPagar = 0;
    for (let pizza of this.listaPizzas) {
      totalPagar += pizza.subtotal;
    }
    const confirmar = confirm(`El importe total a pagar es: $${totalPagar}\n¿Deseas procesar y guardar el pedido?`);

    if (confirmar) {
      this.GuardarPedido.emit(totalPagar);
      this.listaPizzas.splice(0, this.listaPizzas.length);
    }
  }
}
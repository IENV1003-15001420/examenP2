import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-captura-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captura-pedido.html'
})
export class CapturaPedido implements OnInit {
  pedidoForm!: FormGroup;

  @Output() AgregarPizza = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pedidoForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      tamano: ['Chica', Validators.required],
      ingredientes: this.fb.group({
        jamon: [false],
        pina: [false],
        champinones: [false]
      }),
      num_pizzas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarPizza(): void {
    if (this.pedidoForm.invalid) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }
    const datos = this.pedidoForm.getRawValue();
    let precioTamano = 0;
    if (datos.tamano === 'Chica') precioTamano = 40;
    if (datos.tamano === 'Mediana') precioTamano = 80;
    if (datos.tamano === 'Grande') precioTamano = 120;

    let extras = 0;
    let ingredientesSeleccionados = [];
    if (datos.ingredientes.jamon) { extras += 10; ingredientesSeleccionados.push('Jamón'); }
    if (datos.ingredientes.pina) { extras += 10; ingredientesSeleccionados.push('Piña'); }
    if (datos.ingredientes.champinones) { extras += 10; ingredientesSeleccionados.push('Champiñones'); }

    const subtotal = (precioTamano + extras) * datos.num_pizzas;
    const pizzaLista = {
      ...datos,
      ingredientesTexto: ingredientesSeleccionados.length > 0 ? ingredientesSeleccionados.join(', ') : 'Queso',
      subtotal: subtotal
    };

    this.AgregarPizza.emit(pizzaLista);
    this.pedidoForm.patchValue({
      tamano: 'Chica',
      ingredientes: { jamon: false, pina: false, champinones: false },
      num_pizzas: 1
    });
  }
}
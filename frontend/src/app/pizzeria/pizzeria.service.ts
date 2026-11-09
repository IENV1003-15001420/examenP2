import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaService {
  private apiUrl = 'http://127.0.0.1:5000/api'; 

  constructor(private http: HttpClient) { }

  guardarPedido(pedidoCompleto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar-pedido`, pedidoCompleto);
  }
  obtenerResumeVentas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resume-ventas`);
  }
  consultarVentasPorDia(dia: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ventas-por-dia?dia=${dia}`);
  }

  consultarVentasPorMes(mes: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ventas-por-mes?mes=${mes}`);
  }
}
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'pizzeria' # Asegúrate de que tu BD en Laragon se llame así

mysql = MySQL(app)

@app.route('/api/prueba', methods=['GET'])
def prueba_servidor():
    return jsonify({
        "mensaje": "¡Servidor Flask y conexión a BD pizzeria listos!", 
        "exito": True
    })

# --- RUTA PARA RECIBIR Y GUARDAR EL PEDIDO ---
@app.route('/api/guardar-pedido', methods=['POST'])
def guardar_pedido():
    try:
        # 1. Recibimos el JSON que nos manda Angular
        datos = request.json
        
        nombre = datos.get('nombre')
        direccion = datos.get('direccion')
        telefono = datos.get('telefono')
        fecha = datos.get('fecha')
        total = datos.get('total')
        pizzas = datos.get('pizzas') # Esto es el arreglo del detalle

        # 2. Abrimos la conexión a MySQL
        cur = mysql.connection.cursor()

        # 3. Insertamos en la tabla principal (ventas)
        cur.execute("""
            INSERT INTO ventas (nombre_cliente, direccion, telefono, fecha_pedido, total)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, direccion, telefono, fecha, total))
        
        # Obtenemos el ID exacto de la venta que se acaba de crear
        id_venta = cur.lastrowid

        # 4. Insertamos cada pizza en la tabla de detalle (detalle_ventas)
        for pizza in pizzas:
            cur.execute("""
                INSERT INTO detalle_ventas (id_venta, tamano, ingredientes, num_pizzas, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_venta, pizza['tamano'], pizza['ingredientesTexto'], pizza['num_pizzas'], pizza['subtotal']))

        # 5. Confirmamos los cambios y cerramos conexión
        mysql.connection.commit()
        cur.close()

        return jsonify({"mensaje": "Pedido guardado exitosamente en MySQL", "exito": True})

    except Exception as e:
        print("Error en el servidor:", e)
        return jsonify({"mensaje": "Error al guardar el pedido", "error": str(e)}), 500
    
@app.route('/api/resumen-ventas', methods=['GET'])
def resumen_ventas():
    try:
        cursor = mysql.connection.cursor()
        
        # Suma de las ventas del día de hoy
        cursor.execute("SELECT SUM(total) FROM ventas WHERE DATE(fecha) = CURDATE()")
        ventas_dia = cursor.fetchone()[0]
        ventas_dia = ventas_dia if ventas_dia is not None else 0

        # Suma de las ventas del mes actual
        cursor.execute("SELECT SUM(total) FROM ventas WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())")
        ventas_mes = cursor.fetchone()[0]
        ventas_mes = ventas_mes if ventas_mes is not None else 0

        cursor.close()
        
        return jsonify({
            'dia': ventas_dia,
            'mes': ventas_mes
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ventas-por-dia', methods=['GET'])
def ventas_por_dia():
    dia_semana = request.args.get('dia', '').lower()
    
    # Diccionario para traducir los días de español a inglés (formato MySQL)
    dias_map = {
        'lunes': 'Monday', 'martes': 'Tuesday', 'miercoles': 'Wednesday', 'miércoles': 'Wednesday',
        'jueves': 'Thursday', 'viernes': 'Friday', 'sabado': 'Saturday', 'sábado': 'Saturday', 'domingo': 'Sunday'
    }
    
    dia_ingles = dias_map.get(dia_semana)
    if not dia_ingles:
        return jsonify([]) 

    try:
        cursor = mysql.connection.cursor()
        
        # Consulta a la tabla padre
        cursor.execute("""
            SELECT id_venta, nombre_cliente, total, fecha_pedido 
            FROM ventas 
            WHERE DAYNAME(fecha_pedido) = %s
        """, (dia_ingles,))
        
        ventas_rows = cursor.fetchall()
        ventas_lista = []
        
        for v in ventas_rows:
            venta_id = v[0] 
            # Consulta a la tabla hija
            cursor.execute("SELECT tamano, ingredientes, num_pizzas, subtotal FROM detalle_ventas WHERE id_venta = %s", (venta_id,))
            detalles_rows = cursor.fetchall()
            
            pizzas = []
            for d in detalles_rows:
                pizzas.append({
                    'tamano': d[0],
                    'ingredientes': d[1],
                    'num_pizzas': d[2],
                    'subtotal': float(d[3])
                })
                
            ventas_lista.append({
                'id': venta_id,
                'cliente': v[1], 
                'total': float(v[2]),
                'fecha': v[3],   
                'pizzas': pizzas
            })
            
        cursor.close()
        return jsonify(ventas_lista)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ventas-por-mes', methods=['GET'])
def ventas_por_mes():
    mes_nombre = request.args.get('mes', '').lower()
    
    # Diccionario para traducir los meses a número (formato MySQL)
    meses_map = {
        'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
        'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
    }
    
    mes_numero = meses_map.get(mes_nombre)
    if not mes_numero:
        return jsonify([])

    try:
        cursor = mysql.connection.cursor()
        
        # Consulta a la tabla padre
        cursor.execute("""
            SELECT id_venta, nombre_cliente, total, fecha_pedido 
            FROM ventas 
            WHERE MONTH(fecha_pedido) = %s
        """, (mes_numero,))
        
        ventas_rows = cursor.fetchall()
        ventas_lista = []
        
        for v in ventas_rows:
            venta_id = v[0]
            # Consulta a la tabla hija
            cursor.execute("SELECT tamano, ingredientes, num_pizzas, subtotal FROM detalle_ventas WHERE id_venta = %s", (venta_id,))
            detalles_rows = cursor.fetchall()
            
            pizzas = []
            for d in detalles_rows:
                pizzas.append({
                    'tamano': d[0],
                    'ingredientes': d[1],
                    'num_pizzas': d[2],
                    'subtotal': float(d[3])
                })
                
            ventas_lista.append({
                'id': venta_id,
                'cliente': v[1], 
                'total': float(v[2]),
                'fecha': v[3],   
                'pizzas': pizzas
            })
            
        cursor.close()
        return jsonify(ventas_lista)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# --- ARRANQUE DEL SERVIDOR (SIEMPRE AL FINAL) ---
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
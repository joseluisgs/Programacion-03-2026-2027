# Práctica CINE-DAW: Gestión Modular de Sala de Cine

**Instrucciones:** Implementa un programa en C# que gestione una sala de cine mediante matrices. El programa debe validar estrictamente todas las entradas del usuario. Recuerda: **primero el diseño en papel, luego la codificación**.

---

## 1. Configuración Inicial

### 1.1. Parámetros de la Sala

La dimensión de la sala (`Filas:Columnas`) **debe intentarse leer primero** de los argumentos de línea de comandos. Si faltan o son inválidos, el programa inicia un **bucle de solicitud en consola**.

| Parámetro | Rango | Formato |
| :--- | :--- | :--- |
| **Filas (F)** | Entero entre **4 y 7** | Número antes del separador `:` |
| **Columnas (C)** | Entero entre **5 y 9** | Número después del separador `:` |

**Interacción de errores:**

| Flujo | Entrada | Salida |
| :--- | :--- | :--- |
| **Faltan argumentos** | *(ninguno)* | `ERROR: Faltan argumentos. Formato: -filas:X -columnas:Y` |
| **Error de formato** | `8,5` | `ERROR: Formato inválido. Use F:C. Ejemplo: 6:9` |
| **Error de rango** | `3:5` | `ERROR: Rango inválido. Filas: [4-7], Columnas: [5-9].` |
| **Éxito** | `5:8` | `Sala configurada: 5 filas x 8 columnas.` |

### 1.2. Estados de una Butaca

| Concepto | Código Interno | Símbolo | Precio |
| :--- | :--- | :--- | :--- |
| **Libre** | 0 | `[L]` | — |
| **Ocupada** | 1 | `[O]` | 6.50€ |
| **Fuera de Servicio** | 2 | `[X]` | — |

Al iniciar, la sala debe estar toda `Libre`, con **1 a 3 butacas** elegidas aleatoriamente como `Fuera de Servicio`.

## 2. Visualización y Coordenadas

La sala se muestra con coordenadas **mixtas**: filas con letras (A, B, C...) y columnas con números (1, 2, 3...).

```
    1   2   3   4   5
A  [L] [L] [O] [L] [L]
B  [X] [L] [L] [L] [O]
C  [L] [L] [O] [X] [L]
```

Las operaciones de `Comprar` y `Devolver` solicitan la coordenada en formato **`Letra:Numero`** (ej: `B:3`). El programa valida formato y rango en un bucle de reintento.

## 3. Menú Principal

| Opción | Título | Funcionalidad |
| :--- | :--- | :--- |
| **1** | Ver Sala | Mostrar la matriz con coordenadas |
| **2** | Comprar Entrada | Solicitar coordenada, cambiar a `Ocupada` |
| **3** | Devolver Entrada | Solicitar coordenada, cambiar a `Libre` |
| **4** | Recaudación | Calcular y mostrar total de dinero |
| **5** | Informe | Mostrar todas las estadísticas |
| **6** | Salir | Terminar la ejecución |

**Mensajes de error:**
- Comprar butaca ocupada: `ERROR: La butaca A:3 ya está OCUPADA o FUERA DE SERVICIO.`
- Devolver butaca libre: `ERROR: La butaca B:1 no puede devolverse. No está OCUPADA.`

## 4. Informe (Opción 5)

| Estadística | Cálculo |
| :--- | :--- |
| **Entradas Vendidas** | Número de butacas `Ocupada` |
| **Asientos Libres** | Número de butacas `Libre` |
| **Asientos No Disponibles** | Número de butacas `Fuera de Servicio` |
| **Total Recaudado** | `Vendidas` × 6.50€ |
| **Porcentaje de Ocupación** | `(Vendidas / (Total - FueraServicio)) × 100` |

**Salida del informe:**

```
--- INFORME CINEMAD ---
Entradas Vendidas: 5
Asientos Libres: 18
Asientos No Disponibles: 2
Ocupación: 21.74% (sobre 23 disponibles)
Recaudación Total: 32.50€
```

# Práctica: The Walking DAW — Simulación de Propagación con Doble Búfer

**Instrucciones:** Implementa en C# una simulación de propagación de un virus en una cuadrícula, usando la técnica de **Doble Búfer**. Recuerda: **primero el diseño en papel, luego la codificación**.

---

## 1. Historia

El IES Luis Vives era un faro de conocimiento, hasta que un error de compilación fatal liberó el **Virus Prog-JL**. No es un virus común. Es una pesadilla biológica que transforma a profesores y alumnos en **Zombies del Código (ZC)**, con una sed insaciable por código limpio.

**Tú eres el último programador sano.** Tu misión: ejecutar la simulación que predecirá el destino del instituto.

## 2. Estados de las Celdas

La Matriz del Instituto se compone de celdas en uno de tres estados:

| Estado | Símbolo | Descripción |
| :--- | :--- | :--- |
| **Zombie del Código (ZC)** | `Z` | Persona infectada |
| **Persona Sana** | `S` | Alumno o profesor sano |
| **Zona Libre** | `.` | Espacio vacío |

## 3. Reglas de los Zombies del Código

Los ZC siguen estas reglas en cada ciclo:

1. **Probabilidad de Muerte (`muerte:X`):** Cada ZC tiene una probabilidad del **X%** de morir por inanición y desaparecer, dejando la celda **Libre**.
2. **Movimiento Adyacente:** Si sobrevive, un ZC se mueve a **una de las 8 zonas adyacentes** elegida al azar, **solo si está Libre**. Si no hay zonas libres, permanece quieto.
3. **Contagio (`contagio:C`):** Después de moverse, el ZC intenta infectar a sus vecinos sanos. Si hay una Persona Sana adyacente, tiene una probabilidad del **C%** de ser infectada y convertirse en ZC en el siguiente ciclo.

## 4. Reglas de las Personas Sanas

Las personas sanas también luchan por sobrevivir:

1. **Movimiento Adyacente:** Se mueven a **una de las 8 zonas adyacentes** elegida al azar, **solo si está Libre**. Si no tienen donde ir, permanecen quietas.
2. **Defensa (`matar:K`):** Si tiene uno o más ZC adyacentes, tiene una probabilidad del **K%** de matar a **un ZC vecino** (elegido al azar), dejando su zona **Libre**.

## 5. Ejecución

El programa se ejecuta desde la línea de comandos definiendo las condiciones iniciales:

```bash
.\Simulador.exe dimension:40 infectados:10 sanos:300 contagio:35 tiempo:100 muerte:15 matar:5
```

| Parámetro | Clave | Rango | Descripción |
| :--- | :--- | :--- | :--- |
| **Dimensión** | `dimension` | `> 0` | Tamaño de la matriz (ej: `dimension:40` → 40×40) |
| **Infectados** | `infectados` | `≥ 0` | Número inicial de Zombies del Código |
| **Sanos** | `sanos` | `≥ 0` | Número inicial de Personas Sanas |
| **Contagio** | `contagio` | `0-100` | Probabilidad (%) de infección por ZC |
| **Tiempo** | `tiempo` | `> 0` | Ciclos máximos de la simulación |
| **Muerte ZC** | `muerte` | `0-100` | Probabilidad (%) de que un ZC muera por ciclo |
| **Matanza Sano** | `matar` | `0-100` | Probabilidad (%) de que un sano mate a un ZC adyacente |

## 6. Condiciones de Finalización

La simulación termina cuando se cumple alguna de estas condiciones:

- **Victoria Humana:** No quedan ZC.
- **Victoria del Virus:** No quedan Personas Sanas.
- **Límite de Tiempo:** Se alcanza el número máximo de ciclos.

## 7. Resultado Final

El programa muestra:

- El estado final de la matriz.
- Quién ganó (humanos, virus, o tiempo agotado).
- Estadísticas: ciclos totales, ZC eliminados, sanos supervivientes.

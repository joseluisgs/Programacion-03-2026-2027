# 15. Minerales Matriz - Advanced

## Enunciado

Versión pulida de la exploración mineral 2D (ejemplo 19) que incorpora mejoras profesionales:

- **Spectre.Console Progress**: Reemplaza la barra de progreso ANSI manual con la barra de progreso nativa de Spectre.Console, más estilizada y con soporte de actualización en tiempo real.
- **Serilog**: Añade logging estructurado a archivo y consola para registrar cada movimiento, colecta y eventos del robot.
- **MarkupLine**: Usa `AnsiConsole.MarkupLine` para salida con colores y formato enriquecido en lugar de códigos ANSI manuales.
- **Parámetros `ref`**: Usa `ref` para pasar la posición del robot por referencia, permitiendo que las funciones de movimiento la modifiquen directamente.
- **Tuple-pattern switch**: Emplea patrones de tupla en `switch` para combinar dirección y condición de forma concisa.

Se mantiene la lógica base del ejemplo 19 (matriz 10x10, 8 direcciones, structs, movimiento) y se profesionaliza la presentación y persistencia.

## Conceptos Clave

- **Todo lo del ejemplo 19**: `int[,]`, structs `Posicion` y `Direccion`, movimiento 8-direccional, `Console.Clear()`.
- **Spectre.Console Progress**: `AnsiConsole.Progress()` con `ctx.AddTask()` para barras de progreso actualizables con texto y porcentaje.
- **Serilog**: Configuración con `LoggerConfiguration`, sinks de consola y archivo, logging estructurado con propiedades enriquecidas.
- **`MarkupLine`**: Método de Spectre.Console para imprimir líneas con formato de markup (colores, negrita, cursiva, etc.).
- **Parámetros `ref`**: Paso por referencia que permite modificar el valor original de la variable llamada (ej: `MoverRobot(ref posicion, direccion)`).
- **Tuple-pattern switch**: Uso de tuplas en `switch` para combinar múltiples condiciones: `switch (direccion, enBorde) { ("Norte", true) => ..., ... }`.

## Solución

1. **Configurar Serilog**:
   - `new LoggerConfiguration().MinimumLevel.Debug().WriteTo.Console().WriteTo.File("minerales.log").CreateLogger()`.
   - Registrar cada movimiento, colecta y evento significativo.

2. **Inicializar matriz 10x10** y structs de dirección (similar al ejemplo 19).

3. **Crear Progress de Spectre.Console**:
   - `AnsiConsole.Progress()` → `ctx.AddTask("Exploración", maxValue: 30)`.
   - Actualizar barra en cada paso con `task.Increment(1)`.

4. **Función de movimiento con `ref`**:
   ```csharp
   void MoverRobot(ref Posicion pos, Direccion dir) {
       pos.Fila += dir.DeltaFila;
       pos.Columna += dir.DeltaColumna;
   }
   ```

5. **Tuple-pattern switch** para lógica de dirección:
   ```csharp
   switch (enBorde, cambiandoDireccion) {
       (true, _) => InvertirDireccion(ref dir),
       (_, true) => NuevaDireccionAleatoria(),
       _ => MantenerDireccion()
   }
   ```

6. **Salida con MarkupLine**: Colores y formato enriquecido para el mapa, posición del robot y estadísticas.

7. **Cierre**: `Log.CloseAndFlush()` para Serilog.

> Comparte diagrama de flujo con el ejemplo 19 (MineralesMatriz), ya que la lógica de negocio es esencialmente la misma. Las diferencias están en la capa de presentación (Spectre.Console vs ANSI manual) y persistencia (Serilog).

# 02. Logger

## Enunciado

Compara dos frameworks de logging populares en .NET lado a lado, mostrando cómo configurar y usar cada uno para escribir mensajes de diferentes niveles de severidad en consola:

1. **Microsoft.Extensions.Logging**: Framework oficial de .NET con `LoggerFactory` y proveedor de consola (`ConsoleLoggerProvider`).
2. **Serilog**: Framework de logging estructurado con `LoggerConfiguration` y sink de consola (`ConsoleSink`).

Ambos frameworks se usan para mostrar los mismos niveles de log, permitiendo comparar sintaxis, configuración y formato de salida.

## Conceptos Clave

- **NuGet Microsoft.Extensions.Logging**: Paquete oficial que define la abstracción `ILogger` y `ILoggerFactory`.
- **NuGet Serilog + Serilog.Sinks.Console**: Framework de logging estructurado con soporte para enriquecimiento, formato personalizado y múltiples sinks.
- **Niveles de log**: `Trace` → `Debug` → `Information` → `Warning` → `Error` → `Critical` (Microsoft) / `Fatal` (Serilog).
- **`ILogger<T>`**: Interfaz genérica para loggers tipados por la clase que los usa.
- **`LoggerFactory.Create`**: Método estático para crear instancias de `ILoggerFactory` con configuración programática.
- **`LoggerConfiguration`**: Clase de Serilog para configurar niveles mínimos, sinks y enriquecedores.

## Solución

### Enfoque 1: Microsoft.Extensions.Logging

1. Instalar `Microsoft.Extensions.Logging` y `Microsoft.Extensions.Logging.Console`.
2. Crear `ILoggerFactory` con `LoggerFactory.Create(builder => builder.AddConsole())`.
3. Obtener `ILogger` con `factory.CreateLogger("Program")`.
4. Llamar a los niveles: `LogTrace`, `LogDebug`, `LogInformation`, `LogWarning`, `LogError`, `LogCritical`.
5. Ejemplo de uso: `logger.LogInformation("Proceso {Nombre} completado", nombreProceso)`.

### Enfoque 2: Serilog

1. Instalar `Serilog` y `Serilog.Sinks.Console`.
2. Configurar: `new LoggerConfiguration().WriteTo.Console().MinimumLevel.Verbose().CreateLogger()`.
3. Asignar a `Log.Logger` estático o inyectar.
4. Llamar a los niveles: `Log.Verbose`, `Log.Debug`, `Log.Information`, `Log.Warning`, `Log.Error`, `Log.Fatal`.
5. Cerrar el logger al final: `Log.CloseAndFlush()`.

### Comparación

| Aspecto | Microsoft.Extensions.Logging | Serilog |
|---------|-------------------------------|---------|
| Configuración | Builder pattern | Fluent API |
| Formato por defecto | Texto plano | Texto coloreado enriquecido |
| Estructurado | Requiere proveedor adicional | Nativo |
| Rendimiento | Bueno | Excelente |
| Personalización | Limitada | Muy extensible |

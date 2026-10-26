- [8. Instalación de librerías con NuGet](#8-instalación-de-librerías-con-nuget)
  - [8.1. NuGet y el comando dotnet add package](#81-nuget-y-el-comando-dotnet-add-package)
  - [8.2. Microsoft.Extensions.Logging](#82-microsoftextensionslogging)
  - [8.3. Serilog](#83-serilog)
  - [8.4. Spectre.Console](#84-spectreconsole)
  - [8.5. Tabla comparativa de las tres librerías](#85-tabla-comparativa-de-las-tres-librerías)
  - [8.6. Errores comunes al instalar paquetes](#86-errores-comunes-al-instalar-paquetes)
  - [¿Qué viene después?](#qué-viene-después)
  - [Buenas prácticas](#buenas-prácticas)



# 8. Instalación de librerías con NuGet

> 💡 **Punto de partida:** ¿De dónde salen los colores de una tabla en consola o los mensajes "con estilo" de un programa? No los escribes a mano: se **instalan**. C# viene de serie con una biblioteca estándar enorme, pero para casi todo lo demás —logging serio, consolas con color, validaciones— se usan **paquetes NuGet**. En este punto aprendes a instalarlos y configurarlos con las tres librerías que usaremos en la unidad.

**Objetivos de aprendizaje:**

- Entender qué es NuGet y añadir un paquete con la CLI (`dotnet add package`)
- Configurar y usar el logger oficial de .NET: `Microsoft.Extensions.Logging`
- Configurar y usar Serilog, logging estructurado con múltiples destinos (sinks)
- Embellecer la consola con `Spectre.Console` (tablas, colores, entradas)
- Comparar las tres librerías y saber cuándo conviene cada una

## 8.1. NuGet y el comando dotnet add package

**NuGet** es el gestor de paquetes de .NET: un almacén online con más de 400.000 librerías que se descargan y referencian desde tu proyecto. La forma más cómoda de instalar un paquete es la **CLI de .NET** desde la carpeta del proyecto:

```bash
# Añadir una librería al proyecto actual
dotnet add package Spectre.Console

# Ver todos los paquetes instalados y sus versiones
dotnet list package

# Restaurar paquetes (normalmente lo hace build automáticamente)
dotnet restore
```

Cuando instalas, .NET escribe una referencia en el fichero `.csproj`. Esa línea es **la instalación hecha y versionada**: quien clone el proyecto la restaura automáticamente.

```xml
<ItemGroup>
  <PackageReference Include="Spectre.Console" Version="0.53.0" />
  <PackageReference Include="Serilog.Sinks.Console" Version="6.1.1" />
</ItemGroup>
```

📌 Ejemplo real: el editor **Rider** (y Visual Studio Code) tienen paneles gráficos de "NuGet" para instalar con un clic, pero en el ámbito profesional se prefiere la CLI: queda en los `scripts`, en la documentación y en los管道 de integración continua sin depender de un IDE.

> 📝 **Nota:** la versión del paquete se fija en el `.csproj`. No compites "la última" a ciegas: se usa la versión con la que se probó el código, para que mañana el ejemplo siga compilando igual.

> 💡 **Consejo:** tras añadir un paquete, compila de inmediato (`dotnet build`). Si el paquete no existe o la versión es errónea, el error aparece en el **restore**, no en el código.

## 8.2. Microsoft.Extensions.Logging

`Microsoft.Extensions.Logging` es el **framework oficial de logging de .NET**. Ofrece una abstracción común (`ILogger`) sobre la que se montan distintos destinos (consola, fichero…). En consola se usa con el paquete `Microsoft.Extensions.Logging.Console`:

```bash
dotnet add package Microsoft.Extensions.Logging.Console
```

La configuración se hace con un `LoggerFactory` (builder pattern) y a partir de ahí se obtienen loggers tipados. Este es el patrón completo, tal y como aparece en el ejemplo `02-Logger` de esta unidad:

```csharp
using Microsoft.Extensions.Logging;

// Crear la fábrica de logs con destino consola
using var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
var logger = loggerFactory.CreateLogger<Program>();

// Seis niveles, de menos a más grave
logger.LogTrace("Mensaje de traza");
logger.LogDebug("Mensaje de depuración");
logger.LogInformation("Hola, este es un mensaje informativo.");
logger.LogWarning("¡Cuidado! Algo puede estar mal.");
logger.LogError("Ha ocurrido un error.");
logger.LogCritical("Error crítico, el sistema puede caerse.");
```

📌 Ejemplo real: cualquier aplicación **ASP.NET Core** de producción escribe su traza con `ILogger`. Si un día depuras una API de Netflix o de una banca online desde sus logs, verás este mismo formato de mensaje.

Dos detalles importantes del uso:

- `using var loggerFactory = ...` — la fábrica implementa `IDisposable`; el `using` la cierra al salir y **vuelca** lo que quede pendiente.
- Los mensajes admiten **marcadores de posición**: `logger.LogInformation("Usuario {Usuario} hizo login", usuario)` deja el texto estructurado para consultarlo después.

## 8.3. Serilog

**Serilog** es un framework de logging **estructurado**: más flexible y extensible que el oficial, con mensajes enriquecidos, formato coloreado en consola y múltiples **destinos (sinks)**: consola, fichero, base de datos… El paquete básico de consola es `Serilog.Sinks.Console`:

```bash
dotnet add package Serilog.Sinks.Console
# Destino a fichero (usado en los ejemplos "Advanced")
dotnet add package Serilog.Sinks.File
```

La configuración es una **API fluida** y se hace una sola vez al arrancar, asignando a `Log.Logger` (estático). También del ejemplo `02-Logger`:

```csharp
using Serilog;

// Configurar Serilog (una sola vez)
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

// Niveles de Serilog (Fatal es el más grave)
Log.Information("Hola, este es un mensaje informativo con Serilog.");
Log.Warning("¡Cuidado! Algo puede estar mal con Serilog.");
Log.Error("Ha ocurrido un error con Serilog.");
Log.Fatal("Error crítico con Serilog, el sistema puede caerse.");

// Al terminar: vuelca y libera el logger
Log.CloseAndFlush();
```

📌 Ejemplo real: Serilog es el estándar *de facto* en el ecosistema .NET. Plataformas como **Stack Overflow** o múltiples servicios en Azure lo usan para guardar en fichero y en base de datos lo que ocurre en producción, con campos consultables (usuario, operación, duración).

> 💡 **Consejo:** para añadir un segundo destino basta encadenar `.WriteTo.File("app.log")`. Los **sinks** se combinan: consola *y* fichero a la vez sin duplicar código.

## 8.4. Spectre.Console

**Spectre.Console** no hace logging: hace que tu consola se vea **bien**. Tablas con bordes, texto con color mediante *markup*, menús interactivos, barras de progreso… El paquete es `Spectre.Console` y su punto de entrada es `AnsiConsole`:

```bash
dotnet add package Spectre.Console
```

Este es el corazón del ejemplo `01-SpectreBasico` de esta unidad:

```csharp
using Spectre.Console;

// Texto con color usando etiquetas de estilo [color]...[/]
AnsiConsole.MarkupLine("[green]Aprobados:[/] 4 de 5");

// Una tabla con bordes y cabeceras
var tabla = new Table()
    .Border(TableBorder.Rounded)
    .AddColumn(new TableColumn("Alumno").Centered())
    .AddColumn(new TableColumn("Nota").Centered());
tabla.AddRow("Lucía", "7,5");
AnsiConsole.Write(tabla);
```

📌 Ejemplo real: herramientas como `dotnet ef` o el propio instalador de **Rider** usan consolas enriquecidas parecidas; con Spectre obtienes ese acabado (colores, iconos, tablas) en tus propios programas de consola.

Un detalle crítico de trabajo con Spectre: el usuario puede escribir **corchetes** en sus entradas; si van a imprimirse con `Markup`, escápalo con `Markup.Escape(valor)` o el motor de estilos fallará.

## 8.5. Tabla comparativa de las tres librerías

| Aspecto | Microsoft.Extensions.Logging | Serilog | Spectre.Console |
| :--- | :--- | :--- | :--- |
| **Para qué sirve** | Traza y diagnóstico de la app | Traza y diagnóstico de la app | Presentación en consola |
| **API** | Builder pattern (`LoggerFactory`) | API fluida (`LoggerConfiguration`) | Estática (`AnsiConsole`) |
| **Configuración** | Programática | Programática | No necesita |
| **Destinos (sinks)** | Consola, fichero… vía providers | Consola, fichero, BD… nativo | La propia consola |
| **Niveles** | Trace → Critical | Verbose → Fatal | No aplica (markup de color) |
| **Versiones en los ejemplos** | `9.0.10` | `6.1.1` / `7.0.0` | `0.53.0` |
| **Ejemplos de la UD** | `02-Logger` | `02-Logger`, `24`, `25` | `01-SpectreBasico`, `13`, `15`, `25` |

Como ves, las dos primeras **no compiten**: se dedican a loguear (y pueden usarse juntas), mientras que Spectre es de **presentación**. Son complementarias: primero registras lo que pasa, luego lo muestras bonito.

## 8.6. Errores comunes al instalar paquetes

- **`NU1101: no se encuentra el paquete`** — error en el nombre del paquete o falta el *restore*. Revisa el nombre y ejecuta `dotnet restore`.
- **Versión incompatible con el framework** — el paquete no soporta `net10.0`. Comprueba la versión en `dotnet list package`.
- **Olvidar el `using`** — el paquete está instalado pero falta `using Spectre.Console;` (o el equivalente): el compilador no reconoce los tipos.
- **Instalar en la carpeta equivocada** — los comandos `dotnet add package` se ejecutan *dentro* de la carpeta del proyecto (la que contiene el `.csproj`).
- **Mezclar loggers a lo loco** — usar `Microsoft.Extensions.Logging` y `Serilog` a la vez es válido (el ejemplo `02-Logger` los compara), pero en un proyecto real se elige uno para no mantener dos configuraciones.

## ¿Qué viene después?

En el siguiente punto cerraremos la unidad con un resumen completo: mapa conceptual, errores comunes, checklist de supervivencia y glosario de términos clave.

---

**Resumen del punto:**

| Concepto | Descripción |
| :--- | :--- |
| **NuGet** | Gestor de paquetes de .NET; `dotnet add package` añade la referencia al `.csproj` |
| **Microsoft.Extensions.Logging** | Logger oficial de .NET; `LoggerFactory` + `ILogger` con niveles Trace → Critical |
| **Serilog** | Logging estructurado; API fluida, sinks (consola, fichero), niveles Verbose → Fatal |
| **Spectre.Console** | Consola enriquecida: `Table`, `MarkupLine`, `TextPrompt`, `Progress` |
| **Sinks** | Destinos de un logger (consola, fichero…); en Serilog se encadenan con `.WriteTo.X()` |
| **`Markup.Escape()`** | Escapa corchetes del usuario antes de imprimirlos con `Markup` |

## Buenas prácticas

- [ ] Instalar paquetes por CLI (`dotnet add package`) y no solo desde el IDE
- [ ] Fijar versiones en el `.csproj` y no depender de "la última" sin probar
- [ ] Elegir UN logger por proyecto (Serilog *o* Microsoft.Extensions.Logging)
- [ ] Cerrar siempre los recursos: `using` en la fábrica y `Log.CloseAndFlush()` al final
- [ ] Separar responsabilidades: Serilog/Microsoft registran, Spectre decora la consola

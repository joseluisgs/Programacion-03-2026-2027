- [8. Instalación de librerías con NuGet](#8-instalación-de-librerías-con-nuget)
  - [8.1. NuGet y el comando dotnet add package](#81-nuget-y-el-comando-dotnet-add-package)
  - [8.2. Configuración: el fichero `nuget.config`](#82-configuración-el-fichero-nugetconfig)
  - [8.3. NuGet en Rider](#83-nuget-en-rider)
  - [8.4. ¿Qué es un log y sus niveles?](#84-qué-es-un-log-y-sus-niveles)
  - [8.5. Microsoft.Extensions.Logging](#85-microsoftextensionslogging)
  - [8.6. Serilog](#86-serilog)
  - [8.7. Spectre.Console](#87-spectreconsole)
  - [8.8. Tabla comparativa de las tres librerías](#88-tabla-comparativa-de-las-tres-librerías)
  - [8.9. Errores comunes al instalar paquetes](#89-errores-comunes-al-instalar-paquetes)
  - [¿Qué viene después?](#qué-viene-después)
  - [Buenas prácticas](#buenas-prácticas)



# 8. Instalación de librerías con NuGet

> 💡 **Punto de partida:** ¿De dónde salen los colores de una tabla en consola o los mensajes "con estilo" de un programa? No los escribes a mano: se **instalan**. C# viene de serie con una biblioteca estándar enorme, pero para casi todo lo demás —logging serio, consolas con color, validaciones— se usan **paquetes NuGet**. En este punto aprendes a instalarlos y configurarlos con las tres librerías que usaremos en la unidad.

**Objetivos de aprendizaje:**

- Entender qué es NuGet, consultar los paquetes en https://www.nuget.org/ y añadirlos con la CLI (`dotnet add package`) o con Rider
- Configurar las fuentes de paquetes en el fichero `nuget.config` (Windows, Linux y macOS)
- Entender qué es un log y elegir el nivel adecuado: de Trace a Critical
- Configurar y usar el logger oficial de .NET: `Microsoft.Extensions.Logging`
- Configurar y usar Serilog, logging estructurado con múltiples destinos (sinks)
- Embellecer la consola con `Spectre.Console` (tablas, colores, entradas)
- Comparar las tres librerías y saber cuándo conviene cada una

## 8.1. NuGet y el comando dotnet add package

**NuGet** es el **gestor de paquetes de .NET**: la manera que tiene el ecosistema .NET de compartir librerías. Un "paquete" es código ya escrito, empaquetado y publicado por alguien (Microsoft, una empresa, un desarrollador) que tú descargas y referencias en tu proyecto en lugar de reinventarlo.

La galería oficial es **https://www.nuget.org/**: ahí buscas el paquete por nombre, lees su descripción, sus **versiones**, sus dependencias y su licencia **antes** de instalarlo. Por ejemplo, si buscas `Spectre.Console` verás su ficha con la última versión publicada y el comando exacto para añadirlo.

**Cómo funciona por dentro:** al añadir un paquete, .NET lo descarga a una **caché local** (se descarga una vez y lo aprovechan todos tus proyectos) y escribe una referencia en el fichero `.csproj`. Esa línea es **la instalación hecha y versionada**: quien clone el proyecto restaurará exactamente esa versión.

Los comandos, uno por uno. Todos se ejecutan **dentro de la carpeta del proyecto** (la que contiene el `.csproj`):

```bash
# Añadir un paquete al proyecto actual: escribe la referencia en el .csproj
dotnet add package Spectre.Console

# Añadir una versión concreta, si la más reciente no te sirve
dotnet add package Serilog.Sinks.File --version 6.1.1

# Restaurar: descarga a la caché local todo lo que el .csproj pide
dotnet restore

# Listar los paquetes instalados con sus versiones
dotnet list package

# Truco: ver si hay versiones más nuevas publicadas
dotnet list package --outdated

# Quitar un paquete: borra la referencia del .csproj
dotnet remove package Serilog.Sinks.File
```

Qué hace cada uno:

- **`dotnet add package`** — es "instalar": modifica tu `.csproj` añadiendo la `PackageReference`. Ojo dónde lo ejecutas: si no estás en la carpeta del proyecto, la referencia va donde no toca.
- **`dotnet restore`** — no instala nada nuevo; **descarga** a la caché lo que el `.csproj` ya pide. Lo lanza automáticamente cada `dotnet build`, pero conviene ejecutarlo a mano tras clonar un proyecto o cuando el build queja de paquetes.
- **`dotnet list package`** — inventario de lo que tienes, con versiones; con `--outdated` te muestra además qué paquetes se han quedado atrás.
- **`dotnet remove package`** — es "desinstalar": borra la `PackageReference` del `.csproj`, con la misma regla de carpeta que `add`. El paquete sigue en la caché local por si lo usan otros proyectos, pero tu proyecto ya no lo referencia.

La referencia que escribe `add package` en el `.csproj` tiene esta pinta:

```xml
<ItemGroup>
  <PackageReference Include="Spectre.Console" Version="0.53.0" />
  <PackageReference Include="Serilog.Sinks.Console" Version="6.1.1" />
</ItemGroup>
```

📌 Ejemplo real: el editor **Rider** tiene una ventana gráfica de NuGet para instalar con un clic, pero en el ámbito profesional se prefiere la CLI: queda en los `scripts`, en la documentación y en los pipelines de integración continua sin depender de un IDE.

> 📝 **Nota:** la versión del paquete se fija en el `.csproj`. No compites "la última" a ciegas: se usa la versión con la que se probó el código, para que mañana el ejemplo siga compilando igual.

> 💡 **Consejo:** tras añadir un paquete, compila de inmediato (`dotnet build`). Si el paquete no existe o la versión es errónea, el error aparece en el **restore**, no en el código.

## 8.2. Configuración: el fichero `nuget.config`

El `nuget.config` es un **fichero XML** que le dice a NuGet **de dónde** sacar los paquetes (sus *fuentes*) y cómo gestionarlos. De serie, NuGet ya trae configurada la fuente oficial `nuget.org`, pero conviene saber configurarlo: si un equipo no tiene ninguna fuente, `dotnet restore` no puede descargar nada.

Es un fichero **por usuario**: vive en tu directorio de usuario y se aplica a todos tus proyectos. La ruta cambia según el sistema operativo:

| Sistema | Ruta del `nuget.config` de usuario |
| :--- | :--- |
| **Windows** | `C:\Users\<tu-usuario>\AppData\Roaming\NuGet\NuGet.Config` |
| **Linux** | `~/.config/NuGet/NuGet.Config` |
| **macOS** | `~/.config/NuGet/NuGet.Config` |

Su contenido mínimo, con la fuente oficial, es este:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
  </packageSources>
</configuration>
```

Cada `<add>` es una **fuente**: `key` es el nombre visible, `value` la URL del servidor de paquetes y `protocolVersion="3"` usa la API v3, la actual. Para comprobar qué fuentes tienes configuradas:

```bash
dotnet nuget list source
```

📌 Ejemplo real: en una empresa se añade a ese mismo fichero una segunda línea con el servidor interno de paquetes (`<add key="empresa" value="https://pkgs.empresa.local/v3/index.json" />`); los equipos del centro hacen algo parecido con la fuente de su academia. Mismo fichero, más fuentes.

> 📝 **Nota:** Si el fichero ya existe, **no lo reescribas a ciegas**: añade tus líneas dentro de `<packageSources>` sin borrar la de `nuget.org`, o dejarás de poder descargar nada de la galería oficial.

## 8.3. NuGet en Rider

Instalar un paquete desde **Rider** es lo mismo que por CLI, solo que con ratón: el IDE escribe la misma línea en tu `.csproj`.

1. Abre la ventana **NuGet** de Rider (barra lateral o `View → Tool Windows → NuGet`): muestra los paquetes instalados y te deja **buscar** en nuget.org.
2. Elige el paquete y la versión y pulsa **Install**: Rider añade la `PackageReference` al `.csproj` y lanza el *restore*.
3. El resultado es **idéntico** al de `dotnet add package`: misma línea en el `.csproj`, mismos archivos en la caché.

Si prefieres los comandos, Rider tiene terminal integrada (`Alt+F12`) con exactamente los comandos de la sección 8.1. Y ojo: Rider respeta el mismo `nuget.config` de usuario — si cambias tus fuentes, la ventana NuGet y la CLI verán lo mismo.

> 💡 **Consejo:** usa la ventana NuGet para **explorar** (versiones, dependencias) y la CLI para **instalar en clase o en equipo**: el comando queda documentado y todos instalamos exactamente lo mismo.

## 8.4. ¿Qué es un log y sus niveles?

Un **log** (o bitácora) es un **registro cronológico de lo que hace un programa**: fecha y hora, un **nivel** y un mensaje —por ejemplo, `2026-11-10 09:15:02 [INF] Usuario ana inició sesión`. A diferencia de un `Console.WriteLine`, un log se puede **filtrar por nivel**, enviar a varios **destinos** (consola, fichero…) y subir o bajar de nivel sin tocar el código. Sirve para diagnosticar: cuando algo falla en producción, lo primero que se mira es el log.

Los mensajes se clasifican en **niveles**, de menos a más grave:

| Nivel | Cuándo se usa | Ejemplo |
| :--- | :--- | :--- |
| **Trace** | Detalle extremo, para rastrear el camino interno | "Entrando en CalcularPrecio()" |
| **Debug** | Información para desarrollador durante la depuración | "Leídos 120 registros de la base de datos" |
| **Information** | Hechos normales de la aplicación | "Servidor arrancado en el puerto 5000" |
| **Warning** | Algo raro, pero la aplicación sigue funcionando | "Quedan 3 reintentos antes de fallar" |
| **Error** | Una operación falló; la aplicación continúa | "No se pudo enviar el email a ana@..." |
| **Critical** | Fallo grave; la aplicación puede caerse | "Sin conexión a la base de datos: imposible continuar" |

La regla práctica: en **desarrollo** puedes dejar `Debug` o `Trace` activos para verlo todo; en **producción** se muestra `Information` o superior, para que el log no se llene de ruido. Cada librería usa sus nombres: Microsoft va de `Trace` a `Critical` y Serilog de `Verbose` a `Fatal` — los mismos niveles con otras etiquetas.

📌 Ejemplo real: cuando Netflix te avisa de "hemos detectado un problema en tu cuenta", alguien (o una alarma automática) leyó un log con nivel `Error` o `Critical`, con la hora exacta y el identificador de tu sesión.

## 8.5. Microsoft.Extensions.Logging

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

## 8.6. Serilog

**Serilog** es un framework de logging **estructurado** (web oficial: **https://serilog.net/**): más flexible y extensible que el oficial, con mensajes enriquecidos, formato coloreado en consola y múltiples **destinos (sinks)**: consola, fichero, base de datos… El paquete básico de consola es `Serilog.Sinks.Console`:

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

## 8.7. Spectre.Console

**Spectre.Console** no hace logging: hace que tu consola se vea **bien** (web oficial: **https://spectreconsole.net/**). Tablas con bordes, texto con color mediante *markup*, menús interactivos, barras de progreso… El paquete es `Spectre.Console` y su punto de entrada es `AnsiConsole`:

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

## 8.8. Tabla comparativa de las tres librerías

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

## 8.9. Errores comunes al instalar paquetes

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
| **`nuget.config`** | Fichero XML por usuario que define las fuentes de paquetes (Windows, Linux, macOS) |
| **Log y niveles** | Registro cronológico filtrable: Trace → Critical (Serilog: Verbose → Fatal) |
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
- [ ] Buscar el paquete en nuget.org y leer su fichero antes de instalarlo
- [ ] Elegir el nivel del log según el entorno: Information o superior en producción, Debug al depurar

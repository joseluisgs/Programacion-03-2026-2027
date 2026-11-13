using Spectre.Console;

// ============================================================
// 01. Primeros pasos con Spectre.Console (entrada/salida y tablas)
//
// Ejemplo BÁSICO de presentación en consola con la librería
// Spectre.Console: texto con color (Markup), una tabla, entrada
// validada del usuario y una barra de progreso. Sirve de toma de
// contacto con las librerías NuGet antes de ver las más complejas.
//
// Conceptos UD03 que repasa:
//   - Instalación de una librería NuGet (dotnet add package) — 0
//   - AnsiConsole como punto de entrada de Spectre — 0
//   - Markup con etiquetas de estilo [green]...[/] — 5
//   - Table para tablas formateadas — 5
//   - Prompt / TextPrompt para entrada validada — 5
//   - Progress para barras de progreso — 5
//
// Instalación: dotnet add package Spectre.Console
// ============================================================

// Main Program

// Título con regla decorativa y texto con color (Markup)
AnsiConsole.Write(new Rule("[blue]🎯 Gestión de notas con Spectre.Console[/]").LeftJustified());
AnsiConsole.MarkupLine("[grey]Ejemplo básico: tablas, colores, entrada y progreso[/]\n");

// Datos de ejemplo: dos arrays paralelos (nombre y nota)
var nombres = new string[] { "Lucía", "Marcos", "Aitana", "Diego", "Sofía" };
var notas = new double[] { 7.5, 4.0, 9.2, 5.5, 8.8 };

// 1) Tabla: la forma más vistosa de mostrar una colección de datos
MostrarTablaNotas(nombres, notas);

// 2) Conteo de aprobados con color condicional
var aprobados = ContarAprobados(notas);
AnsiConsole.MarkupLine($"\n[green]Aprobados:[/] {aprobados} de {notas.Length}");

// 3) Entrada validada del usuario. TextPrompt de Spectre lee tecla a tecla
//    (repite la pregunta hasta que sea válida), por eso necesita consola
//    interactiva: si no la hay (tubería, CI), usamos un alumno de ejemplo.
string alumno;
if (Console.IsInputRedirected) {
    alumno = "Aitana";
    AnsiConsole.MarkupLine($"[blue]¿Qué alumno quieres consultar?[/] {alumno} [grey](modo no interactivo)[/]");
}
else {
    alumno = AnsiConsole.Prompt(
        new TextPrompt<string>("[blue]¿Qué alumno quieres consultar?[/]")
            .Validate((string n) => nombres.Contains(n, StringComparer.OrdinalIgnoreCase)
                ? ValidationResult.Success()
                : ValidationResult.Error("[red]Ese alumno no existe[/]")));
}

var idx = Array.FindIndex(nombres, n => string.Equals(n, alumno, StringComparison.OrdinalIgnoreCase));
AnsiConsole.MarkupLine($"   Nota de [yellow]{Markup.Escape(alumno)}[/]: [bold]{notas[idx]:F1}[/]");

// 4) Barra de progreso: operación simulada con trabajo por pasos
SimularProcesoAnalisis();

AnsiConsole.MarkupLine("\n[green]✅ ¡Ejemplo completado![/]");

// End Main Program

// Muestra los alumnos y sus notas en una tabla con cabeceras y bordes.
void MostrarTablaNotas(string[] nombres, double[] notas) {
    var tabla = new Table()
        .Border(TableBorder.Rounded)
        .Title("[blue]Notas de la clase[/]")
        .AddColumn(new TableColumn("Alumno").Centered())
        .AddColumn(new TableColumn("Nota").Centered())
        .AddColumn(new TableColumn("Estado").Centered());

    for (var i = 0; i < nombres.Length; i++) {
        // Color del estado según la nota (5 = aprobado)
        var estado = notas[i] >= 5.0
            ? "[green]Aprobado[/]"
            : "[red]Suspenso[/]";

        tabla.AddRow(nombres[i], notas[i].ToString("F1"), estado);
    }

    AnsiConsole.Write(tabla);
}

// Cuenta los alumnos con nota mayor o igual que 5 (acumulador).
int ContarAprobados(double[] notas) {
    var contador = 0;

    for (var i = 0; i < notas.Length; i++)
        if (notas[i] >= 5.0)
            contador++;

    return contador;
}

// Simula un proceso largo con una barra de progreso de Spectre.
// Cada paso del bucle avanza la barra; el mensaje se actualiza en vivo.
void SimularProcesoAnalisis() {
    AnsiConsole.MarkupLine("\n[blue]Procesando notas...[/]");

    AnsiConsole.Progress()
        .AutoClear(true)
        .Columns(new ProgressColumn[]
        {
            new TaskDescriptionColumn(),
            new ProgressBarColumn().CompletedStyle(new Style(Color.Green)),
            new PercentageColumn(),
            new RemainingTimeColumn()
        })
        .Start(ctx => {
            var tarea = ctx.AddTask("[green]Analizando[/]");
            for (var i = 0; i <= 10; i++) {
                Thread.Sleep(60); // trabajo simulado
                tarea.Increment(10);
            }
        });
}

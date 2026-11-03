using System.Text.RegularExpressions;

var entero = LeerEnteroTryParse("Introduce un entero: ", 0, 100);
Console.WriteLine($"El entero es {entero}");

entero = LeerEnteroConRegex("Introduce un entero: ", 0, 100);
Console.WriteLine($"El entero es {entero}");

var isOk = IsDniManual("12345678A");
Console.WriteLine($"El DNI es {isOk}");

return;

//----
int LeerEnteroTryParse(string mensaje, int inicial, int final) {
    int resultado;
    bool esValido;
    do {
        Console.Write(mensaje);
        esValido = int.TryParse(Console.ReadLine()?.Trim(), out resultado);
        if (!esValido || resultado < inicial || resultado > final)
            Console.WriteLine("Valor no válido. Inténtelo de nuevo.");
    } while (!esValido || resultado < inicial || resultado > final);

    return resultado;
}

int LeerEnteroConRegex(string mensaje, int inicial, int final) {
    var regex = new Regex(@"^\d+$");
    var resultado = 0;
    bool esValido;
    do {
        Console.Write(mensaje);
        var input = Console.ReadLine()?.Trim() ?? "ERROR";
        esValido = regex.IsMatch(input);
        if (esValido) {
            resultado = int.Parse(input);
            if (resultado >= inicial && resultado <= final) continue;
            Console.WriteLine("Valor no válido. Inténtelo de nuevo.");
            esValido = false;
        }
        else {
            Console.WriteLine("Valor no válido. Inténtelo de nuevo.");
        }
    } while (!esValido);

    return resultado;
}

bool IsDniManual(string dni) {
    var dniMayusculas = dni.ToUpper();
    // Tiene longitud 9
    if (dniMayusculas.Length != 9) return false;
    // el ultimo caracter es una letra entre A a Z
    if (dniMayusculas[dniMayusculas.Length - 1] < 'A' || dniMayusculas[dniMayusculas.Length - 1] > 'Z') return false;
    // Los 8 primeros caracteres son numeros
    for (var i = 0; i < dniMayusculas.Length - 2; i++)
        if (dniMayusculas[i] < '0' || dniMayusculas[i] > '9')
            return false;

    // si llegamos aquí es correcto
    return true;
}

bool IsDniRegex(string dni) {
    var regex = new Regex(@"^\d{8}[A-Z]$");
    return regex.IsMatch(dni.ToUpper());
}

bool IsMatriculaCocheManual(string matricula) {
    // NNNNLLL
    var matMayuscula = matricula.ToUpper();
    if (matMayuscula.Length != 7) return false;

    var numeros = matMayuscula.Substring(0, 4);
    var letras = matMayuscula.Substring(4);

    // Comprobar que son numeros 
    foreach (var n in numeros)
        if (n < '0' || n > '9')
            return false;

    // Comprobar que son letras
    foreach (var l in letras)
        if (l < 'A' || l > 'Z')
            return false;

    return true;
}

bool IsMatriculaCocheRegex(string matricula) {
    var regex = new Regex(@"^\d{4}[A-Z]{3}$");
    return regex.IsMatch(matricula.ToUpper());
}

(int dia, int mes, int anio) LeerFechaManual(string mensaje) {
    // dd-mm-yyyy
    if (mensaje.Length != 10) throw new ArgumentException("Formato de fecha incorrecto");

    // Extraemos las partes
    var partes = mensaje.Split('-');

    // analizamos 
    if (partes.Length != 3) throw new ArgumentException("Formato de fecha incorrecto");

    // dia
    if (partes[0].Length != 2) throw new ArgumentException("Formato de fecha incorrecto");
    if (!int.TryParse(partes[0], out var dia)) throw new ArgumentException("Formato de fecha incorrecto");
    if (dia < 1 || dia > 31) throw new ArgumentException("Formato de fecha incorrecto");

    // mes
    if (partes[1].Length != 2) throw new ArgumentException("Formato de fecha incorrecto");
    if (!int.TryParse(partes[1], out var mes)) throw new ArgumentException("Formato de fecha incorrecto");
    if (mes < 1 || mes > 12) throw new ArgumentException("Formato de fecha incorrecto");

    // anio
    if (partes[2].Length != 4) throw new ArgumentException("Formato de fecha incorrecto");
    if (!int.TryParse(partes[2], out var anio)) throw new ArgumentException("Formato de fecha incorrecto");
    if (anio < 1900 || anio > 2100) throw new ArgumentException("Formato de fecha incorrecto");

    return (dia, mes, anio);
}

(int dia, int mes, int anio) LeerFechaRegex(string mensaje) {
    // Expresión regular con grupos para luego acceder facilmente a cada uno
    // por el nombre que le pongamos.
    
    var regex = new Regex(@"^(?<dia>\d{2})-(?<mes>\d{2})-(?<anio>\d{4})$");
    var match = regex.Match(mensaje);
    if (!match.Success) throw new ArgumentException("Formato de fecha incorrecto");

    var dia = int.Parse(match.Groups["dia"].Value);
    var mes = int.Parse(match.Groups["mes"].Value);
    var anio = int.Parse(match.Groups["anio"].Value);

    if (dia < 1 || dia > 31) throw new ArgumentException("Formato de fecha incorrecto");
    if (mes < 1 || mes > 12) throw new ArgumentException("Formato de fecha incorrecto");
    if (anio < 1900 || anio > 2100) throw new ArgumentException("Formato de fecha incorrecto");

    return (dia, mes, anio);
}
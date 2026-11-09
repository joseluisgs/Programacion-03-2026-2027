using System.Text;
using System.Text.RegularExpressions;
using static System.Console;

// ============================================================
// Validadores de DNI/NIE, matrícula, tarjeta y fecha
// Cada uno en dos versiones: MANUAL y con REGEX
//
// 1. DNI / NIF  : 8 números + letra.  letra = Tabla[numero % 23]
// 2. NIE        : X|Y|Z + 7 números + letra, con X -> 0, Y -> 1, Z -> 2
// 3. Matrícula  : NNNNLLL, con solo 20 letras admitidas
// 4. Tarjeta    : 16 cifras, prefijo Visa/Mastercard, dígito Luhn
// 5. Fecha      : dd-mm-yyyy o dd/mm/yyyy, con grupos de captura
//
// El objetivo es ver cuánto código ahorra la regex... y, sobre todo,
// DÓNDE no puede sustituirnos: la regex valida el FORMATO, pero no
// sabe dividir entre 23, aplicar Luhn ni comprobar rangos.
//
// Temas UD03: 5 (cadenas de texto) y 6 (expresiones regulares)
//
// Fuentes:
//   - Ministerio del Interior, "Cálculo del dígito de control del
//     NIF-NIE" (art. 12 del Real Decreto 255/2025)
//   - Wikipedia, "Matrículas automovilísticas de España"
//   - Wikipedia, "Algoritmo de Luhn" (módulo 10, ISO/IEC 7812-1)
//
// Ejecutar: dotnet run
// ============================================================

OutputEncoding = Encoding.UTF8;

// ------------------------------------------------------------
// TABLAS OFICIALES
// ------------------------------------------------------------

// El resto de dividir entre 23 dice qué letra corresponde. Indexamos
// con (numero % 23) y el índice YA es la posición de la tabla.
// Ejemplo: 12345678 % 23 = 14 -> posición 14 = 'Z' -> 12345678Z
const string LetrasDni = "TRWAGMYFPDXBNJZSQVHLCKE"; // 23 letras

// Las 20 letras que admite una matrícula española: solo consonantes,
// sin vocales, sin Q y sin la Ñ. Si cambia el reglamento, se cambia
// ESTA cadena y nada más.
const string LetrasMatricula = "BCDFGHJKLMNPRSTVWXYZ"; // 20 letras

// Las tres iniciales válidas de un NIE. Cada una vale un número
// distinto (X -> 0, Y -> 1, Z -> 2), así que en el patrón van tal cual.
const string InicialesNie = "XYZ"; // 3 letras

// ------------------------------------------------------------
// BATERÍA DE PRUEBAS
// ------------------------------------------------------------
// Cada caso se pasa por los dos validadores y se compara con lo que
// esperamos. Si algún validador se equivoca, se marca con ⚠️.

WriteLine("==================================================");
WriteLine(" Validadores: DNI, NIE, matrícula, tarjeta y fecha - MANUAL vs REGEX");
WriteLine("==================================================");

WriteLine();
WriteLine("--- 1. DNI / NIF: 8 números y una letra ---");
ImprimirCabecera();
ProbarCaso("12345678Z", true, IsDniManual("12345678Z"), IsDniRegex("12345678Z"));
ProbarCaso("12345678A", false, IsDniManual("12345678A"), IsDniRegex("12345678A"));
ProbarCaso("00000000T", true, IsDniManual("00000000T"), IsDniRegex("00000000T"));
ProbarCaso("99999999R", true, IsDniManual("99999999R"), IsDniRegex("99999999R"));
ProbarCaso("12.345.678 z", true, IsDniManual("12.345.678 z"), IsDniRegex("12.345.678 z"));
ProbarCaso("1234567", false, IsDniManual("1234567"), IsDniRegex("1234567"));
ProbarCaso("123456789Z", false, IsDniManual("123456789Z"), IsDniRegex("123456789Z"));
ProbarCaso("123456781", false, IsDniManual("123456781"), IsDniRegex("123456781"));
ProbarCaso("12345678", false, IsDniManual("12345678"), IsDniRegex("12345678"));
ProbarCaso("ABCDEFGH Z", false, IsDniManual("ABCDEFGH Z"), IsDniRegex("ABCDEFGH Z"));

WriteLine();
WriteLine("--- 2. NIE: X|Y|Z, 7 números y una letra ---");
ImprimirCabecera();
ProbarCaso("X1234567L", true, IsNieManual("X1234567L"), IsNieRegex("X1234567L"));
ProbarCaso("Y1234567X", true, IsNieManual("Y1234567X"), IsNieRegex("Y1234567X"));
ProbarCaso("Z1234567R", true, IsNieManual("Z1234567R"), IsNieRegex("Z1234567R"));
ProbarCaso("X1234567A", false, IsNieManual("X1234567A"), IsNieRegex("X1234567A"));
ProbarCaso("W1234567L", false, IsNieManual("W1234567L"), IsNieRegex("W1234567L"));
ProbarCaso("X123A567L", false, IsNieManual("X123A567L"), IsNieRegex("X123A567L"));
ProbarCaso("X1234567", false, IsNieManual("X1234567"), IsNieRegex("X1234567"));
ProbarCaso("12345678Z", false, IsNieManual("12345678Z"), IsNieRegex("12345678Z"));

WriteLine();
WriteLine("--- 3. Matrícula: NNNNLLL con 20 letras ---");
ImprimirCabecera();
ProbarCaso("1234BCD", true, IsMatriculaManual("1234BCD"), IsMatriculaRegex("1234BCD"));
ProbarCaso("0000BBB", true, IsMatriculaManual("0000BBB"), IsMatriculaRegex("0000BBB"));
ProbarCaso("9999ZZZ", true, IsMatriculaManual("9999ZZZ"), IsMatriculaRegex("9999ZZZ"));
ProbarCaso("7137CHW", true, IsMatriculaManual("7137CHW"), IsMatriculaRegex("7137CHW"));
ProbarCaso("1234 BCD", true, IsMatriculaManual("1234 BCD"), IsMatriculaRegex("1234 BCD"));
ProbarCaso("1234-FTY", true, IsMatriculaManual("1234-FTY"), IsMatriculaRegex("1234-FTY"));
ProbarCaso("1234ABC", false, IsMatriculaManual("1234ABC"), IsMatriculaRegex("1234ABC"));
ProbarCaso("1234QQQ", false, IsMatriculaManual("1234QQQ"), IsMatriculaRegex("1234QQQ"));
ProbarCaso("1234EEE", false, IsMatriculaManual("1234EEE"), IsMatriculaRegex("1234EEE"));
ProbarCaso("12345BC", false, IsMatriculaManual("12345BC"), IsMatriculaRegex("12345BC"));
ProbarCaso("ABCD123", false, IsMatriculaManual("ABCD123"), IsMatriculaRegex("ABCD123"));
ProbarCaso("12345678BCD", false, IsMatriculaManual("12345678BCD"), IsMatriculaRegex("12345678BCD"));

WriteLine();
WriteLine("--- 4. Tarjeta de crédito: 16 cifras + Luhn ---");
ImprimirCabecera();
ProbarCaso("4111111111111111", true, IsTarjetaManual("4111111111111111"), IsTarjetaRegex("4111111111111111"));
ProbarCaso("5105105105105100", true, IsTarjetaManual("5105105105105100"), IsTarjetaRegex("5105105105105100"));
ProbarCaso("5555555555554444", true, IsTarjetaManual("5555555555554444"), IsTarjetaRegex("5555555555554444"));
ProbarCaso("4111 1111 1111 1111", true, IsTarjetaManual("4111 1111 1111 1111"), IsTarjetaRegex("4111 1111 1111 1111"));
ProbarCaso("4111-1111-1111-1111", true, IsTarjetaManual("4111-1111-1111-1111"), IsTarjetaRegex("4111-1111-1111-1111"));
ProbarCaso("4111111111111112", false, IsTarjetaManual("4111111111111112"), IsTarjetaRegex("4111111111111112"));
ProbarCaso("5555555555554445", false, IsTarjetaManual("5555555555554445"), IsTarjetaRegex("5555555555554445"));
ProbarCaso("1234567890123452", false, IsTarjetaManual("1234567890123452"), IsTarjetaRegex("1234567890123452"));
ProbarCaso("411111111111111", false, IsTarjetaManual("411111111111111"), IsTarjetaRegex("411111111111111"));
ProbarCaso("378282246310005", false, IsTarjetaManual("378282246310005"), IsTarjetaRegex("378282246310005"));
ProbarCaso("41111111111111111", false, IsTarjetaManual("41111111111111111"), IsTarjetaRegex("41111111111111111"));
ProbarCaso("411111111111111a", false, IsTarjetaManual("411111111111111a"), IsTarjetaRegex("411111111111111a"));

WriteLine();
WriteLine("--- 5. Fecha: dd-mm-yyyy o dd/mm/yyyy ---");
ImprimirCabecera();
ProbarCaso("01-02-2020", true, IsFechaManual("01-02-2020"), IsFechaRegex("01-02-2020"));
ProbarCaso("01/02/2020", true, IsFechaManual("01/02/2020"), IsFechaRegex("01/02/2020"));
ProbarCaso("31-12-1999", true, IsFechaManual("31-12-1999"), IsFechaRegex("31-12-1999"));
ProbarCaso("15-06-2026", true, IsFechaManual("15-06-2026"), IsFechaRegex("15-06-2026"));
ProbarCaso("01-02/2020", true, IsFechaManual("01-02/2020"), IsFechaRegex("01-02/2020"));
ProbarCaso(" 15-06-2026 ", true, IsFechaManual(" 15-06-2026 "), IsFechaRegex(" 15-06-2026 "));
ProbarCaso("32-01-2020", false, IsFechaManual("32-01-2020"), IsFechaRegex("32-01-2020"));
ProbarCaso("00-01-2020", false, IsFechaManual("00-01-2020"), IsFechaRegex("00-01-2020"));
ProbarCaso("15-13-2020", false, IsFechaManual("15-13-2020"), IsFechaRegex("15-13-2020"));
ProbarCaso("1-02-2020", false, IsFechaManual("1-02-2020"), IsFechaRegex("1-02-2020"));
ProbarCaso("15.06.2020", false, IsFechaManual("15.06.2020"), IsFechaRegex("15.06.2020"));
ProbarCaso("15-06-20", false, IsFechaManual("15-06-20"), IsFechaRegex("15-06-20"));
ProbarCaso("15-06-1800", false, IsFechaManual("15-06-1800"), IsFechaRegex("15-06-1800"));
ProbarCaso("hola", false, IsFechaManual("hola"), IsFechaRegex("hola"));

WriteLine();
WriteLine("Fin de la batería: 56 comprobaciones.");
return;

// ------------------------------------------------------------
// LIMPIEZA DE LA ENTRADA (compartida por los seis validadores)
// ------------------------------------------------------------

// Deja el texto como lo escribiría una persona: quita espacios de los
// extremos, puntos, guiones y espacios intermedios, y lo pasa todo a
// mayúsculas.
//   "12.345.678 z"  ->  "12345678Z"
//   "1234 BCD"      ->  "1234BCD"
string Limpiar(string texto) {
    return texto.Trim()
                .Replace(".", "")
                .Replace("-", "")
                .Replace(" ", "")
                .ToUpper();
}

// ------------------------------------------------------------
// 1. DNI / NIF - VERSIÓN MANUAL
// ------------------------------------------------------------

// Valida un DNI sin usar ninguna regex: longitud, tipo de cada
// carácter, parseo del número y módulo 23.
bool IsDniManual(string dni) {
    var texto = Limpiar(dni);

    // Longitud exacta: 8 números + 1 letra
    if (texto.Length != 9) return false;

    // Con Substring separamos la parte numérica de la letra
    var numeros = texto.Substring(0, 8);   // "12345678"
    var letra = texto.Substring(8);        // "Z"

    // Antes de parsear, comprobamos uno por uno que sean dígitos:
    // si no lo son, int.Parse lanzaría excepción en vez de decirnos nada
    foreach (var c in numeros)
        if (c < '0' || c > '9') return false;

    // Parseamos el trozo extraído. Por dentro int.Parse hace el bucle
    // clásico (n = n * 10 + c - '0'), pero eso ya lo delegamos.
    var numero = int.Parse(numeros);
    
    // Aunque no es necesario porque con el modulo lo ya esta "implicito"
    // La letra debe ser una letra válida en el conjunto de letras
    // Pero no es necesario con lo de abajo
    //if(!LetrasDni.Contains(letra)) return false;

    // Módulo 23: aquí la regex no llega, es aritmética pura
    var esperada = LetrasDni[numero % 23].ToString();
    return letra == esperada;
}

// ------------------------------------------------------------
// 1. DNI / NIF - VERSIÓN REGEX
// ------------------------------------------------------------

bool IsDniRegex(string dni) {
    var texto = Limpiar(dni);

    // Montamos el patrón con la MISMA tabla que usa la versión manual:
    //   ^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$
    // \d{8} = los 8 dígitos y, entre corchetes, las 23 letras que puede
    // tener un DNI. Si algún día cambia la tabla, cambia el patrón solo.
    var patron = $@"^\d{{8}}[{LetrasDni}]$";
    if (!Regex.IsMatch(texto, patron)) return false;

    // La regex ya nos dice que los 8 primeros son dígitos, así que ni
    // siquiera hace falta comprobarlos: parseamos directamente el trozo.
    var numeros = texto.Substring(0, 8);
    var letra = texto.Substring(8);
    var numero = int.Parse(numeros);

    // El módulo 23 sigue siendo nuestro: la regex no puede con él
    var esperada = LetrasDni[numero % 23].ToString();
    return letra == esperada;
}

// ------------------------------------------------------------
// 2. NIE - VERSIÓN MANUAL
// ------------------------------------------------------------

// Mismo esqueleto que el DNI, con un paso más: la primera posición no
// es un dígito, es X, Y o Z, y además vale 0, 1 o 2.
bool IsNieManual(string nie) {
    var texto = Limpiar(nie);

    // Inicial + 7 números + letra de control = 9
    if (texto.Length != 9) return false;

    // La inicial debe ser X, Y o Z, y nos dice por qué número hay que
    // sustituirla antes de montar el total.
    var inicial = texto[0];
    var prefijo = "";
    if (inicial == 'X') prefijo = "0";
    else if (inicial == 'Y') prefijo = "1";
    else if (inicial == 'Z') prefijo = "2";
    else return false;

    // Extraemos las partes con Substring y las juntamos:
    //   "0" + "1234567" = "01234567"
    var numeros = texto.Substring(1, 7);
    var letra = texto.Substring(8);
    var montado = prefijo + numeros;

    // Comprobamos que las 7 cifras sean dígitos, igual que en el DNI
    foreach (var c in numeros)
        if (c < '0' || c > '9') return false;

    var numero = int.Parse(montado);

    var esperada = LetrasDni[numero % 23].ToString();
    return letra == esperada;
}

// ------------------------------------------------------------
// 2. NIE - VERSIÓN REGEX
// ------------------------------------------------------------

bool IsNieRegex(string nie) {
    var texto = Limpiar(nie);

    // Montamos el patrón igual que en el DNI: las iniciales posibles
    // desde su constante y la letra de control desde la tabla.
    //   ^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$
    var patron = $@"^[{InicialesNie}]\d{{7}}[{LetrasDni}]$";
    if (!Regex.IsMatch(texto, patron)) return false;

    // La regex nos dice QUE la inicial es X, Y o Z, pero no PUEDE
    // convertirla en 0, 1 o 2: eso es aritmética, no formato.
    var inicial = texto[0];
    var prefijo = "";
    if (inicial == 'X') prefijo = "0";
    else if (inicial == 'Y') prefijo = "1";
    else prefijo = "2";

    var numeros = texto.Substring(1, 7);
    var letra = texto.Substring(8);
    var montado = prefijo + numeros;

    var numero = int.Parse(montado);
    var esperada = LetrasDni[numero % 23].ToString();
    return letra == esperada;
}

// ------------------------------------------------------------
// 3. MATRÍCULA - VERSIÓN MANUAL
// ------------------------------------------------------------

// Aquí la regex gana TODO, porque la matrícula es puro formato: no
// hay módulo 23 ni ningún cálculo. La versión manual son dos bucles
// y una comprobación contra la lista de 20 letras.
bool IsMatriculaManual(string matricula) {
    var mayuscula = Limpiar(matricula);

    // NNNNLLL -> 7 caracteres
    if (mayuscula.Length != 7) return false;

    var numeros = mayuscula.Substring(0, 4);
    var letras = mayuscula.Substring(4);

    // Los 4 primeros deben ser números
    foreach (var n in numeros)
        if (n < '0' || n > '9') return false;

    // Las 3 últimas deben estar entre las 20 ADMITIDAS.
    // No basta con que sean letras: la A, la E o la Q no se usan,
    // y aquí es donde la comprobación manual se complica.
    foreach (var l in letras)
        if (LetrasMatricula.IndexOf(l) < 0) return false;

    return true;
}

// ------------------------------------------------------------
// 3. MATRÍCULA - VERSIÓN REGEX
// ------------------------------------------------------------

bool IsMatriculaRegex(string matricula) {
    var mayuscula = Limpiar(matricula);

    // Montamos el patrón con la MISMA lista de 20 letras que comprueba
    // la versión manual:
    //   ^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$
    // \d{4} = las 4 cifras y, entre corchetes y con {3}, tres letras
    // de las admitidas. Si cambian las letras, cambia el patrón solo.
    var patron = $@"^\d{{4}}[{LetrasMatricula}]{{3}}$";
    return Regex.IsMatch(mayuscula, patron);
}

// ------------------------------------------------------------
// 4. TARJETA DE CRÉDITO - VERSIÓN MANUAL
// ------------------------------------------------------------

// Algoritmo de Luhn: el dígito de control de las tarjetas, el primo
// pobre del módulo 23 del DNI. Se recorre de derecha a izquierda,
// duplicando cada segundo dígito; si el resultado pasa de 9 se restan
// 9 (que es lo mismo que sumar sus dos cifras: 16 -> 1+6 = 7).
// Si la suma total es múltiplo de 10, la tarjeta cuadra.
bool IsLuhnValido(string numeros) {
    var suma = 0;
    var doble = false; // empezamos por la derecha, sin duplicar

    for (var i = numeros.Length - 1; i >= 0; i--) {
        var d = numeros[i] - '0';
        if (doble) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        suma += d;
        doble = !doble;
    }

    return suma % 10 == 0;
}

bool IsTarjetaManual(string tarjeta) {
    var texto = Limpiar(tarjeta); // los espacios y guiones no cuentan

    // 16 cifras
    if (texto.Length != 16) return false;

    // Todas deben ser dígitos
    foreach (var c in texto)
        if (c < '0' || c > '9') return false;

    // Prefijo: Visa empieza por 4, Mastercard por 51-55
    var esVisa = texto[0] == '4';
    var esMastercard = texto[0] == '5' && texto[1] >= '1' && texto[1] <= '5';
    if (!esVisa && !esMastercard) return false;

    // Y ahora la aritmética: el Luhn. Otro cálculo que la regex no hace.
    return IsLuhnValido(texto);
}

// ------------------------------------------------------------
// 4. TARJETA DE CRÉDITO - VERSIÓN REGEX
// ------------------------------------------------------------

bool IsTarjetaRegex(string tarjeta) {
    var texto = Limpiar(tarjeta);

    // ^(4\d{15}|5[1-5]\d{14})$
    //   4\d{15}      Visa: un 4 y 15 cifras más = 16
    //   5[1-5]\d{14} Mastercard: un 5, un dígito del 1 al 5 y 14 más = 16
    //   |            o (aquí se ve el operador "o" del tema 6)
    if (!Regex.IsMatch(texto, @"^(4\d{15}|5[1-5]\d{14})$")) return false;

    // El formato lo resuelve el patrón; el dígito de control, Luhn
    return IsLuhnValido(texto);
}

// ------------------------------------------------------------
// 5. FECHA - VERSIÓN MANUAL
// ------------------------------------------------------------

// dd-mm-yyyy o dd/mm/yyyy. Ojo: aquí NO vale Limpiar, porque el guion
// y la barra son precisamente el separador que queremos conservar.
bool IsFechaManual(string fecha) {
    // Quitamos solo los espacios y unificamos el separador en guion,
    // así el Split de después trocea igual con guion que con barra.
    var texto = fecha.Trim().Replace('/', '-');

    // 10 caracteres: 2 + 1 + 2 + 1 + 4
    if (texto.Length != 10) return false;

    var partes = texto.Split('-');
    if (partes.Length != 3) return false;

    // Que todo sean dígitos antes de tocar int.Parse
    foreach (var parte in partes)
        foreach (var c in parte)
            if (c < '0' || c > '9') return false;

    // Día: 2 cifras y entre 1 y 31
    if (partes[0].Length != 2) return false;
    var dia = int.Parse(partes[0]);
    if (dia < 1 || dia > 31) return false;

    // Mes: 2 cifras y entre 1 y 12
    if (partes[1].Length != 2) return false;
    var mes = int.Parse(partes[1]);
    if (mes < 1 || mes > 12) return false;

    // Año: 4 cifras y en un rango razonable
    if (partes[2].Length != 4) return false;
    var anio = int.Parse(partes[2]);
    if (anio < 1900 || anio > 2100) return false;

    return true;
}

// ------------------------------------------------------------
// 5. FECHA - VERSIÓN REGEX
// ------------------------------------------------------------

// Mismo caso que en 13-EntradasStrings, pero aquí el patrón admite
// guion O barra y usa grupos con nombre para quedarse con cada trozo.
bool IsFechaRegex(string fecha) {
    var texto = fecha.Trim();

    // ^(?<dia>\d{2})[-/](?<mes>\d{2})[-/](?<anio>\d{4})$
    //   (?<dia>...)  grupo de captura con nombre: cada paréntesis
    //                guarda una parte y se lee con Groups["dia"]
    //   [-/]         una posición que puede ser guion o barra
    var match = Regex.Match(texto, @"^(?<dia>\d{2})[-/](?<mes>\d{2})[-/](?<anio>\d{4})$");
    if (!match.Success) return false;

    // La regex ya garantiza el formato y los dígitos: parseamos sin miedo
    var dia = int.Parse(match.Groups["dia"].Value);
    var mes = int.Parse(match.Groups["mes"].Value);
    var anio = int.Parse(match.Groups["anio"].Value);

    // Pero los rangos los comprobamos nosotros: la regex no sabe que
    // un mes no puede ser 13
    if (dia < 1 || dia > 31) return false;
    if (mes < 1 || mes > 12) return false;
    if (anio < 1900 || anio > 2100) return false;

    return true;
}

// ------------------------------------------------------------
// IMPRESIÓN DE LA BATERÍA
// ------------------------------------------------------------

// Cabecera de las tres tablas, con las columnas alineadas.
void ImprimirCabecera() {
    var entrada = "Entrada";
    var esperado = "Esperado";
    var manual = "Manual";
    WriteLine($"   {entrada,-15} {esperado,-9} {manual,-9} Regex");
}

// Pinta una fila: lo que esperábamos y lo que dicen los dos
// validadores. Si alguno se aparta de lo esperado, se marca con ⚠️.
void ProbarCaso(string entrada, bool esperado, bool manual, bool regex) {
    var e = esperado ? "válido" : "inválido";
    var m = manual ? "válido" : "inválido";
    var r = regex ? "válido" : "inválido";

    // Si el validador se equivoca, se avisa en lugar de fallar en silencio
    if (manual != esperado) m = "⚠️ " + m;
    if (regex != esperado) r = "⚠️ " + r;

    WriteLine($"   {entrada,-15} {e,-9} {m,-12} {r}");
}

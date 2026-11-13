# 21. Nulos

## Enunciado

Demuestra los tipos nullable y las diferentes técnicas de manejo de valores `null` en C#. Se crea un array de `Estudiante?[]` (estudiantes que pueden ser nulos) y se recorre mostrando distintas formas de comprobar y acceder a los datos de cada elemento. El programa ilustra las 6 formas principales de trabajar con nulos en C# de forma práctica y comparativa.

## Conceptos Clave

- **Nullable value types (`?`)**: Types que pueden contener un valor o `null` (ej: `int?`, `double?`, `bool?`).
- **Array `Estudiante?[]`**: Arreglo donde cada elemento puede ser `null` (el tipo permite nulabilidad).
- **`!= null`**: Comprobación clásica explícita de nulidad.
- **`HasValue`**: Propiedad de los tipos nullable que indica si tienen valor asignado.
- **`.Value`**: Acceso directo al valor; lanza `InvalidOperationException` si es `null`.
- **Null-forgiving `!`**: Operador que avisa al compilador que se asume que el valor no es null (sin verificación en runtime).
- **Pattern matching (`is Estudiante`, `is { } est`)**: Uso de patrones para comprobar tipo y extraer valor en una sola expresión.
- **Null-conditional `?.`**: Acceso seguro a miembros; si el objeto es `null`, toda la expresión devuelve `null`.
- **Null-coalescing `??`**: Proporciona un valor por defecto cuando la expresión es `null`.

## Solución

1. Definir un record `Estudiante` con propiedades (Nombre, Nota, etc.).
2. Crear array `Estudiante?[]` donde algunos elementos son `null` y otros son objetos `Estudiante`.
3. Recorrer el array y para cada elemento, mostrar las 6 técnicas de comprobación:
   - **`!= null`**: `if (est != null) { ... }`
   - **`HasValue`**: `if (est.HasValue) { ... }`
   - **`.Value`**: `var nombre = est.Value.Nombre;` (con comprobación previa)
   - **Pattern matching `is`**: `if (est is Estudiante e) { ... }`
   - **Pattern matching `is { }`**: `if (est is { } e) { ... }`
   - **`?.` y `??`**: `string nombre = est?.Nombre ?? "Sin nombre";`
4. Mostrar resultados de cada técnica para comparar comportamiento y sintaxis.

### Tabla comparativa de técnicas

| Técnica | Sintaxis | Seguridad | Legibilidad |
|---------|----------|-----------|-------------|
| `!= null` | `if (est != null)` | ✅ Segura | ✅ Alta |
| `HasValue` | `if (est.HasValue)` | ✅ Segura | ✅ Alta |
| `.Value` | `est.Value.Nombre` | ⚠️ Riesgo si null | ❌ Baja |
| `is Estudiante e` | `if (est is Estudiante e)` | ✅ Segura | ✅ Alta |
| `is { } e` | `if (est is { } e)` | ✅ Segura | ✅ Alta |
| `?. ??` | `est?.Nombre ?? "?"` | ✅ Segura | ✅ Alta |

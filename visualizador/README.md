# Visualizador de algoritmos

> 💡 **Punto de partida:** ¿y si pudieras ver el algoritmo "pensar" línea a línea, mientras las barras se mueven?

Web para visualizar en animación los **7 algoritmos de ordenación y búsqueda**, con el código C# del tema resaltado paso a paso y su diagrama de flujo sincronizado.

**Objetivos de aprendizaje:**

- Ver qué hace cada línea de código mientras se ejecuta
- Comparar la complejidad real de los algoritmos en vivo
- Practicar prediciendo el siguiente paso (modo reto)

## 1. Cómo abrirlo

Hay **cuatro opciones** dentro de esta carpeta; elige la que más te guste y abre su `index.html` con doble clic. No hace falta instalar nada ni compilar.

| Carpeta | Maqueta | Distribución |
|---------|---------|--------------|
| `visualizador/` | **Original** | Código · escena · lateral (variables, contadores, complejidad) |
| `visualizador-a/` | **A — Lateral vivo** | Como la original, pero con leyenda, **historial de pasos** y atajos en el lateral; en Comparar empieza sin diagrama |
| `visualizador-b/` | **B — Barra de estado** | Sin lateral: variables y contadores en una barra bajo las barras y la complejidad en el pie del código |
| `visualizador-c/` | **C — Estilo editor** | Código más ancho y barra inferior a todo el ancho con variables, contadores y complejidad |

> 📝 **Nota:** las librerías van **dentro de cada carpeta** (`js/vendor/`), así que cualquier maqueta funciona con doble clic y **sin internet**. Solo las fuentes (Ubuntu) se cargan de Google Fonts; si no hay red, se usa la tipografía del sistema. Si se borra `js/vendor/`, entra el CDN como red de seguridad.

También se puede servir con cualquier servidor estático (desde dentro de la carpeta elegida):

```bash
npx serve .
```

## 2. Qué incluye

| Pieza | Qué hace |
|-------|----------|
| **Código C#** | El mismo del tema, con la línea que se ejecuta iluminada |
| **Barras del array** | Se comparan, intercambian y fijan con colores y animación |
| **Diagrama de flujo** | Mermaid con zoom (`−` / `+` / `Ajustar` para verlo entero); el nodo activo se enciende y el diagrama lo sigue solo |
| **Variables y contadores** | `i`, `j`, `minIdx`, `pivote`... más comparaciones e intercambios en vivo |
| **Complejidad** | Tabla del tema junto a cada algoritmo |

### Modos de uso

- **🎬 Práctica:** un algoritmo, paso a paso o en automático.
- **⚔️ Comparar:** dos algoritmos con el mismo array; al terminar aparece el duelo con las comparaciones de cada uno.
- **🧠 Reto:** cada N pasos se para y pregunta «¿qué línea se ejecuta ahora?» con cuatro opciones.

### Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `Espacio` | Play / pausa |
| `→` | Avanzar un paso |
| `R` | Reiniciar |
| `F` | Ejecutar hasta el final |
| `1` a `4` | Responder en el modo reto |

## 3. Estructura

```
visualizador/
├── README.md                # Este fichero
├── visualizador/            # Maqueta original
│   ├── index.html           # Se abre con doble clic
│   ├── favicon.svg
│   ├── css/estilos.css      # Tema claro y oscuro (tokens de joseluisgs.dev)
│   └── js/
│       ├── algoritmos.js    # Los 7 algoritmos: código, trazas y diagrama
│       ├── motor.js         # Reproductor de pasos (play, pausa, salto)
│       ├── ui.js            # Dibujo: código, barras y diagrama
│       ├── quiz.js          # Modo reto
│       ├── main.js          # Cableado general y modos
│       └── vendor/          # Mermaid y highlight.js locales (sin internet)
├── visualizador-a/          # Maqueta A (misma estructura)
├── visualizador-b/          # Maqueta B (misma estructura)
└── visualizador-c/          # Maqueta C (misma estructura)
```

Cada maqueta es **independiente**: puedes borrar las que no elijas sin tocar la ganadora.

> 💡 **Consejo:** el truco está en que los algoritmos **no dibujan nada**; solo emiten trazas (`paso(8, 'cmp', {...})`) y la web las reproduce. Para añadir un algoritmo nuevo basta con copiar el patrón de `algoritmos.js`.

## 4. Personalización

- **Colores y tema:** variables `--vp-c-*` en `css/estilos.css` (claro y oscuro).
- **Diagrama:** el campo `flujo` de cada algoritmo; los nodos se llaman `L<número de línea>` para enlazar con el código.
- **Preguntas del reto:** frecuencia en el propio modal (cada 3, 5, 8 o 12 pasos).

📌 Ejemplo real: en clase funciona con el proyector; en casa, el alumnado puede usarlo desde el móvil con el mismo enlace.

---

Hecho por J.L. González para 1DAW · Programación · I.E.S. Luis Vives (Leganés).

# Plan de trabajo del codigo FACEA

## Objetivo general

Dejar el proyecto con esta separacion clara:

- La UI de componentes y pages solo renderiza y coordina vistas.
- El moqueo vive dentro de los servicios.
- El cambio a un servicio real despues sea minimo.
- La seccion de noticias pueda pasar de solo mostrar a tambien crear, editar y eliminar.

## Etapa 1: lectura y mapa mental del proyecto

### Que hay que entender

- Como entra la app por `App.tsx`.
- Como se arma la landing con `NavBar`, `Home`, `HeroBanner`, `AboutUs` y `News`.
- Como funciona el scroll por anclas y el resaltado de seccion activa.
- Como esta armado el carrusel de noticias visualmente.
- Que archivos son demo, prueba o codigo que no participa del flujo real.

### Resultado esperado

- Tener un mapa simple de responsabilidades.
- Saber que archivo toca UI, que archivo toca comportamiento y que archivo toca datos.

### Pregunta para vos

- Querés que esta etapa la hagamos con una lectura archivo por archivo o preferís un resumen de alto nivel antes de bajar al detalle?

## Etapa 2: limpiar el codigo visual

### Que hay que revisar

- `components/home/News.tsx` para ver qué lógica le sobra.
- `pages/home/HomePage.tsx` y `pages/home/HomePage.css` para definir si son demo o parte real del proyecto.
- `components/ui/PostCard.tsx` para dejarlo como componente puro de presentacion.
- `components/layout/NavBar.tsx` para mantenerlo solo como coordinador de navegación.

### Resultado esperado

- Que la UI no tenga datos hardcodeados si esos datos pertenecen al dominio de news.
- Que cada componente tenga una sola responsabilidad.

### Pregunta para vos

- Querés que primero eliminemos código sobrante y duplicado, o preferís primero conectar toda la UI al flujo correcto y recién después limpiar?

## Etapa 3: mover el moqueo a servicios

### Que hay que lograr

- Que `newsService` tenga la base mock de datos.
- Que el hook `useNews` sea la única puerta de entrada desde la UI.
- Que `News.tsx` consuma `posts`, `isLoading`, `createPost` y `deletePost` desde el hook.
- Que el servicio sea reemplazable luego por una API real sin reescribir la UI.

### Resultado esperado

- Fuente de datos unica.
- UI desacoplada del almacenamiento.
- Cambio futuro a backend real mucho mas simple.

### Pregunta para vos

- Querés que el mock siga siendo en memoria dentro del servicio, o preferís que simule una API más realista con capa de acceso separada?

## Etapa 4: preparar el admin de noticias

### Complejidad estimada

- Si solo usamos el servicio mock actual y el mismo modelo de datos, la complejidad es media.
- Si sumamos formulario de alta, edición, borrado, validación y vista de listado, la complejidad sube a media-alta.
- Si además querés dejar listo el cambio a backend real, conviene agregar una capa de abstracción más limpia.

### Qué conviene construir

- Una página o panel de administración.
- Un formulario para crear y editar noticias.
- Una lista de noticias con acciones de editar y borrar.
- Una estrategia de estado clara: local, hook, servicio.

### Resultado esperado

- Poder administrar noticias desde una interfaz propia.
- Reusar el mismo modelo que ya consume la sección pública.

### Pregunta para vos

- Querés una pantalla nueva de admin o preferís reutilizar el mismo bloque visual de News y convertirlo en una vista editable?

## Etapa 5: dejar el proyecto listo para servicio real

### Que hay que preparar

- Separar contrato de datos del detalle de implementación.
- Mantener tipos compartidos para noticias.
- Evitar que la vista dependa de la forma interna del mock.
- Tener un punto unico donde cambiar el origen de datos.

### Resultado esperado

- Reemplazar el mock por una API real con el menor impacto posible.

### Pregunta para vos

- Querés que dejemos esa transición preparada desde ya, o la hacemos solo cuando aparezca el backend real?

## Orden recomendado de trabajo

1. Confirmar el mapa del proyecto.
2. Limpiar la UI y quitar duplicados.
3. Conectar News con el servicio mock.
4. Crear el admin de noticias.
5. Preparar la futura migración a backend real.

## Recomendacion practica

Lo mas razonable ahora es primero arreglar el moqueo actual y despues construir la ventana de edicion de noticias.

Eso te deja el proyecto estable antes de sumar CRUD.

## Sugerencia de bloques de lectura

- Bloque 1: `App`, `NavBar`, `useActiveSection`.
- Bloque 2: `Home`, `HeroBanner`, `AboutUs`, `News`.
- Bloque 3: `useNews` y `newsService`.
- Bloque 4: `PostCard`, `Button`, `Card`, `Container`.
- Bloque 5: panel de admin y formulario de noticias.

## Nota sobre la complejidad de noticias

La parte mas delicada no es mostrar noticias, sino mantener una sola fuente de verdad cuando agregues editar y borrar.

Si el flujo publico y el panel admin comparten el mismo hook y el mismo servicio, el sistema va a quedar mas limpio y mas facil de migrar luego.

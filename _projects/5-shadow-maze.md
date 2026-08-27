---
layout: project
title: Shadow Maze
technologies: [Unity 6, C#, Algoritmia, BFS, Dijkstra, Android, iOS]
thumbnail: shadow-maze/shadow-maze.png
image: shadow-maze/shadow-maze.png
scripts:
  - /assets/js/demo-laberinto.js
---

Después de unos cuantos años dedicado al backend, a la nube y a los microservicios, tenía muchísimas ganas de volver a lo que estudié en el máster: los videojuegos. Y de ahí ha salido **Shadow Maze**, un juego de móvil hecho con **Unity 6**.

La idea es sencilla de contar: recorres un laberinto a oscuras con una linterna que se está apagando. La luz es un recurso que se acaba, baja sola segundo a segundo, las velas te la recargan y si llegas a cero el nivel vuelve a empezar. Son 68 niveles repartidos en seis mundos y cada mundo estrena una regla nueva: puertas que hay que cargar, placas que mantienen la meta cerrada, suelo que se rompe al pisarlo y, a partir del cuarto, algo que te persigue en la oscuridad.

Pensarás que lo interesante de un juego así está en el apartado gráfico. Y algo de gracia tiene, porque en el proyecto no hay ni un solo dibujo importado: todo lo que ves son luces, siluetas y post-proceso generados por código. Pero lo que quiero contarte aquí es otra cosa muy distinta. **Los niveles tampoco están hechos a mano.** Un algoritmo genera los laberintos, otro los puntúa y sólo se publican los que caen en la dificultad que toca.

Es decir, que elegir niveles dejó de ser trabajo de diseño y pasó a ser trabajo de backend. Y ahí es donde me lo he pasado bien de verdad.

<ul class="cifras">
	<li><span class="cifra__valor">68</span><span class="cifra__etiqueta">niveles en 6 mundos</span></li>
	<li><span class="cifra__valor">6,8 M</span><span class="cifra__etiqueta">estados por evaluación</span></li>
	<li><span class="cifra__valor">500</span><span class="cifra__etiqueta">laberintos por tirada</span></li>
	<li><span class="cifra__valor">0</span><span class="cifra__etiqueta">sprites importados</span></li>
</ul>
<div class="prueba">
	<span class="eyebrow">// Prueba interna</span>
	<h2>Puedes jugarlo antes de que salga</h2>
	<p>Shadow Maze está en <strong>prueba interna en Google Play</strong>, así que se puede instalar ya. Son dos pasos: primero te apuntas como tester con tu cuenta de Google y, con eso hecho, la ficha de Play te deja descargarlo.</p>
	<div class="prueba__acciones">
		<a class="btn btn--primary" href="https://play.google.com/apps/testing/com.javiercanadilla.shadowmaze" target="_blank">Apuntarme como tester</a>
		<a class="btn btn--ghost" href="https://play.google.com/store/apps/details?id=com.javiercanadilla.shadowmaze" target="_blank">Abrir la ficha en Google Play</a>
	</div>
	<p class="prueba__nota">Hace falta Android y usar la misma cuenta de Google en el enlace y en el móvil. Si la ficha dice que la app no está disponible, es que falta apuntarse o que Play todavía no ha refrescado; suele tardar unos minutos.</p>
</div>

## Lo primero, el laberinto: backtracking con la pila a la vista

Empecemos por el principio. La rejilla arranca siendo todo pared y se va excavando. Las celdas van en las coordenadas impares y los muros en las pares. Y el excavador es el *recursive backtracking* de toda la vida: desde la celda en la que estás miras las cuatro vecinas que hay a dos de distancia, te quedas con las que siguen siendo pared, eliges una al azar, tiras el muro de en medio y avanzas. Cuando ya no queda ninguna, retrocedes. Y ya está.

Eso sí, con un detalle importante: **la pila es explícita**. La versión recursiva de siempre se quedaba sin pila de llamadas en cuanto el laberinto crecía un poco, así que el recorrido va sobre un `Stack<Vector2Int>`. Es exactamente el mismo algoritmo, pero con el bucle a la vista.

```csharp

// Mientras queden celdas pendientes en la pila...
while (pila.Count > 0)
{
    // Miramos en qué celda estamos, pero sin sacarla todavía de la pila
    Vector2Int actual = pila.Peek();

    // candidatas = las vecinas a dos celdas de distancia que sigan siendo pared
    ...

    // ¿No queda ninguna? Entonces esto es un fondo de saco: retrocedemos
    if (candidatas.Count == 0) { pila.Pop(); continue; }

    // Elegimos una vecina al azar y calculamos el muro que hay en medio
    Vector2Int direccion  = candidatas[rand.Next(candidatas.Count)];
    Vector2Int intermedia = actual + direccion;
    Vector2Int siguiente  = actual + direccion * 2;

    // Tiramos el muro, excavamos la celda nueva y avanzamos hasta ella
    esPared[intermedia.x, intermedia.y] = false;
    esPared[siguiente.x, siguiente.y]   = false;
    pila.Push(siguiente);
}

```

<div class="demo js-demo-laberinto">
	<div class="demo__cabecera">
		<span class="eyebrow">// Demo</span>
		<h3 class="demo__titulo">El excavador, en marcha</h3>
		<p class="demo__intro">Aquí lo tienes: es ese mismo bucle, funcionando. En <strong>ámbar</strong>, la celda en la que está el excavador; en <strong>violeta</strong>, el camino que la pila guarda para poder volver, y a la izquierda esa misma pila de canto, una pieza por celda. Cuando la celda ámbar se queda sin vecinas de pared, la pila suelta una pieza y el excavador reaparece más atrás. Eso es retroceder, y verlo así se entiende mucho mejor que leerlo.</p>
	</div>

	<div class="demo__escena">
		<div class="demo__pila">
			<span class="demo__rotulo">pila</span>
			<div class="demo__columna js-pila"></div>
		</div>
		<div class="demo__lienzo">
			<svg class="js-lienzo" viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg" role="img"
				aria-label="Rejilla del laberinto excavándose paso a paso: la celda actual en ámbar y el camino guardado en la pila en violeta."></svg>
		</div>
	</div>

	<ul class="demo__datos">
		<li><span class="demo__valor js-profundidad">1</span><span class="demo__etiqueta">celdas en la pila</span></li>
		<li><span class="demo__valor js-excavadas">1</span><span class="demo__etiqueta">celdas excavadas</span></li>
		<li><span class="demo__valor js-retrocesos">0</span><span class="demo__etiqueta">retrocesos</span></li>
	</ul>

	<p class="demo__traza js-traza" aria-hidden="true">peek (1, 1)</p>
	<p class="visually-hidden js-anuncio" role="status"></p>

	<div class="demo__mandos">
		<button type="button" class="btn btn--primary btn--small js-jugar" aria-pressed="false">Excavar</button>
		<button type="button" class="btn btn--ghost btn--small js-paso">Un paso</button>
		<button type="button" class="btn btn--ghost btn--small js-otra">Otra semilla</button>
		<label class="demo__velocidad">velocidad
			<input class="js-velocidad" type="range" min="1" max="5" step="1" value="3" aria-label="Velocidad de la demo">
		</label>
	</div>

	<p class="demo__pie">Semilla <code class="js-semilla">0</code>. La misma semilla da siempre el mismo laberinto: al terminar, <em>Repetir</em> lo vuelve a excavar igual y <em>Otra semilla</em> saca uno nuevo.</p>
</div>

### Vale, ya tengo un laberinto. ¿Dónde está el problema?

Lo que sale de ahí es un **laberinto perfecto**: entre dos celdas cualesquiera hay exactamente un camino y no hay ni un solo bucle. Suena bien, ¿verdad? Pues es justo el problema.

Un laberinto perfecto se resuelve pegando la mano a la pared derecha y andando. No hay absolutamente nada que decidir: es un pasillo larguísimo disfrazado de laberinto.

La solución se llama **trenzado** (*braiding*) y es más sencilla de lo que parece. Con el laberinto ya excavado se buscan los fondos de saco, que son las celdas con una única salida, y a unos cuantos se les tira otra pared. Cada pared que cae abre un bucle, y cada bucle es un camino alternativo que el jugador tiene que elegir. Cuántos fondos se abren es un parámetro: con 0 el laberinto se queda perfecto y con 1 se convierte en una malla.

### Y la meta, ¿dónde la pongo?

Tampoco a ojo. **Un BFS desde la salida mide la distancia hasta todas las celdas y la meta se coloca en la más lejana de todas.**

Por si el nombre te suena a más de lo que es, un **BFS** (*breadth-first search*, o recorrido en anchura) es de los algoritmos más sencillos que existen. Metes la celda de salida en una cola. Vas sacando celdas de una en una y, a cada vecina de suelo que no hayas visitado todavía, le apuntas la distancia de la celda actual más uno y la metes al final de la cola. El laberinto se va inundando en anillos desde el origen. ¿Sencillo no?

Como todos los pasos valen lo mismo, **la primera vez que llegas a una celda es por el camino más corto**. Con una sola pasada tienes la distancia a todas las celdas: la mayor es la meta, y ese mismo campo de distancias te sirve después para reconstruir cualquier ruta, bajando de número en número.

> ¡OJO! Los empates hay que resolverlos siempre en el mismo orden de barrido. Si no, una misma semilla no daría siempre el mismo laberinto, y eso es importante: el reparto de velas y de puertas se apoya en la ruta y tiene que salir igual cada vez.

<div class="figura">
	<div class="figura__lienzo">
		<svg viewBox="0 0 506 255" xmlns="http://www.w3.org/2000/svg" role="img"
				aria-label="El mismo laberinto antes y despues del trenzado. A la izquierda, recien excavado: perfecto, sin un solo bucle. A la derecha, el mismo con 6 paredes derribadas en fondos de saco, marcadas en color, y la meta que el BFS coloca en la celda mas lejana del inicio.">
			<rect class="fig-muro" x="0" y="0" width="231" height="11"/><rect class="fig-muro" x="0" y="11" width="11" height="11"/><rect class="fig-muro" x="44" y="11" width="11" height="11"/><rect class="fig-muro" x="220" y="11" width="11" height="11"/><rect class="fig-muro" x="0" y="22" width="33" height="11"/><rect class="fig-muro" x="44" y="22" width="77" height="11"/><rect class="fig-muro" x="132" y="22" width="33" height="11"/><rect class="fig-muro" x="176" y="22" width="55" height="11"/><rect class="fig-muro" x="0" y="33" width="11" height="11"/><rect class="fig-muro" x="44" y="33" width="11" height="11"/><rect class="fig-muro" x="110" y="33" width="11" height="11"/><rect class="fig-muro" x="154" y="33" width="11" height="11"/><rect class="fig-muro" x="176" y="33" width="11" height="11"/><rect class="fig-muro" x="220" y="33" width="11" height="11"/><rect class="fig-muro" x="0" y="44" width="11" height="11"/><rect class="fig-muro" x="22" y="44" width="33" height="11"/><rect class="fig-muro" x="66" y="44" width="33" height="11"/><rect class="fig-muro" x="110" y="44" width="33" height="11"/><rect class="fig-muro" x="154" y="44" width="11" height="11"/><rect class="fig-muro" x="176" y="44" width="11" height="11"/><rect class="fig-muro" x="198" y="44" width="11" height="11"/><rect class="fig-muro" x="220" y="44" width="11" height="11"/><rect class="fig-muro" x="0" y="55" width="11" height="11"/><rect class="fig-muro" x="22" y="55" width="11" height="11"/><rect class="fig-muro" x="66" y="55" width="11" height="11"/><rect class="fig-muro" x="110" y="55" width="11" height="11"/><rect class="fig-muro" x="132" y="55" width="11" height="11"/><rect class="fig-muro" x="154" y="55" width="11" height="11"/><rect class="fig-muro" x="176" y="55" width="11" height="11"/><rect class="fig-muro" x="198" y="55" width="11" height="11"/><rect class="fig-muro" x="220" y="55" width="11" height="11"/><rect class="fig-muro" x="0" y="66" width="11" height="11"/><rect class="fig-muro" x="22" y="66" width="33" height="11"/><rect class="fig-muro" x="66" y="66" width="11" height="11"/><rect class="fig-muro" x="88" y="66" width="33" height="11"/><rect class="fig-muro" x="132" y="66" width="11" height="11"/><rect class="fig-muro" x="154" y="66" width="11" height="11"/><rect class="fig-muro" x="176" y="66" width="11" height="11"/><rect class="fig-muro" x="198" y="66" width="11" height="11"/><rect class="fig-muro" x="220" y="66" width="11" height="11"/><rect class="fig-muro" x="0" y="77" width="11" height="11"/><rect class="fig-muro" x="22" y="77" width="11" height="11"/><rect class="fig-muro" x="66" y="77" width="11" height="11"/><rect class="fig-muro" x="88" y="77" width="11" height="11"/><rect class="fig-muro" x="154" y="77" width="11" height="11"/><rect class="fig-muro" x="198" y="77" width="11" height="11"/><rect class="fig-muro" x="220" y="77" width="11" height="11"/><rect class="fig-muro" x="0" y="88" width="11" height="11"/><rect class="fig-muro" x="22" y="88" width="11" height="11"/><rect class="fig-muro" x="44" y="88" width="33" height="11"/><rect class="fig-muro" x="88" y="88" width="11" height="11"/><rect class="fig-muro" x="110" y="88" width="99" height="11"/><rect class="fig-muro" x="220" y="88" width="11" height="11"/><rect class="fig-muro" x="0" y="99" width="11" height="11"/><rect class="fig-muro" x="44" y="99" width="11" height="11"/><rect class="fig-muro" x="88" y="99" width="11" height="11"/><rect class="fig-muro" x="110" y="99" width="11" height="11"/><rect class="fig-muro" x="220" y="99" width="11" height="11"/><rect class="fig-muro" x="0" y="110" width="55" height="11"/><rect class="fig-muro" x="66" y="110" width="55" height="11"/><rect class="fig-muro" x="132" y="110" width="77" height="11"/><rect class="fig-muro" x="220" y="110" width="11" height="11"/><rect class="fig-muro" x="0" y="121" width="11" height="11"/><rect class="fig-muro" x="44" y="121" width="11" height="11"/><rect class="fig-muro" x="110" y="121" width="11" height="11"/><rect class="fig-muro" x="154" y="121" width="11" height="11"/><rect class="fig-muro" x="220" y="121" width="11" height="11"/><rect class="fig-muro" x="0" y="132" width="11" height="11"/><rect class="fig-muro" x="22" y="132" width="77" height="11"/><rect class="fig-muro" x="110" y="132" width="33" height="11"/><rect class="fig-muro" x="154" y="132" width="11" height="11"/><rect class="fig-muro" x="176" y="132" width="55" height="11"/><rect class="fig-muro" x="0" y="143" width="11" height="11"/><rect class="fig-muro" x="88" y="143" width="11" height="11"/><rect class="fig-muro" x="154" y="143" width="11" height="11"/><rect class="fig-muro" x="220" y="143" width="11" height="11"/><rect class="fig-muro" x="0" y="154" width="11" height="11"/><rect class="fig-muro" x="22" y="154" width="55" height="11"/><rect class="fig-muro" x="88" y="154" width="121" height="11"/><rect class="fig-muro" x="220" y="154" width="11" height="11"/><rect class="fig-muro" x="0" y="165" width="11" height="11"/><rect class="fig-muro" x="44" y="165" width="11" height="11"/><rect class="fig-muro" x="66" y="165" width="11" height="11"/><rect class="fig-muro" x="110" y="165" width="11" height="11"/><rect class="fig-muro" x="176" y="165" width="11" height="11"/><rect class="fig-muro" x="220" y="165" width="11" height="11"/><rect class="fig-muro" x="0" y="176" width="33" height="11"/><rect class="fig-muro" x="44" y="176" width="11" height="11"/><rect class="fig-muro" x="66" y="176" width="11" height="11"/><rect class="fig-muro" x="88" y="176" width="33" height="11"/><rect class="fig-muro" x="132" y="176" width="33" height="11"/><rect class="fig-muro" x="176" y="176" width="11" height="11"/><rect class="fig-muro" x="198" y="176" width="33" height="11"/><rect class="fig-muro" x="0" y="187" width="11" height="11"/><rect class="fig-muro" x="22" y="187" width="11" height="11"/><rect class="fig-muro" x="44" y="187" width="11" height="11"/><rect class="fig-muro" x="66" y="187" width="11" height="11"/><rect class="fig-muro" x="110" y="187" width="11" height="11"/><rect class="fig-muro" x="132" y="187" width="11" height="11"/><rect class="fig-muro" x="154" y="187" width="11" height="11"/><rect class="fig-muro" x="176" y="187" width="11" height="11"/><rect class="fig-muro" x="198" y="187" width="11" height="11"/><rect class="fig-muro" x="220" y="187" width="11" height="11"/><rect class="fig-muro" x="0" y="198" width="11" height="11"/><rect class="fig-muro" x="22" y="198" width="11" height="11"/><rect class="fig-muro" x="44" y="198" width="11" height="11"/><rect class="fig-muro" x="66" y="198" width="33" height="11"/><rect class="fig-muro" x="110" y="198" width="11" height="11"/><rect class="fig-muro" x="132" y="198" width="11" height="11"/><rect class="fig-muro" x="154" y="198" width="11" height="11"/><rect class="fig-muro" x="176" y="198" width="11" height="11"/><rect class="fig-muro" x="198" y="198" width="11" height="11"/><rect class="fig-muro" x="220" y="198" width="11" height="11"/><rect class="fig-muro" x="0" y="209" width="11" height="11"/><rect class="fig-muro" x="88" y="209" width="11" height="11"/><rect class="fig-muro" x="154" y="209" width="11" height="11"/><rect class="fig-muro" x="220" y="209" width="11" height="11"/><rect class="fig-muro" x="0" y="220" width="231" height="11"/><circle class="fig-spawn" cx="16.5" cy="16.5" r="3.6"/>
			<rect class="fig-muro" x="275" y="0" width="231" height="11"/><rect class="fig-muro" x="275" y="11" width="11" height="11"/><rect class="fig-muro" x="319" y="11" width="11" height="11"/><rect class="fig-muro" x="495" y="11" width="11" height="11"/><rect class="fig-muro" x="275" y="22" width="33" height="11"/><rect class="fig-muro" x="319" y="22" width="11" height="11"/><rect class="fig-muro" x="341" y="22" width="55" height="11"/><rect class="fig-muro" x="407" y="22" width="33" height="11"/><rect class="fig-muro" x="451" y="22" width="55" height="11"/><rect class="fig-muro" x="275" y="33" width="11" height="11"/><rect class="fig-muro" x="319" y="33" width="11" height="11"/><rect class="fig-muro" x="385" y="33" width="11" height="11"/><rect class="fig-muro" x="429" y="33" width="11" height="11"/><rect class="fig-muro" x="451" y="33" width="11" height="11"/><rect class="fig-muro" x="495" y="33" width="11" height="11"/><rect class="fig-muro" x="275" y="44" width="11" height="11"/><rect class="fig-muro" x="297" y="44" width="33" height="11"/><rect class="fig-muro" x="341" y="44" width="33" height="11"/><rect class="fig-muro" x="385" y="44" width="11" height="11"/><rect class="fig-muro" x="407" y="44" width="11" height="11"/><rect class="fig-muro" x="429" y="44" width="11" height="11"/><rect class="fig-muro" x="451" y="44" width="11" height="11"/><rect class="fig-muro" x="473" y="44" width="11" height="11"/><rect class="fig-muro" x="495" y="44" width="11" height="11"/><rect class="fig-muro" x="275" y="55" width="11" height="11"/><rect class="fig-muro" x="297" y="55" width="11" height="11"/><rect class="fig-muro" x="341" y="55" width="11" height="11"/><rect class="fig-muro" x="385" y="55" width="11" height="11"/><rect class="fig-muro" x="407" y="55" width="11" height="11"/><rect class="fig-muro" x="429" y="55" width="11" height="11"/><rect class="fig-muro" x="451" y="55" width="11" height="11"/><rect class="fig-muro" x="473" y="55" width="11" height="11"/><rect class="fig-muro" x="495" y="55" width="11" height="11"/><rect class="fig-muro" x="275" y="66" width="11" height="11"/><rect class="fig-muro" x="297" y="66" width="33" height="11"/><rect class="fig-muro" x="341" y="66" width="11" height="11"/><rect class="fig-muro" x="363" y="66" width="33" height="11"/><rect class="fig-muro" x="407" y="66" width="11" height="11"/><rect class="fig-muro" x="429" y="66" width="11" height="11"/><rect class="fig-muro" x="451" y="66" width="11" height="11"/><rect class="fig-muro" x="473" y="66" width="11" height="11"/><rect class="fig-muro" x="495" y="66" width="11" height="11"/><rect class="fig-muro" x="275" y="77" width="11" height="11"/><rect class="fig-muro" x="297" y="77" width="11" height="11"/><rect class="fig-muro" x="341" y="77" width="11" height="11"/><rect class="fig-muro" x="363" y="77" width="11" height="11"/><rect class="fig-muro" x="429" y="77" width="11" height="11"/><rect class="fig-muro" x="473" y="77" width="11" height="11"/><rect class="fig-muro" x="495" y="77" width="11" height="11"/><rect class="fig-muro" x="275" y="88" width="11" height="11"/><rect class="fig-muro" x="297" y="88" width="11" height="11"/><rect class="fig-muro" x="319" y="88" width="33" height="11"/><rect class="fig-muro" x="363" y="88" width="11" height="11"/><rect class="fig-muro" x="385" y="88" width="99" height="11"/><rect class="fig-muro" x="495" y="88" width="11" height="11"/><rect class="fig-muro" x="275" y="99" width="11" height="11"/><rect class="fig-muro" x="319" y="99" width="11" height="11"/><rect class="fig-muro" x="363" y="99" width="11" height="11"/><rect class="fig-muro" x="385" y="99" width="11" height="11"/><rect class="fig-muro" x="495" y="99" width="11" height="11"/><rect class="fig-muro" x="275" y="110" width="55" height="11"/><rect class="fig-muro" x="341" y="110" width="55" height="11"/><rect class="fig-muro" x="407" y="110" width="77" height="11"/><rect class="fig-muro" x="495" y="110" width="11" height="11"/><rect class="fig-muro" x="275" y="121" width="11" height="11"/><rect class="fig-muro" x="319" y="121" width="11" height="11"/><rect class="fig-muro" x="385" y="121" width="11" height="11"/><rect class="fig-muro" x="429" y="121" width="11" height="11"/><rect class="fig-muro" x="495" y="121" width="11" height="11"/><rect class="fig-muro" x="275" y="132" width="11" height="11"/><rect class="fig-muro" x="297" y="132" width="77" height="11"/><rect class="fig-muro" x="385" y="132" width="33" height="11"/><rect class="fig-muro" x="429" y="132" width="11" height="11"/><rect class="fig-muro" x="451" y="132" width="55" height="11"/><rect class="fig-muro" x="275" y="143" width="11" height="11"/><rect class="fig-muro" x="363" y="143" width="11" height="11"/><rect class="fig-muro" x="429" y="143" width="11" height="11"/><rect class="fig-muro" x="495" y="143" width="11" height="11"/><rect class="fig-muro" x="275" y="154" width="11" height="11"/><rect class="fig-muro" x="297" y="154" width="55" height="11"/><rect class="fig-muro" x="363" y="154" width="121" height="11"/><rect class="fig-muro" x="495" y="154" width="11" height="11"/><rect class="fig-muro" x="275" y="165" width="11" height="11"/><rect class="fig-muro" x="319" y="165" width="11" height="11"/><rect class="fig-muro" x="341" y="165" width="11" height="11"/><rect class="fig-muro" x="451" y="165" width="11" height="11"/><rect class="fig-muro" x="495" y="165" width="11" height="11"/><rect class="fig-muro" x="275" y="176" width="11" height="11"/><rect class="fig-muro" x="297" y="176" width="11" height="11"/><rect class="fig-muro" x="319" y="176" width="11" height="11"/><rect class="fig-muro" x="341" y="176" width="11" height="11"/><rect class="fig-muro" x="363" y="176" width="33" height="11"/><rect class="fig-muro" x="407" y="176" width="11" height="11"/><rect class="fig-muro" x="429" y="176" width="11" height="11"/><rect class="fig-muro" x="451" y="176" width="11" height="11"/><rect class="fig-muro" x="473" y="176" width="33" height="11"/><rect class="fig-muro" x="275" y="187" width="11" height="11"/><rect class="fig-muro" x="297" y="187" width="11" height="11"/><rect class="fig-muro" x="319" y="187" width="11" height="11"/><rect class="fig-muro" x="341" y="187" width="11" height="11"/><rect class="fig-muro" x="385" y="187" width="11" height="11"/><rect class="fig-muro" x="407" y="187" width="11" height="11"/><rect class="fig-muro" x="429" y="187" width="11" height="11"/><rect class="fig-muro" x="451" y="187" width="11" height="11"/><rect class="fig-muro" x="473" y="187" width="11" height="11"/><rect class="fig-muro" x="495" y="187" width="11" height="11"/><rect class="fig-muro" x="275" y="198" width="11" height="11"/><rect class="fig-muro" x="297" y="198" width="11" height="11"/><rect class="fig-muro" x="319" y="198" width="11" height="11"/><rect class="fig-muro" x="341" y="198" width="11" height="11"/><rect class="fig-muro" x="363" y="198" width="11" height="11"/><rect class="fig-muro" x="385" y="198" width="11" height="11"/><rect class="fig-muro" x="407" y="198" width="11" height="11"/><rect class="fig-muro" x="429" y="198" width="11" height="11"/><rect class="fig-muro" x="451" y="198" width="11" height="11"/><rect class="fig-muro" x="473" y="198" width="11" height="11"/><rect class="fig-muro" x="495" y="198" width="11" height="11"/><rect class="fig-muro" x="275" y="209" width="11" height="11"/><rect class="fig-muro" x="363" y="209" width="11" height="11"/><rect class="fig-muro" x="429" y="209" width="11" height="11"/><rect class="fig-muro" x="495" y="209" width="11" height="11"/><rect class="fig-muro" x="275" y="220" width="231" height="11"/><rect class="fig-brecha" x="287" y="177" width="9" height="9" rx="2"/><rect class="fig-brecha" x="397" y="45" width="9" height="9" rx="2"/><rect class="fig-brecha" x="353" y="199" width="9" height="9" rx="2"/><rect class="fig-brecha" x="419" y="177" width="9" height="9" rx="2"/><rect class="fig-brecha" x="331" y="23" width="9" height="9" rx="2"/><rect class="fig-brecha" x="386" y="166" width="9" height="9" rx="2"/><circle class="fig-spawn" cx="291.5" cy="16.5" r="3.6"/><circle class="fig-halo" cx="313.5" cy="126.5" r="6.5"/><circle class="fig-meta" cx="313.5" cy="126.5" r="3.2"/>
			<text x="115.5" y="248" text-anchor="middle">excavado &#183; sin bucles</text>
			<text x="390.5" y="248" text-anchor="middle">trenzado &#183; 6 paredes menos &#183; meta a 100</text>
		</svg>
	</div>
	<p class="figura__pie">El mismo laberinto recién excavado y después del trenzado. En violeta, las seis paredes derribadas en fondos de saco; en ámbar la salida, y en verde la meta que el BFS coloca en la celda más lejana.</p>
</div>

## La luz no es una barra de vida: es lo que te cuesta moverte

Y aquí es donde el juego deja de ser un laberinto y se convierte en un problema de caminos mínimos.

El jugador arranca con un depósito de luz y hay un detalle que lo condiciona absolutamente todo: **la luz no baja con los pasos, baja con el reloj**. Estar quieto gasta igual. Pararte a mirar el laberinto te cuesta lo mismo que recorrerlo.

El consumo por segundo está ajustado para que **andar sin parar con el Faro cueste exactamente una unidad por celda**. El Faro es el foco grande, el que te deja ver de verdad. El **Rescoldo** gasta un quinto de eso, pero sólo te alumbra un par de celdas a tu alrededor.

Quédate con esa equivalencia entre segundos y celdas porque es la que sostiene todo lo demás. Gracias a ella puedo analizar un recurso que se gasta con el tiempo como si fuera el coste de moverse de una celda a otra. Y, de paso, me deja meter en la misma cuenta cosas que no son pasos, como quedarte parado encima de una placa.

Las velas te devuelven luz al pisarlas. Y las reglas de cada mundo entran en el mismo modelo sin inventar nada raro: son **peajes**.

- **Puerta de luz.** Cruzarla te cuesta su valor **una** vez. Es lo que gastas cargándola con el Faro y luego se queda abierta para siempre.
- **Suelo frágil.** Te cuesta su peaje **cada** vez que lo pisas, porque la baldosa sólo aguanta mientras está iluminada.
- **Placa de luz.** Te cuesta su valor una vez, igual que la puerta, pero además **la meta empieza cerrada** y no se abre hasta que están todas encendidas.

Ningún peaje es negativo, así que moverse siempre cuesta algo y Dijkstra me sigue sirviendo. Lo que sí cambia, y esto es lo importante, es qué contamos como nodo.

### Un nodo no es una celda

Piénsalo un momento: una puerta abierta, una vela ya cogida o una placa encendida son cosas que te llevas contigo el resto del nivel. Estar en una celda con la puerta abierta no es lo mismo que estar en esa misma celda con la puerta cerrada, y el algoritmo tiene que tratarlas como dos nodos completamente distintos.

Así que un nodo no es una celda: es **una celda más la lista de lo que llevas encendido**.

Esa lista se guarda como un juego de interruptores, uno por cada vela, cada puerta y cada placa del nivel, encendido o apagado. En el código se llama *máscara de bits* (*bitmask*), que es el nombre que verás en la figura de aquí abajo.

¿Y dónde está el coste de todo esto? Con 12 interruptores hay 2¹² = **4.096** combinaciones posibles, y cada combinación es una copia entera del laberinto. En uno de 41×41 celdas salen casi **6,8 millones** de nodos que recorrer.

Por eso el límite está en **12 en total** entre velas, puertas y placas. Y lo mejor de todo es que el límite de diseño está exactamente en el mismo sitio: pasadas doce cosas que recordar, el jugador deja de llevar la cuenta. Cuando el techo técnico y el de diseño coinciden, la decisión se toma sola.

<div class="figura">
	<div class="figura__lienzo">
		<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" role="img"
			aria-label="El espacio de estados del evaluador: tres capas horizontales, una por cada valor de la máscara de bits, con las mismas celdas repetidas en cada capa. Una flecha sube de la primera capa a la segunda al recoger una vela, y de la segunda a la tercera al abrir una puerta. Debajo, dos flechas opuestas representan el Dijkstra hacia delante, que mide el gasto, y el Dijkstra hacia atrás, que mide la luz necesaria.">

			<rect class="fig-plano" x="104" y="29" width="412" height="46" rx="8"/>
			<rect class="fig-borde" x="104" y="29" width="412" height="46" rx="8"/>
			<rect class="fig-plano" x="104" y="109" width="412" height="46" rx="8"/>
			<rect class="fig-borde" x="104" y="109" width="412" height="46" rx="8"/>
			<rect class="fig-plano" x="104" y="189" width="412" height="46" rx="8"/>
			<rect class="fig-borde" x="104" y="189" width="412" height="46" rx="8"/>

			<text x="92" y="56" text-anchor="end">m&#225;scara 000</text>
			<text x="92" y="136" text-anchor="end">m&#225;scara 010</text>
			<text x="92" y="216" text-anchor="end">m&#225;scara 110</text>

			<line class="fig-arista" x1="140" y1="52" x2="490" y2="52"/>
			<line class="fig-arista" x1="140" y1="132" x2="490" y2="132"/>
			<line class="fig-arista" x1="140" y1="212" x2="490" y2="212"/>

			<circle class="fig-nodo" cx="210" cy="52" r="5"/>
			<circle class="fig-nodo" cx="280" cy="52" r="5"/>
			<circle class="fig-nodo" cx="350" cy="52" r="5"/>
			<circle class="fig-nodo" cx="420" cy="52" r="5"/>
			<circle class="fig-nodo" cx="490" cy="52" r="5"/>
			<circle class="fig-spawn" cx="140" cy="52" r="6"/>

			<circle class="fig-nodo" cx="140" cy="132" r="5"/>
			<circle class="fig-nodo" cx="210" cy="132" r="5"/>
			<circle class="fig-nodo" cx="280" cy="132" r="5"/>
			<circle class="fig-nodo" cx="350" cy="132" r="5"/>
			<circle class="fig-nodo" cx="420" cy="132" r="5"/>
			<circle class="fig-nodo" cx="490" cy="132" r="5"/>

			<circle class="fig-nodo" cx="140" cy="212" r="5"/>
			<circle class="fig-nodo" cx="210" cy="212" r="5"/>
			<circle class="fig-nodo" cx="280" cy="212" r="5"/>
			<circle class="fig-nodo" cx="350" cy="212" r="5"/>
			<circle class="fig-nodo" cx="420" cy="212" r="5"/>
			<circle class="fig-halo" cx="490" cy="212" r="9"/>
			<circle class="fig-meta" cx="490" cy="212" r="5"/>

			<line class="fig-salto" x1="280" y1="60" x2="280" y2="121"/>
			<polygon class="fig-punta" points="274,121 286,121 280,130"/>
			<text x="290" y="98">vela</text>

			<line class="fig-salto" x1="420" y1="140" x2="420" y2="201"/>
			<polygon class="fig-punta" points="414,201 426,201 420,210"/>
			<text x="430" y="178">puerta</text>

			<text x="220" y="262" text-anchor="middle">hacia delante &#183; gasto</text>
			<line class="fig-flecha" x1="140" y1="274" x2="292" y2="274"/>
			<polygon class="fig-puntaf" points="292,269 292,279 301,274"/>

			<text x="410" y="262" text-anchor="middle">hacia atr&#225;s &#183; necesita</text>
			<line class="fig-flecha" x1="490" y1="274" x2="338" y2="274"/>
			<polygon class="fig-puntaf" points="338,269 338,279 329,274"/>
		</svg>
	</div>
	<p class="figura__pie">La misma celda es varios nodos. Recoger una vela o abrir una puerta no te mueve por el laberinto: te mueve de capa.</p>
</div>

## El primer Dijkstra: hacia delante, el recorrido más barato que llega vivo

La primera búsqueda calcula `gasto[estado]`, que es la luz mínima que hay que consumir para plantarse en una celda con unas cosas ya encendidas. Cuenta los pasos, los peajes y las cargas de puerta, sin descontar las velas. Si dar un paso te dejara por debajo de cero, ese paso simplemente no existe. Llegar a cero justo sí vale: has llegado, lo que no puedes es dar otro paso.

Pensarás que guardar sólo el gasto mínimo de cada estado deja opciones fuera. Y no las deja, te lo prometo. La luz que llevas encima es `luzInicial - gasto + lo que hayas recogido`, así que **gastar menos es siempre llevar más luz, y llevando más luz nunca puedes hacer menos cosas**. La comparación siempre sale a favor del camino más barato y por eso basta con un número por estado.

De aquí salen dos números que me interesan mucho:

- `luzMinima` es la luz neta que gasta el mejor recorrido que llega vivo. Puede ser negativa si las velas acaban pagando el viaje.
- `holgura = luzInicial − luzMinima` es la luz que te sobra al llegar si juegas perfecto. Y esta es, con diferencia, **el mando principal de la dificultad**.

## El segundo Dijkstra: hacia atrás, el presupuesto mínimo del nivel

Esta segunda búsqueda es mi parte favorita de todo el proyecto. Responde a una pregunta completamente distinta: **¿con cuánta luz se puede terminar este nivel?** No cuánta gastas, sino cuánta necesitas llevar encima. Y fíjate en un detalle: es una propiedad del laberinto, no de la partida, porque no mira el depósito inicial para nada.

Se resuelve desde la meta hacia atrás con esta recurrencia:

```csharp

// necesita(c) = min sobre los vecinos n de max(arista, arista + necesita(n) - vela(n))
int candidato = Mathf.Max(coste, coste + prioridad - ganancia);

```

Donde `arista` es lo que te cuesta dar ese paso, con los peajes incluidos, y `vela(n)` lo que te devuelve la casilla a la que llegas.

Y ahora te preguntarás: ¿qué pinta ahí ese `max`? Pues es justo lo que hace que todo esto funcione. Sin él, una vela que te devuelve 25 unidades convertiría ese paso en un coste negativo, y con costes negativos Dijkstra deja de valer. Con el `max`, el número nunca baja de lo que cuesta el propio paso: por muy generosa que sea la vela que hay al otro lado, primero tienes que poder pagar el paso para llegar hasta ella. Así la cuenta nunca decrece ni se vuelve negativa y la cola de prioridad sigue siendo válida.

Ese número, `luzNecesaria`, es lo que me permite poner el depósito de cada nivel con criterio en vez de a ojo. **Al laberinto recién generado se le pregunta con cuánta luz se puede terminar y se le da esa luz multiplicada por un factor.** Con factor 1 el nivel queda al filo; con factor 3 es un paseo. Como el factor se sortea entre 1,2 y 3, una misma tirada de laberintos llega a las cuatro bandas de dificultad. Con un factor fijo saldrían todos igual de aburridos.

## Las dos búsquedas juntas: contar decisiones de verdad

Un laberinto se puede medir contando cruces, pero contar celdas con tres salidas o más no dice gran cosa. Lo que quieres saber en realidad es cuántas veces el jugador **elige de verdad**. Y para eso hacen falta las dos búsquedas a la vez:

- la de ida te dice **con cuánta luz llegas** a ese cruce jugando bien, y por dónde has entrado;
- la de vuelta te dice, para cada rama, **cuánta luz haría falta** para terminar desde ahí.

Una rama cuenta si la luz con la que llegarías a ella es igual o mayor que la que necesita. Si al final quedan dos ramas o más, eso es una decisión. Si sólo queda una, no lo es.

Y esto no es ninguna sutileza: un cruce donde todas las ramas menos una son callejones a los que no te llega la luz es un pasillo disfrazado, y contarlo como decisión te infla la dificultad de un nivel que en realidad se juega solo.

## Puntuar, curar y publicar

Con las métricas en la mano, la dificultad es una media ponderada de cuatro cosas. Cada una se normaliza contra un tope calibrado sobre los niveles ya publicados:

| Métrica | Peso | Qué mide |
|---|---|---|
| Presión | 0,35 | Cuánta de la luz que llevas te hace falta de verdad |
| Decisiones | 0,25 | Cruces con dos ramas o más que siguen ganando |
| Camino | 0,20 | Lo largo que es el recorrido que *termina* el nivel |
| Desvíos | 0,20 | Velas que quedan fuera de la ruta óptima |

El resultado cae en una de cuatro bandas: *presentar*, *desarrollar*, *retorcer* y *dominar*. Y el proceso completo, mira por dónde, es el de cualquier tarea por lotes de las que hago en el backend: se generan **500 laberintos**, se puntúan, se tiran los que no se pueden terminar y se guardan los mejores de cada banda.

Hasta los umbrales de estrellas salen del propio nivel, como una fracción de su holgura (el 60 % y el 25 %), así que son justos por construcción y no hay ni un solo número puesto a mano. Para mi tranquilidad, vaya.

> ¡OJO con las placas! Este detalle casi me deja un mundo entero sin sentido. Con placas, el recorrido que termina el nivel **no** es el camino de la salida a la meta que calcula el BFS, porque la meta está cerrada hasta que las enciendes todas. El recorrido bueno es otro: salida → todas las placas → meta.

Y durante un tiempo lo estuve midiendo mal. El evaluador puntuaba cada nivel con el camino directo a la meta, es decir, con un camino que el jugador no puede hacer. ¿El resultado? Que una placa escondida a veinte celdas de la ruta no subía la dificultad ni un decimal, y todo el mundo de las placas puntuaba como si su regla no existiera.

Arreglarlo fue más sencillo de lo que parece. En un nivel hay tres placas como mucho, así que sólo existen seis órdenes posibles para recorrerlas (3 × 2 × 1 = 6). Se prueban los seis a lo bruto, se mide lo que cuesta cada uno y nos quedamos con el más barato. Es el problema del viajante de comercio de toda la vida, pero tan pequeño que no hace falta hilar fino: con seis intentos está resuelto.

## Y un BFS más: la Sombra

Del cuarto mundo en adelante hay algo persiguiéndote y, como no podía ser de otra forma, también se mueve por la rejilla. La Sombra baja celda a celda por un campo de distancias BFS hacia el jugador y nunca va más rápido que él. Perseguir sin poder alcanzar es tensión; perseguir más rápido es una carrera perdida antes de empezar.

Pero lo interesante no es cómo se mueve, sino cómo te detecta: **su alcance depende del radio de tu propia luz**. Con el Faro te ve desde veinte celdas y, si te alcanza, te quita luz, que es justo lo que te hace falta para llegar a la meta. Con el Rescoldo se te puede acercar hasta cinco celdas sin que te enteres, así que el mordisco te llega sin ningún aviso.

Es decir: tu luz te delata de lejos y te deja a ciegas de cerca, y el precio de que te alcance es siempre el mismo, menos luz para terminar. Esa sola regla convierte el interruptor Faro/Rescoldo en una decisión constante, en vez de en un botón que se pulsa una vez y se olvida.

## Lo que me llevo

El generador de laberintos es un clásico y se escribe en una tarde. Lo que ha hecho interesante este proyecto ha sido todo lo demás.

Poner un recurso que se agota convierte un puzle de recorrido en un problema de camino mínimo con estado. Y en cuanto tienes un evaluador que sabe puntuar un nivel, la curva de dificultad se **mide** en lugar de intuirse. Cuando publicar contenido es generar, puntuar y filtrar, el trabajo de diseño que te queda es el que merece la pena: decidir qué regla estrena cada mundo.

Reconozco que no me esperaba acabar aplicando en un juego de móvil las mismas ideas que uso a diario en el backend, y ha sido una de las cosas que más he disfrutado en mucho tiempo.

Y si has llegado hasta aquí, lo suyo es que lo juegues: la [prueba interna en Google Play][prueba] sigue abierta y la [ficha del juego][ficha] es la de siempre. Cuéntame qué te ha parecido, qué nivel se te ha atragantado y cualquier fallo que veas.

¡Nos vemos programando!

[prueba]: https://play.google.com/apps/testing/com.javiercanadilla.shadowmaze
[ficha]: https://play.google.com/store/apps/details?id=com.javiercanadilla.shadowmaze

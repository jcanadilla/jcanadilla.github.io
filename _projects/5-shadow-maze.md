---
layout: project
title: Shadow Maze
technologies: [Unity 6, C#, Algoritmia, BFS, Dijkstra, Android, iOS]
thumbnail: shadow-maze/shadow-maze.png
image: shadow-maze/shadow-maze.png
---

**Shadow Maze** es un juego de móvil hecho en Unity 6 en el que recorres un laberinto a oscuras con una linterna que se está apagando. La luz es un recurso finito: baja sola, segundo a segundo, las velas la recargan y quedarte a cero reinicia el nivel. Son 68 niveles repartidos en seis mundos, y cada mundo estrena una regla: puertas que hay que cargar, placas que mantienen la meta cerrada, suelo que se rompe al pisarlo y, a partir del cuarto, algo que te caza en la oscuridad.

No hay un solo sprite dibujado en el proyecto: todo lo que se ve son luces, siluetas y post-proceso generados por código. Pero lo que de verdad me interesa contar aquí es que **el contenido tampoco está hecho a mano**. Los 68 laberintos los genera un algoritmo, los puntúa otro, y solo se publican los que caen en la banda de dificultad que toca. Curar niveles dejó de ser trabajo de diseño y pasó a ser trabajo de backend.

<ul class="cifras">
	<li><span class="cifra__valor">68</span><span class="cifra__etiqueta">niveles en 6 mundos</span></li>
	<li><span class="cifra__valor">6,8 M</span><span class="cifra__etiqueta">estados por evaluación</span></li>
	<li><span class="cifra__valor">500</span><span class="cifra__etiqueta">laberintos por tirada</span></li>
	<li><span class="cifra__valor">0</span><span class="cifra__etiqueta">sprites importados</span></li>
</ul>

## El laberinto: backtracking, y por qué un laberinto perfecto es aburrido

La rejilla empieza maciza y se excava. Las celdas viven en coordenadas impares, los muros en las pares, y el excavador es el *recursive backtracking* de toda la vida: desde la celda actual mira las cuatro vecinas a dos de distancia, se queda con las que siguen siendo pared, elige una al azar, tira el muro intermedio y avanza. Cuando no queda ninguna, retrocede.

Con una salvedad: **la pila es explícita**. La versión recursiva se comía la pila de llamadas en cuanto el laberinto crecía, así que el recorrido va sobre un `Stack<Vector2Int>` y el algoritmo es exactamente el mismo con el bucle a la vista.

```csharp
while (pila.Count > 0)
{
    Vector2Int actual = pila.Peek();
    // candidatas = vecinas a dos celdas que sigan siendo pared
    ...
    if (candidatas.Count == 0) { pila.Pop(); continue; }

    Vector2Int direccion = candidatas[rand.Next(candidatas.Count)];
    Vector2Int intermedia = actual + direccion;
    Vector2Int siguiente  = actual + direccion * 2;

    esPared[intermedia.x, intermedia.y] = false;
    esPared[siguiente.x, siguiente.y] = false;
    pila.Push(siguiente);
}
```

Eso produce un **laberinto perfecto**: exactamente un camino entre dos celdas cualesquiera, ni un solo bucle. Y un laberinto perfecto tiene un problema serio como juego, y es que se resuelve pegando la mano a la pared derecha y andando. No hay ni una decisión que tomar: es un pasillo muy largo disfrazado de laberinto.

La respuesta es el **trenzado** (*braiding*): después de excavar se localizan los fondos de saco —celdas con una única salida— y a una fracción de ellos se les tira otra pared. Cada pared derribada es un bucle nuevo, y cada bucle es una ruta alternativa que hay que *elegir*. La fracción es un parámetro: 0 deja el laberinto perfecto, 1 lo convierte en una malla.

Y con el laberinto ya trenzado se coloca la meta, que no se elige a ojo: **un BFS desde la salida da el campo de distancias completo y la meta va en la celda alcanzable más lejana**, demostrablemente.

Por si el nombre suena a más de lo que es: un **BFS** (*breadth-first search*, o recorrido en anchura) es de los algoritmos más simples que hay. Metes la celda de salida en una cola y vas sacando celdas de una en una; a cada vecina de suelo que no hayas visitado todavía le apuntas la distancia de la celda actual más uno, y la metes al final de la cola. El laberinto se va inundando en anillos desde el origen, y como todos los pasos valen lo mismo, **la primera vez que llegas a una celda es necesariamente por el camino más corto**. Una sola pasada, lineal en el número de celdas, te deja la distancia del origen a todas a la vez: la mayor es la meta, y el propio campo sirve luego para reconstruir cualquier ruta bajando por él.

Los empates se rompen siempre por orden de barrido, así que una misma semilla produce siempre el mismo laberinto — requisito nada negociable cuando el reparto de velas y de puertas se apoya en la ruta.

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

## La luz no es una barra: es el peso de las aristas

Aquí es donde el juego deja de ser un laberinto y se convierte en un problema de caminos mínimos.

El jugador arranca con un depósito de luz, y aquí hay un matiz que lo condiciona todo: **la luz no baja con los pasos, baja con el reloj**. Estar quieto gasta igual. Pararte a mirar el laberinto cuesta lo mismo que recorrerlo.

Lo que hace el modelo es fijar el consumo por segundo de forma que **andar sin parar con el Faro** —el foco grande, con el que ves— cueste exactamente una unidad de coste por celda. El **Rescoldo** consume un quinto de eso, pero apenas alumbra dos celdas a tu alrededor. Esa equivalencia entre segundos y celdas es la bisagra del sistema entero: es lo que permite analizar un recurso que se consume en tiempo como si fuera el peso de una arista, y de paso deja meter en la misma cuenta cosas que no son pasos, como esperar plantado encima de una placa.

Las velas devuelven luz al pisarlas. Y las reglas de los mundos entran en el mismo modelo, sin inventar nada nuevo, simplemente como **peajes**:

- **Puerta de luz.** Cruzarla cuesta su valor **una** vez: es lo que gastas cargándola en Faro, y después se queda abierta.
- **Suelo frágil.** Cuesta su peaje **cada** vez que lo pisas: la baldosa solo aguanta mientras está iluminada.
- **Placa de luz.** Cuesta su valor una vez, como la puerta, pero además **la meta nace cerrada** y no se abre hasta que están todas encendidas.

Como todos los peajes son no negativos, el coste de una arista sigue siendo no negativo y monótono: Dijkstra sigue valiendo. Lo que sí cambia es qué es un nodo. Una puerta abierta, una vela ya recogida o una placa encendida son **estado que te llevas contigo**, así que la misma celda con la puerta abierta y con la puerta cerrada son dos nodos distintos. El grafo real es `(celda, máscara de bits)`.

De ahí sale el único límite duro del sistema: **doce bits**, repartidos entre velas, puertas y placas. Con doce bits y un laberinto de 41×41 ya son 6,8 millones de estados; y pasadas doce, además, el jugador deja de contarlas. La restricción técnica y la de diseño coinciden, que es la mejor clase de límite.

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

## Dijkstra hacia delante: el recorrido más barato que llega vivo

La primera búsqueda calcula `gasto[estado]`: la luz mínima consumida —pasos, peajes y cargas de puerta, sin descontar velas— para plantarse en esa celda con esa máscara ya encendida. Una arista se rechaza si dar el paso te dejaría por debajo de cero; llegar a cero justo cuenta como llegar, lo que no puedes es dar otro paso.

Quedarse solo con el gasto mínimo de cada estado parece una poda arriesgada y no lo es, y el argumento cabe en una línea: la luz que llevas encima en un estado es `luzInicial - gasto + valor(máscara)`, así que **menos gasto es siempre más luz, y con más luz nunca puedes hacer menos cosas**. La dominancia es total, y por eso un solo número por estado basta.

De aquí salen dos métricas: `luzMinima`, la luz neta que gasta el mejor recorrido que llega vivo —que puede ser negativa si las velas pagan el viaje—, y sobre todo `holgura = luzInicial − luzMinima`, la luz que te sobra al llegar si juegas perfecto. La holgura es el mando principal de la dificultad.

## Dijkstra hacia atrás: el presupuesto mínimo del nivel

La segunda búsqueda es la que me parece bonita. Responde a otra pregunta: **¿con cuánta luz se puede terminar este nivel?** No cuánta gastas, sino cuánta necesitas tener en el bolsillo. Y es una propiedad del laberinto, no de la partida: no mira el presupuesto inicial en absoluto.

Se resuelve desde la meta hacia atrás con esta recurrencia:

```csharp
// necesita(c) = min sobre los vecinos n de max(arista, arista + necesita(n) - vela(n))
int candidato = Mathf.Max(coste, coste + prioridad - ganancia);
```

El `max` es el detalle que lo sostiene todo. Sin él, una vela que devuelve 25 unidades sería una arista negativa y Dijkstra dejaría de valer. Con él la función es monótona y nunca negativa —porque hace falta al menos poder pagar la arista para darla, por muy generosa que sea la vela que hay al otro lado— y la cola de prioridad vuelve a ser legítima.

Ese número, `luzNecesaria`, es lo que convierte el presupuesto de cada nivel en algo medido en vez de puesto a ojo: **al laberinto recién generado se le pregunta con cuánta luz se puede terminar y se le da esa luz multiplicada por un factor**. Factor 1 es un nivel al filo; factor 3 es un paseo. Sorteando el factor entre 1,2 y 3, una misma tirada llega a las cuatro bandas de dificultad; con un factor fijo saldrían todos iguales.

## Las dos búsquedas juntas: contar decisiones de verdad

Un laberinto se puede medir por cruces, pero contar celdas con tres salidas o más no dice gran cosa. Lo que quieres saber es cuántas veces el jugador **elige de verdad**, y para eso hacen falta las dos búsquedas a la vez:

- la de ida dice **con cuánta luz llegas** a ese cruce jugando bien, y por dónde has entrado;
- la de vuelta dice, para cada rama, **cuánta luz haría falta** para terminar desde ahí.

Una rama cuenta si la luz con la que llegarías a ella es mayor o igual que la que necesita. Si al final quedan dos o más ramas viables, eso es una decisión. Si solo queda una, no lo es: un cruce en el que todas las ramas menos una son callejones sin luz suficiente es un pasillo disfrazado, y contarlo como decisión infla la dificultad de un nivel que en realidad se juega solo.

## Puntuar, curar y publicar

Con las métricas en la mano, la dificultad es una media ponderada de cuatro cosas, todas normalizadas contra una saturación calibrada sobre el corpus ya publicado:

| Métrica | Peso | Qué mide |
|---|---|---|
| Presión | 0,35 | Cuánta de la luz que llevas te hace falta de verdad |
| Decisiones | 0,25 | Cruces con dos ramas o más que siguen ganando |
| Camino | 0,20 | Lo largo que es el recorrido que *termina* el nivel |
| Desvíos | 0,20 | Velas que quedan fuera de la ruta óptima |

El resultado cae en una de cuatro bandas —*presentar*, *desarrollar*, *retorcer* y *dominar*— y la tubería completa es la que esperarías de cualquier proceso por lotes: se generan 500 laberintos, se puntúan, se tiran los que no se pueden terminar y se conservan los mejores de cada banda. Los umbrales de estrellas salen derivados del propio nivel, como una fracción de su holgura (60 % y 25 %), así que son justos por construcción y no hay ni un número puesto a mano.

Un detalle que costó una regla entera: con placas, el recorrido que termina el nivel **no** es el BFS de la salida a la meta, porque la meta no se abre hasta que están todas encendidas. Hay que visitarlas todas, o sea un viajante de comercio de tres paradas como mucho, que se resuelve probando los seis órdenes a lo bruto. Sin eso, una placa a veinte celdas de la ruta no movía la dificultad ni un decimal y todo un mundo puntuaba como si su regla no existiera.

## Y un BFS más: la Sombra

Del cuarto mundo en adelante hay algo persiguiéndote, y también es un recorrido sobre la rejilla: la Sombra baja celda a celda por un campo de distancias BFS hacia el jugador, y nunca se mueve más rápido que él. Perseguir sin poder alcanzar es tensión; perseguir más rápido es una carrera perdida de antemano.

Lo que la hace interesante no es su navegación sino su regla de detección: **su alcance es el radio de tu propia luz multiplicado por 2,6**. En Faro te ve desde veinte celdas, pero no puede tocarte porque la luz la repele; en Rescoldo se te acerca hasta cinco celdas sin enterarte, y ahí el contacto reinicia el nivel. Tu luz te protege de cerca y te delata de lejos, y esa sola línea convierte el interruptor Faro/Rescoldo en la decisión constante del juego en vez de en un botón que se pulsa una vez y se olvida.

## Lo que me llevo

El generador de laberintos es un clásico y se escribe en una tarde. Lo que ha hecho interesante el proyecto es lo otro: que meter un recurso agotable convierte un puzle de recorrido en un problema de camino mínimo con estado, y que en cuanto existe un evaluador capaz de puntuar un nivel, la curva de dificultad se **mide** en lugar de intuirse. Cuando publicar contenido consiste en generar, puntuar y filtrar, la parte de diseño que queda es la que merece la pena: decidir qué regla estrena cada mundo.

---
layout: project
title: Shadow Maze
technologies: [Unity 6, C#, Algoritmia, BFS, Dijkstra, Android, iOS]
thumbnail: shadow-maze/shadow-maze.png
image: shadow-maze/shadow-maze.png
---

**Shadow Maze** es un juego de móvil hecho en Unity 6. Recorres un laberinto a oscuras con una linterna que se está apagando. La luz es un recurso que se acaba: baja sola, segundo a segundo. Las velas la recargan, y si llegas a cero el nivel vuelve a empezar. Son 68 niveles en seis mundos, y cada mundo trae una regla nueva: puertas que hay que cargar, placas que mantienen la meta cerrada, suelo que se rompe al pisarlo y, desde el cuarto, algo que te persigue en la oscuridad.

En el proyecto no hay ni un dibujo importado. Todo lo que ves son luces, siluetas y post-proceso generados por código. Pero lo que quiero contar aquí es otra cosa: **los niveles tampoco están hechos a mano**. Un algoritmo genera los laberintos, otro los puntúa, y solo se publican los que caen en la dificultad que toca. Elegir niveles dejó de ser trabajo de diseño y pasó a ser trabajo de backend.

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

## El laberinto: backtracking, y por qué un laberinto perfecto es aburrido

La rejilla empieza siendo todo pared y se va excavando. Las celdas van en coordenadas impares y los muros en las pares. El excavador es el *recursive backtracking* de siempre: desde la celda en la que estás miras las cuatro vecinas que hay a dos de distancia, te quedas con las que siguen siendo pared, eliges una al azar, tiras el muro de en medio y avanzas. Cuando no queda ninguna, retrocedes.

Con un detalle: **la pila es explícita**. La versión recursiva se quedaba sin pila de llamadas en cuanto el laberinto crecía un poco, así que el recorrido va sobre un `Stack<Vector2Int>`. Es el mismo algoritmo, pero con el bucle a la vista.

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

Eso da un **laberinto perfecto**: entre dos celdas cualesquiera hay exactamente un camino, sin bucles. Y ahí está el problema. Un laberinto perfecto se resuelve pegando la mano a la pared derecha y andando. No hay nada que decidir: es un pasillo muy largo disfrazado de laberinto.

La solución es el **trenzado** (*braiding*). Con el laberinto ya excavado se buscan los fondos de saco, que son las celdas con una sola salida, y a unos cuantos se les tira otra pared. Cada pared que cae abre un bucle, y cada bucle es un camino alternativo que hay que elegir. Cuántos fondos se abren es un parámetro: con 0 el laberinto se queda perfecto y con 1 se convierte en una malla.

Después se coloca la meta, y tampoco se pone a ojo: **un BFS desde la salida mide la distancia hasta todas las celdas, y la meta va en la más lejana de todas**.

Por si el nombre suena a más de lo que es, un **BFS** (*breadth-first search*, o recorrido en anchura) es de los algoritmos más sencillos que existen. Metes la celda de salida en una cola. Vas sacando celdas de una en una y, a cada vecina de suelo que no hayas visitado, le apuntas la distancia de la celda actual más uno y la metes al final de la cola. El laberinto se va inundando en anillos desde el origen.

Como todos los pasos valen lo mismo, **la primera vez que llegas a una celda es por el camino más corto**. Con una sola pasada tienes la distancia a todas las celdas. La mayor es la meta, y ese mismo campo de distancias sirve luego para reconstruir cualquier ruta: basta con ir bajando de número en número.

Los empates se resuelven siempre en el mismo orden de barrido. Eso hace que una misma semilla dé siempre el mismo laberinto, y es importante: el reparto de velas y de puertas se apoya en la ruta, y tiene que salir igual cada vez.

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

## La luz no es una barra de vida: es lo que cuesta moverse

Aquí es donde el juego deja de ser un laberinto y pasa a ser un problema de caminos mínimos.

El jugador arranca con un depósito de luz, y hay un detalle que lo condiciona todo: **la luz no baja con los pasos, baja con el reloj**. Estar quieto gasta igual. Pararte a mirar el laberinto cuesta lo mismo que recorrerlo.

El consumo por segundo está puesto de forma que **andar sin parar con el Faro cueste exactamente una unidad por celda**. El Faro es el foco grande, el que te deja ver de verdad. El **Rescoldo** gasta un quinto de eso, pero solo alumbra un par de celdas a tu alrededor.

Esa equivalencia entre segundos y celdas es la que sostiene todo lo demás. Gracias a ella se puede analizar un recurso que se gasta con el tiempo como si fuera el coste de moverse de una celda a otra. Y de paso deja meter en la misma cuenta cosas que no son pasos, como quedarte parado encima de una placa.

Las velas devuelven luz al pisarlas. Y las reglas de los mundos entran en el mismo modelo, sin inventar nada: son **peajes**.

- **Puerta de luz.** Cruzarla cuesta su valor **una** vez. Es lo que gastas cargándola con el Faro, y luego se queda abierta.
- **Suelo frágil.** Cuesta su peaje **cada** vez que lo pisas, porque la baldosa solo aguanta mientras está iluminada.
- **Placa de luz.** Cuesta su valor una vez, igual que la puerta, pero además **la meta empieza cerrada** y no se abre hasta que están todas encendidas.

Ningún peaje es negativo, así que moverse siempre cuesta algo y Dijkstra sigue sirviendo. Lo que sí cambia es qué contamos como nodo.

Una puerta abierta, una vela ya cogida o una placa encendida son cosas que te llevas contigo el resto del nivel. Estar en una celda con la puerta abierta no es lo mismo que estar en esa misma celda con la puerta cerrada, y el algoritmo tiene que tratarlas como dos nodos distintos. Un nodo no es una celda: es **una celda más la lista de lo que llevas encendido**.

Esa lista se guarda como un juego de interruptores: uno por cada vela, cada puerta y cada placa del nivel, encendido o apagado. En el código se llama *máscara de bits*, que es el nombre que verás en la figura de aquí abajo.

Y ahí está el coste. Con 12 interruptores hay 2¹² = 4.096 combinaciones posibles, y cada combinación es una copia entera del laberinto. En uno de 41×41 celdas salen casi 6,8 millones de nodos que recorrer.

Por eso el límite es de **12 en total** entre velas, puertas y placas. Lo bueno es que el límite de diseño está en el mismo sitio: pasadas doce cosas que recordar, el jugador deja de llevar la cuenta. Cuando el techo técnico y el de diseño coinciden, la decisión se toma sola.

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

La primera búsqueda calcula `gasto[estado]`: la luz mínima que hay que consumir para plantarse en una celda con unas cosas ya encendidas. Cuenta los pasos, los peajes y las cargas de puerta, sin descontar las velas. Si dar un paso te dejaría por debajo de cero, ese paso no existe. Llegar a cero justo sí vale: has llegado, lo que no puedes es dar otro paso.

Guardar solo el gasto mínimo de cada estado parece que deja opciones fuera, y no las deja. La luz que llevas encima es `luzInicial - gasto + lo que hayas recogido`, así que **gastar menos es siempre llevar más luz, y llevando más luz nunca puedes hacer menos cosas**. La comparación siempre sale a favor del camino más barato, y por eso basta con un número por estado.

De aquí salen dos números. `luzMinima` es la luz neta que gasta el mejor recorrido que llega vivo, y puede ser negativa si las velas acaban pagando el viaje. Y `holgura = luzInicial − luzMinima` es la luz que te sobra al llegar si juegas perfecto. La holgura es el mando principal de la dificultad.

## Dijkstra hacia atrás: el presupuesto mínimo del nivel

La segunda búsqueda es la que más me gusta. Responde a otra pregunta: **¿con cuánta luz se puede terminar este nivel?** No cuánta gastas, sino cuánta necesitas llevar encima. Es una propiedad del laberinto, no de la partida: no mira el depósito inicial para nada.

Se resuelve desde la meta hacia atrás con esta recurrencia:

```csharp
// necesita(c) = min sobre los vecinos n de max(arista, arista + necesita(n) - vela(n))
int candidato = Mathf.Max(coste, coste + prioridad - ganancia);
```

`arista` es lo que cuesta dar ese paso, con los peajes incluidos, y `vela(n)` lo que te devuelve la casilla a la que llegas.

El `max` es lo que hace que esto funcione. Sin él, una vela que devuelve 25 unidades convertiría ese paso en un coste negativo, y con costes negativos Dijkstra deja de valer. Con el `max`, el número nunca baja de lo que cuesta el propio paso: por muy generosa que sea la vela que hay al otro lado, primero tienes que poder pagar el paso para llegar a ella. Así la cuenta nunca decrece ni se vuelve negativa, y la cola de prioridad sigue siendo válida.

Ese número, `luzNecesaria`, es lo que permite poner el depósito de cada nivel con criterio en vez de a ojo. **Al laberinto recién generado se le pregunta con cuánta luz se puede terminar, y se le da esa luz multiplicada por un factor.** Con factor 1 el nivel queda al filo; con factor 3 es un paseo. Como el factor se sortea entre 1,2 y 3, una misma tirada de laberintos llega a las cuatro bandas de dificultad. Con un factor fijo saldrían todos iguales.

## Las dos búsquedas juntas: contar decisiones de verdad

Un laberinto se puede medir contando cruces, pero contar celdas con tres salidas o más no dice gran cosa. Lo que quieres saber es cuántas veces el jugador **elige de verdad**. Y para eso hacen falta las dos búsquedas a la vez:

- la de ida dice **con cuánta luz llegas** a ese cruce jugando bien, y por dónde has entrado;
- la de vuelta dice, para cada rama, **cuánta luz haría falta** para terminar desde ahí.

Una rama cuenta si la luz con la que llegarías a ella es igual o mayor que la que necesita. Si al final quedan dos ramas o más, eso es una decisión. Si solo queda una, no lo es. Un cruce donde todas las ramas menos una son callejones a los que no te llega la luz es un pasillo disfrazado, y contarlo como decisión infla la dificultad de un nivel que en realidad se juega solo.

## Puntuar, curar y publicar

Con las métricas en la mano, la dificultad es una media ponderada de cuatro cosas. Cada una se normaliza contra un tope calibrado sobre los niveles ya publicados:

| Métrica | Peso | Qué mide |
|---|---|---|
| Presión | 0,35 | Cuánta de la luz que llevas te hace falta de verdad |
| Decisiones | 0,25 | Cruces con dos ramas o más que siguen ganando |
| Camino | 0,20 | Lo largo que es el recorrido que *termina* el nivel |
| Desvíos | 0,20 | Velas que quedan fuera de la ruta óptima |

El resultado cae en una de cuatro bandas: *presentar*, *desarrollar*, *retorcer* y *dominar*. Y el proceso completo es el de cualquier tarea por lotes: se generan 500 laberintos, se puntúan, se tiran los que no se pueden terminar y se guardan los mejores de cada banda. Los umbrales de estrellas salen del propio nivel, como una fracción de su holgura (el 60 % y el 25 %), así que son justos por construcción y no hay ni un número puesto a mano.

Un detalle que costó una regla entera. Con placas, el recorrido que termina el nivel **no** es el BFS de la salida a la meta, porque la meta no se abre hasta que están todas encendidas. Hay que pasar por todas. Es un viajante de comercio de tres paradas como mucho, así que se resuelve probando los seis órdenes posibles a lo bruto. Sin esto, una placa a veinte celdas de la ruta no movía la dificultad ni un decimal, y todo un mundo puntuaba como si su regla no existiera.

## Y un BFS más: la Sombra

Del cuarto mundo en adelante hay algo persiguiéndote, y también se mueve por la rejilla. La Sombra baja celda a celda por un campo de distancias BFS hacia el jugador, y nunca va más rápido que él. Perseguir sin poder alcanzar es tensión; perseguir más rápido es una carrera perdida antes de empezar.

Lo interesante no es cómo se mueve, sino cómo te detecta: **su alcance es el radio de tu propia luz multiplicado por 2,6**. Con el Faro te ve desde veinte celdas, pero no puede tocarte, porque la luz la repele. Con el Rescoldo se te puede acercar hasta cinco celdas sin que te enteres, y ahí el contacto reinicia el nivel.

Tu luz te protege de cerca y te delata de lejos. Esa sola regla convierte el interruptor Faro/Rescoldo en una decisión constante, en vez de en un botón que se pulsa una vez y se olvida.

## Lo que me llevo

El generador de laberintos es un clásico y se escribe en una tarde. Lo que ha hecho interesante el proyecto es lo otro. Poner un recurso que se agota convierte un puzle de recorrido en un problema de camino mínimo con estado. Y en cuanto tienes un evaluador que sabe puntuar un nivel, la curva de dificultad se **mide** en lugar de intuirse. Cuando publicar contenido es generar, puntuar y filtrar, el trabajo de diseño que queda es el que merece la pena: decidir qué regla estrena cada mundo.

Y si has llegado hasta aquí, lo suyo es que lo juegues: la [prueba interna en Google Play][prueba] sigue abierta, y la [ficha del juego][ficha] es la de siempre. Cualquier fallo que veas, cuéntamelo.

[prueba]: https://play.google.com/apps/testing/com.javiercanadilla.shadowmaze
[ficha]: https://play.google.com/store/apps/details?id=com.javiercanadilla.shadowmaze

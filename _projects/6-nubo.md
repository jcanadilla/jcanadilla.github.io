---
layout: project
title: NUBO
description: NUBO es un puzzle de lógica relajante para Android hecho con Godot. Una nube reparte el clima por 72 tableros en 6 regiones, y un BFS comprueba que cada reparto tiene su ruta mínima. Incluye una demo jugable.
technologies: [Godot 4.7, GDScript, Python, BFS, Android, Google Play Billing, Play Juegos]
thumbnail: nubo/portada.jpg
image: nubo/portada.jpg
scripts:
  - /assets/js/demo-nubo.js
  - /assets/js/nubo-pagina.js
---

{% assign nubo = '/assets/images/projects/nubo/' | relative_url %}

Si Shadow Maze va de oscuridad y de algo que te persigue, **NUBO** es justo lo contrario: un puzzle tranquilo, de los que juegas con un café, sin reloj y sin reflejos. Un juego para pensar a tu ritmo.

Nubo es una pequeña nube que reparte el clima. En cada tablero carga agua, decide el camino y entrega cada gota donde hace falta: regar un huerto, cubrir de nieve una ladera, apagar un incendio o llenar un canal. Deslizas el dedo, Nubo avanza una casilla y el paisaje responde.

Y aquí está la gracia: **cada paso cambia el camino**. Un brote regado se convierte en árbol y frena el viento, el frío convierte la lluvia en nieve y el suelo frágil se hunde a tu paso. No basta con llegar a los encargos, hay que pensar en qué orden los haces. Solo caben cuatro gotas, así que cada una cuenta.

Esta vez he cambiado de motor: NUBO está hecho con **Godot 4.7** y GDScript, en vertical, para Android, y funciona entero sin conexión. Más abajo puedes jugar uno de sus repartos sin salir de esta página.

<ul class="cifras">
	<li><span class="cifra__valor">72</span><span class="cifra__etiqueta">repartos en 6 regiones</span></li>
	<li><span class="cifra__valor">23</span><span class="cifra__etiqueta">tipos de casilla</span></li>
	<li><span class="cifra__valor">4</span><span class="cifra__etiqueta">gotas como máximo</span></li>
	<li><span class="cifra__valor">72/72</span><span class="cifra__etiqueta">rutas mínimas verificadas</span></li>
</ul>

<div class="game-download nubo-lanzamiento">
	<img class="nubo-lanzamiento__mascota" src="{{ nubo }}nubo-mascota.webp" alt="" width="180" height="132" loading="lazy">
	<span class="eyebrow">// Muy pronto en Google Play</span>
	<h2>NUBO está a punto de llegar a Android</h2>
	<p>Las dos primeras regiones, 24 repartos, se juegan gratis. El resto se desbloquea con una <strong>compra única</strong>: sin anuncios, sin suscripciones, sin vidas y sin monedas. Mientras llega, Nubo sube repartos nuevos a sus redes. ¡Síguelo para no perderte el lanzamiento!</p>
	{% include nubo-redes.html %}
	<p class="game-download__note">72 repartos · 6 regiones · Sin anuncios · Sin conexión · Español e inglés</p>
</div>

## Así se juega

Las reglas caben en cuatro líneas, y eso era lo primero que quería conseguir:

- **Desliza o toca** una casilla vecina y Nubo avanza una casilla.
- **Llueve** encima de cada encargo hasta cubrir lo que pide.
- **Recarga en los lagos**, pero solo caben cuatro gotas y los lagos se vacían.
- **Deshaz o reinicia** sin límite y sin castigo. Equivocarse aquí sale gratis.

Una estrella basta para avanzar. Las otras dos premian resolver el reparto con las mínimas acciones, por si te apetece volver y pulir tu solución.

<div class="nubo-carrusel js-carrusel">
	<ul class="nubo-carrusel__pista js-carrusel-pista" aria-label="Capturas de NUBO" tabindex="0">
		<li><img src="{{ nubo }}capturas/01-valle.jpg" alt="Puzzle de lógica relajante: un reparto de El valle de las gotas" width="540" height="960" loading="lazy"><span>El valle de las gotas</span></li>
		<li><img src="{{ nubo }}capturas/02-viento.jpg" alt="Sin anuncios y sin internet: un reparto de El bosque del viento" width="540" height="960" loading="lazy"><span>El bosque del viento</span></li>
		<li><img src="{{ nubo }}capturas/03-mundo-03.jpg" alt="Cada paso cambia el camino: un reparto nevado de Las cumbres del deshielo" width="540" height="960" loading="lazy"><span>Las cumbres del deshielo</span></li>
		<li><img src="{{ nubo }}capturas/04-mapa.jpg" alt="72 niveles en 6 regiones: el mapa de repartos" width="540" height="960" loading="lazy"><span>El mapa de repartos</span></li>
		<li><img src="{{ nubo }}capturas/05-jardin.jpg" alt="Decora tu jardín de lluvia con las gotas de tus estrellas" width="540" height="960" loading="lazy"><span>El jardín de lluvia</span></li>
		<li><img src="{{ nubo }}capturas/06-pista.jpg" alt="Pistas que enseñan: el panel de pistas con tres niveles de ayuda" width="540" height="960" loading="lazy"><span>Pistas en tres niveles</span></li>
		<li><img src="{{ nubo }}capturas/07-mundo-06-carga.jpg" alt="Domina la tormenta: un reparto de El taller de las tormentas con el rayo cargado" width="540" height="960" loading="lazy"><span>El taller de las tormentas</span></li>
		<li><img src="{{ nubo }}capturas/08-resultado.jpg" alt="Busca la ruta perfecta: reparto completado con tres estrellas" width="540" height="960" loading="lazy"><span>La ruta perfecta</span></li>
	</ul>
	<div class="nubo-carrusel__mandos">
		<button type="button" class="nubo-carrusel__btn js-carrusel-prev" aria-label="Capturas anteriores">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
		</button>
		<button type="button" class="nubo-carrusel__btn js-carrusel-next" aria-label="Capturas siguientes">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		</button>
	</div>
</div>

## Seis regiones, una regla nueva en cada una

La campaña tiene 72 repartos en seis regiones. Cada una tiene 9 principales y 3 bonus para quien busque un reto más difícil. Y cada región **estrena una regla y la mezcla con las anteriores**, así que el tablero se va complicando sin que tengas que leer un manual.

Hay un orden fijo detrás. En cada región el reparto 01 presenta la regla nueva, el 02 enseña lo que implica y el 03 es el primer pico de dificultad. A partir de ahí las reglas se combinan.

<ul class="nubo-regiones">
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-01.jpg" alt="El valle de las gotas: colinas verdes, cascadas y una casita con huerto" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 1 <em>Gratis</em></span>
			<h3>El valle de las gotas</h3>
			<p>Huertos, lagos que se vacían y brotes que, al regarlos, crecen y cierran el paso.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-02.jpg" alt="El bosque del viento: un bosque otoñal con puentes de piedra y cascadas" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 2 <em>Gratis</em></span>
			<h3>El bosque del viento</h3>
			<p>Corrientes que te arrastran hasta chocar y suelo frágil que se hunde al pisarlo.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-03.jpg" alt="Las cumbres del deshielo: montañas nevadas con ríos helados" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 3</span>
			<h3>Las cumbres del deshielo</h3>
			<p>El frío convierte la lluvia en nieve y el sol la devuelve a su estado. Hay laderas que piden copos.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-04.jpg" alt="El pueblo que respira: un pueblo mediterráneo con fuentes y jardines" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 4</span>
			<h3>El pueblo que respira</h3>
			<p>Chimeneas que ensucian el agua, arboledas que la filtran, pequeños incendios y tierra sedienta.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-05.jpg" alt="El archipiélago del aire: islas flotantes unidas por puentes entre las nubes" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 5</span>
			<h3>El archipiélago del aire</h3>
			<p>Corrientes que suben y bajan a Nubo. Arriba cruzas crestas, pero no puedes llover.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ nubo }}regiones/region-06.jpg" alt="El taller de las tormentas: un taller con norias, canales y engranajes" width="560" height="700" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Región 6</span>
			<h3>El taller de las tormentas</h3>
			<p>Rayos, interruptores, compuertas y canales que guardan el agua para después. Es el gran final.</p>
		</div>
	</li>
</ul>

## Pruébalo: el reparto 02-02

Uno de los repartos más satisfactorios de todo el juego es el segundo del bosque del viento. Se llama ***El huerto de paso*** y es justo ese 02 que enseña lo que implica la regla nueva: **el viento te arrastra por encima de un huerto sin dejarte llover**. Así que a ese huerto hay que volver a pie.

Tienes dos gotas, un lago con otras dos y dos huertos que piden cuatro en total. No sobra ni una. Aquí lo tienes, con las reglas y el arte del juego:

<div class="demo nubo-demo js-demo-nubo" data-arte="{{ nubo }}demo/">
	<div class="demo__cabecera">
		<span class="eyebrow">// Demo jugable</span>
		<h3 class="demo__titulo">02-02 · El huerto de paso</h3>
		<p class="demo__intro">Riega los dos huertos. <strong>Desliza</strong> sobre el tablero o toca una casilla vecina, usa las <strong>flechas</strong> del teclado (con el tablero enfocado) o los botones. Con <strong>Llover</strong> sueltas una gota encima del huerto en el que estás. La ruta mínima son <strong>13 acciones</strong>: ¿la encuentras?</p>
	</div>

	<div class="nubo-demo__hud">
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Agua</span><span class="nd-agua js-agua" role="img"></span></div>
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Acciones</span><span class="nubo-demo__valor js-acciones">0</span></div>
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Huertos</span><span class="nubo-demo__valor js-encargos">0/2</span></div>
	</div>

	<div class="nubo-demo__cielo" style="background-image: url('{{ nubo }}demo/fondo.jpg');">
		<div class="nubo-demo__marco" tabindex="0" role="application" aria-label="Tablero del reparto 02-02. Usa las flechas para mover a Nubo, espacio para llover, Z para deshacer y H para pedir una pista.">
			<svg class="nubo-demo__tablero js-tablero" viewBox="-8 -24 716 574" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
		</div>
		<div class="nd-final js-final" hidden></div>
	</div>

	<p class="nd-mensaje js-mensaje" role="status" aria-live="polite"></p>

	<div class="nubo-demo__mandos">
		<div class="nubo-demo__cruceta" role="group" aria-label="Mover a Nubo">
			<button type="button" class="nd-flecha nd-flecha--n" data-dir="N" aria-label="Mover al norte"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg></button>
			<button type="button" class="nd-flecha nd-flecha--o" data-dir="O" aria-label="Mover al oeste"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button>
			<button type="button" class="nd-flecha nd-flecha--e" data-dir="E" aria-label="Mover al este"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
			<button type="button" class="nd-flecha nd-flecha--s" data-dir="S" aria-label="Mover al sur"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
		</div>
		<div class="nubo-demo__acciones">
			<button type="button" class="btn btn--primary nd-llover js-llover">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5s6.5 7.2 6.5 11.8a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.5 12 2.5Z" /></svg>
				Llover
			</button>
			<button type="button" class="btn btn--ghost btn--small js-deshacer">Deshacer</button>
			<button type="button" class="btn btn--ghost btn--small js-reiniciar">Reiniciar</button>
			<button type="button" class="btn btn--ghost btn--small js-pista">Pista</button>
			<button type="button" class="btn btn--ghost btn--small js-solucion" aria-pressed="false">Ver solución</button>
		</div>
	</div>

	<p class="demo__pie">La pista y la solución no vienen precalculadas: cada vez que las pides, un BFS recorre el reparto desde donde estás. Desde el principio visita <strong class="js-estados">95</strong> estados distintos antes de dar con la ruta de 13 acciones, los mismos que cuenta el motor de referencia del juego.</p>
</div>

<details class="nubo-spoiler">
	<summary>¿Por qué engancha tanto? <span>(contiene pistas)</span></summary>
	<p>Porque el instinto te lleva justo al sitio equivocado. El huerto pequeño está a un paso de la salida y apetece empezar por él, pero <strong>la corriente del oeste es de ida</strong>: en cuanto entras en ella te deja en la esquina izquierda, y desde ahí ya no hay forma de volver al este. Si empiezas por el pequeño, el grande se queda seco para siempre. De los 99 estados a los que se puede llegar en este reparto, 55 ya no tienen salida, y todos están en ese rincón del oeste.</p>
	<p>Así que el orden está obligado: primero el huerto grande, con el lago de por medio, y el pequeño al final. Y cuando por fin vas hacia él, la corriente te pasa por encima sin dejarte llover. Ahí es cuando entiendes el nombre del reparto: el viento te deja en la esquina y el último paso <strong>lo das a pie</strong>, de vuelta hacia el huerto. Ese «¡ah, claro!» es justo lo que busca cada reparto de NUBO.</p>
</details>

## Un solucionador que juega antes que tú

Como en Shadow Maze, la parte que más he disfrutado no se ve. Un juego de puzles tiene un problema muy concreto: **¿cómo sabes que cada nivel tiene solución, y que esa solución es la que crees?** Con 72 repartos y 23 tipos de casilla interactuando, a ojo es imposible.

Así que, antes de abrir Godot, escribí el juego entero como un **motor de reglas en Python**, sin dependencias y sin gráficos: un estado, unas órdenes y una función que dice qué pasa al aplicar una orden a un estado. Y encima, un **BFS** que juega por mí.

La clave está en decidir qué es «un estado». Tiene que guardar todo lo que puede cambiar el futuro, y nada más:

<ul class="nubo-clave" aria-label="Campos de la clave de estado">
	<li><strong>posición</strong><span>dónde está Nubo</span></li>
	<li><strong>agua</strong><span>de 0 a 4 gotas</span></li>
	<li><strong>temperatura</strong><span>lluvia o nieve</span></li>
	<li><strong>calidad</strong><span>limpia o sucia</span></li>
	<li><strong>altura</strong><span>baja o alta</span></li>
	<li><strong>carga</strong><span>con rayo o sin él</span></li>
	<li><strong>compuertas</strong><span>abiertas o cerradas</span></li>
	<li><strong>entregas</strong><span>lo que lleva cada encargo</span></li>
	<li><strong>reservas</strong><span>lo que queda en cada lago</span></li>
	<li><strong>suelo roto</strong><span>losas que ya has pisado</span></li>
</ul>

Fíjate en lo que **no** está: el contador de acciones. Si lo metiera en la clave, llegar al mismo sitio en 5 o en 7 pasos serían estados distintos y la búsqueda se multiplicaría para nada. Tampoco están los árboles, porque se deducen de las gotas que ha recibido cada brote.

Con eso, el solucionador es un BFS de manual. Cada orden válida (moverse, llover o soltar un rayo) cuesta uno, así que **la primera vez que llega a un estado ganador lo hace por la ruta mínima**:

```python

def solve(self, limit=200000):
    start = self.initial()
    cola = deque([start])
    # De dónde vengo y con qué orden: marca los visitados
    # y luego sirve para reconstruir la ruta
    prev = {start: None}

    while cola:
        s = cola.popleft()
        if self.won(s):
            # Ganado: desandamos prev y damos la vuelta a la ruta
            ruta = []
            while prev[s] is not None:
                s, orden = prev[s]
                ruta.append(orden)
            return 'solved', ruta[::-1], len(prev)

        # Norte, este, sur, oeste, llover y rayo, siempre en el mismo orden
        for orden in ['N', 'E', 'S', 'O', 'R', 'Z']:
            n = self.action(s, orden)       # None si la orden no es válida
            if n is not None and n not in prev:
                if len(prev) >= limit:      # llegar al límite no prueba nada
                    return 'incomplete', [], len(prev)
                prev[n] = (s, orden)
                cola.append(n)

    return 'impossible', [], len(prev)

```

Los estados son *dataclasses* inmutables (`frozen=True`), así que sirven directamente de clave en el diccionario. Y como `action` nunca modifica el estado que recibe, deshacer en el juego es tan sencillo como guardar el anterior.

### De Python a Godot, estado a estado

Tener dos motores tiene un riesgo evidente: que no digan lo mismo. Para evitarlo, el motor de Python graba **trazas de paridad**: el estado inicial de cada reparto y el estado después de cada acción de su solución. Son **1.240 estados** que el motor de GDScript tiene que reproducir exactamente, campo a campo.

<ol class="nubo-flujo">
	<li><span class="nubo-flujo__paso">01</span><strong>Campaña en JSON</strong><span>72 mapas con sus encargos, lagos y una solución de referencia</span></li>
	<li><span class="nubo-flujo__paso">02</span><strong>Motor en Python</strong><span>72 de 72 soluciones válidas y mínimas, más 17 casos límite</span></li>
	<li><span class="nubo-flujo__paso">03</span><strong>Trazas de paridad</strong><span>1.240 estados, uno por acción, para cotejar campo a campo</span></li>
	<li><span class="nubo-flujo__paso">04</span><strong>Motor en GDScript</strong><span>el del juego, comprobado en cada push con GitHub Actions</span></li>
</ol>

La demo de arriba es una tercera copia, en JavaScript, de las reglas que usa el reparto 02-02. Le pasé la misma prueba: desde el inicio encuentra la misma ruta de 13 acciones y cuenta los mismos **95 estados** que el motor de referencia.

### El solucionador también mide la dificultad

Una vez tienes el grafo completo de estados, puedes preguntarle mucho más que «¿tiene solución?». Por ejemplo, **qué parte de los estados alcanzables son callejones sin salida**: estados desde los que ya no se puede ganar, por mucho que sigas jugando. Es una medida bastante fiel de lo traicionero que es un reparto.

Con eso, el diseño de la campaña dejó de ser una lista de deseos y se convirtió en reglas comprobables. Las de pago tienen que superar un 20 % de estados sin salida desde su segundo reparto. Los picos 03, 06 y 09 de cada región tienen que crecer, cada bonus tiene que superar a su pico y la media de cada región tiene que superar a la de la anterior. Un script lo comprueba todo con el mismo motor, y si un mapa nuevo rompe la curva, la comprobación falla.

Las estrellas salen del mismo número. Si tu solución iguala la ruta mínima, son tres, y como el BFS garantiza que no hay ninguna más corta, tres estrellas significan haber encontrado la mejor posible. Si te pasas como mucho en el mayor de dos valores, 2 o el 20 % de la ruta mínima, son dos. Si te pasas más, es una. Las pistas nunca quitan estrellas: están para aprender.

## Del boceto al juego

Antes de escribir una línea de interfaz, cada pantalla tuvo su maqueta a tamaño completo: el menú, la partida, el mapa de cada región, las pistas, el resultado… Sirvieron de contrato. La fase de arte consistió en llevarlas al juego real, ajustadas al píxel, con la diferencia de que en el juego todo tiene que funcionar a la vez: textos que cambian de idioma, botones que crecen con el texto grande, tableros de distintos tamaños y TalkBack leyendo cada elemento.

<ul class="nubo-etapas">
	<li>
		<img src="{{ nubo }}evolucion/prototipo-partida.jpg" alt="Demo de la fase 2: tablero funcional con una interfaz provisional" width="470" height="836" loading="lazy">
		<span class="nubo-etapas__paso">01 · Demo jugable</span>
		<p>Las reglas funcionando con una interfaz provisional. Sirvió para probar si resolver un reparto era satisfactorio.</p>
	</li>
	<li>
		<img src="{{ nubo }}evolucion/diseno-partida.jpg" alt="Maqueta del diseño: el reparto 01-04 sobre un tablero flotante en el valle" width="470" height="836" loading="lazy">
		<span class="nubo-etapas__paso">02 · Maqueta</span>
		<p>La pantalla soñada: el tablero flotando sobre el valle, el HUD de gotas y estados y los encargos abajo.</p>
	</li>
	<li>
		<img src="{{ nubo }}evolucion/juego-partida.jpg" alt="El juego final: el reparto 01-04 de El valle de las gotas" width="470" height="836" loading="lazy">
		<span class="nubo-etapas__paso">03 · Juego final</span>
		<p>La misma pantalla en Godot, con el arte de casillas de cada región y todos los estados en vivo.</p>
	</li>
</ul>

Desliza para comparar cada maqueta con la pantalla final del juego:

<div class="nubo-comparador js-comparador">
	<div class="nubo-comparador__pestanas" role="group" aria-label="Pantalla a comparar">
		<button type="button" data-par="partida" aria-pressed="true" data-pie="El valle de las gotas, 01-04. La maqueta fijó la composición; el juego añade los contadores reales y las variantes de césped.">Partida</button>
		<button type="button" data-par="viento" aria-pressed="false" data-pie="El bosque del viento. Las flechas de corriente y el suelo frágil pasaron de la maqueta al arte regional de casillas.">Bosque</button>
		<button type="button" data-par="mapa" aria-pressed="false" data-pie="El mapa de repartos: seis regiones en tarjetas, con su progreso y el acceso a la compra única.">Mapa</button>
		<button type="button" data-par="pistas" aria-pressed="false" data-pie="El panel de pistas en tres niveles: recordar la regla, destacar una casilla y ver el siguiente paso.">Pistas</button>
		<button type="button" data-par="taller" aria-pressed="false" data-pie="El taller de las tormentas: la carga del rayo, las compuertas y el botón de rayo aparecen solo cuando hacen falta.">Taller</button>
		<button type="button" data-par="resultado" aria-pressed="false" data-pie="El resultado: estrellas, acciones frente a la ruta óptima, el sello sin pistas y las gotas para el jardín.">Resultado</button>
	</div>
	<div class="nubo-comparador__marco js-comparador-marco" style="--corte: 50%;">
		<img class="nubo-comparador__despues js-comparador-despues" data-base="{{ nubo }}evolucion/" src="{{ nubo }}evolucion/juego-partida.jpg" alt="Juego final: Partida" width="470" height="836" loading="lazy" draggable="false">
		<img class="nubo-comparador__antes js-comparador-antes" data-base="{{ nubo }}evolucion/" src="{{ nubo }}evolucion/diseno-partida.jpg" alt="Diseño inicial: Partida" width="470" height="836" loading="lazy" draggable="false">
		<span class="nubo-comparador__etiqueta nubo-comparador__etiqueta--antes" aria-hidden="true">Maqueta</span>
		<span class="nubo-comparador__etiqueta nubo-comparador__etiqueta--despues" aria-hidden="true">Juego</span>
		<span class="nubo-comparador__linea" aria-hidden="true"></span>
	</div>
	<label class="nubo-comparador__control">
		<span class="visually-hidden">Proporción entre maqueta y juego</span>
		<input class="js-comparador-rango" type="range" min="0" max="100" value="50">
	</label>
	<p class="nubo-comparador__pie js-comparador-pie">El valle de las gotas, 01-04. La maqueta fijó la composición; el juego añade los contadores reales y las variantes de césped.</p>
</div>

El icono pasó por lo mismo. Hubo tres candidatos: Nubo con una gota, con un brote y con un rayo, y los tres se probaron recortados con las máscaras de Android a 192, 96 y 48 píxeles. El brote se emborronaba a 48 píxeles y el rayo ataba la identidad a la última región. Ganó la gota: es lo que Nubo hace en todos los repartos y su silueta se sigue leyendo en el tamaño más pequeño.

<ul class="nubo-iconos">
	<li class="nubo-iconos__elegido"><img src="{{ nubo }}iconos/propuesta-01-gota.jpg" alt="Propuesta de icono con una gota, la elegida" width="240" height="240" loading="lazy"><span>La gota · elegida</span></li>
	<li><img src="{{ nubo }}iconos/propuesta-02-jardin.jpg" alt="Propuesta de icono con un brote" width="240" height="240" loading="lazy"><span>El brote</span></li>
	<li><img src="{{ nubo }}iconos/propuesta-03-rayo.jpg" alt="Propuesta de icono con un rayo" width="240" height="240" loading="lazy"><span>El rayo</span></li>
</ul>

## Pensado para jugar tranquilo

Todo lo que rodea a los puzzles va en la misma dirección: que nada te meta prisa y que nadie te venda atajos.

<ul class="nubo-rasgos">
	<li><strong>Pistas que enseñan</strong><span>Tres niveles: recordar la regla, señalar una casilla o mostrar el siguiente paso, calculado desde donde estás. Usarlas no quita estrellas.</span></li>
	<li><strong>Deshacer sin límite</strong><span>Todo el historial se guarda tras cada acción, incluso si cierras el juego a mitad de un reparto.</span></li>
	<li><strong>Tu jardín de lluvia</strong><span>Cada estrella te da una gota para decorar un jardín que enseña a cuidar el agua y atrae fauna. Las gotas nunca se compran.</span></li>
	<li><strong>Accesible</strong><span>Compatible con TalkBack, con controles por botones, texto grande y movimiento reducido. Las reglas se leen con símbolos, no solo con color.</span></li>
	<li><strong>Sin anuncios y sin conexión</strong><span>Una compra única desbloquea las cuatro últimas regiones y no da agua extra ni acorta ningún nivel.</span></li>
	<li><strong>17 logros</strong><span>Con progreso en la nube gracias a Google Play Juegos. Sin Play Juegos, el juego funciona exactamente igual.</span></li>
</ul>

<div class="icon-row nubo-logros">
	<img src="{{ nubo }}logros/first_drop.jpg" alt="Logro Primera gota" title="Primera gota" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/region_1.jpg" alt="Logro Valle en flor" title="Valle en flor" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/region_2.jpg" alt="Logro Viento a favor" title="Viento a favor" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/region_3.jpg" alt="Logro Cumbres despejadas" title="Cumbres despejadas" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/hintless.jpg" alt="Logro Sin pistas" title="Sin pistas" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/perfect_region.jpg" alt="Logro Región perfecta" title="Región perfecta" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/all_bonus.jpg" alt="Logro Maestro del clima" title="Maestro del clima" width="144" height="144" loading="lazy">
	<img src="{{ nubo }}logros/all_stars.jpg" alt="Logro Cielo estrellado" title="Cielo estrellado" width="144" height="144" loading="lazy">
</div>

## El tráiler

Treinta segundos para verlo en movimiento:

<div class="nubo-video js-video" data-video="Eyk3vxBM7uQ">
	<a class="nubo-video__enlace" href="https://youtu.be/Eyk3vxBM7uQ" target="_blank" rel="noopener noreferrer">
		<img src="{{ nubo }}trailer-portada.jpg" alt="Fotograma del tráiler de NUBO: «Reparte la lluvia», El valle de las gotas" width="960" height="540" loading="lazy">
		<span class="nubo-video__texto">Ver el tráiler en YouTube</span>
	</a>
	<button type="button" class="nubo-video__play" aria-label="Reproducir el tráiler de NUBO">
		<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
	</button>
</div>

<div class="game-download nubo-cierre">
	<span class="eyebrow">// Sigue a Nubo</span>
	<h2>Un reparto nuevo en tus redes</h2>
	<p>Nubo publica en vídeo repartos reales del juego. Síguelo en tu red favorita y entérate el primero de cuándo llega a Google Play.</p>
	{% include nubo-redes.html %}
	<p class="game-download__note">¿Dudas sobre tus datos o sobre la compra? Están explicadas en la <a href="{{ '/privacidad/' | relative_url }}">política de privacidad</a> y en las <a href="{{ '/terminos/' | relative_url }}">condiciones de servicio</a>.</p>
</div>

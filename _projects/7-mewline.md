---
inicio: "2026-10-25"  # año-mes de inicio (con día, para quedar por delante de NUBO, del mismo mes)
tarjeta: tarjetas/mewline.jpg  # imagen 2:1 de las tarjetas del listado y la portada
layout: project
title: Mewline
description: Mewline es un puzle de lógica tranquilo para Android hecho con Godot. Una gata desenrolla un ovillo que tiene que cubrir todas las baldosas pasando por los números en orden, y un backtracking demuestra que cada uno de sus 180 niveles tiene una sola solución. Incluye una demo jugable.
technologies: [Godot 4.7, GDScript, Backtracking, Android, AdMob, Google Play Billing, Play Juegos]
thumbnail: mewline/portada.jpg
image: mewline/portada.jpg
fuentes:
  - https://fonts.googleapis.com/css2?family=Grandstander:wght@800&display=swap
scripts:
  - /assets/js/demo-mewline.js
  - /assets/js/nubo-pagina.js
---

{% assign mw = '/assets/images/projects/mewline/' | relative_url %}

Si NUBO va de decidir en qué orden repartes la lluvia, **Mewline** va de algo todavía más sencillo de explicar: un hilo de lana, unos números y un tablero que hay que cubrir entero. Es de esos puzles de lógica que juegas en un rato muerto, con partidas de uno a tres minutos.

Mango es una gata naranja atigrada, curiosa y un poco torpe, que se pasa el día desenrollando ovillos por la casa. Arrastras el dedo desde el 1 y el hilo te sigue: tiene que pasar por **todas las baldosas**, visitar los números **en orden** y terminar en el último.

La gracia está en que cada tablero tiene **una única solución, y se llega a ella pensando, nunca adivinando**. Aquí no hay vidas ni derrota: si te equivocas, vuelves por el hilo, lo recoges y sigues. Lo que aprieta son el reloj y las estrellas.

Como NUBO, está hecho con **Godot 4.7** y GDScript, en vertical y para Android. Más abajo puedes jugar uno de sus niveles sin salir de esta página.

<ul class="cifras">
	<li><span class="cifra__valor">180</span><span class="cifra__etiqueta">niveles en 6 habitaciones</span></li>
	<li><span class="cifra__valor">5</span><span class="cifra__etiqueta">objetos de la casa</span></li>
	<li><span class="cifra__valor">10</span><span class="cifra__etiqueta">gatas para elegir</span></li>
	<li><span class="cifra__valor">180/180</span><span class="cifra__etiqueta">soluciones únicas comprobadas</span></li>
</ul>

<div class="game-download mw-lanzamiento">
	<img class="mw-lanzamiento__mascota" src="{{ mw }}mango-ovillo.webp" alt="" width="180" height="224" loading="lazy">
	<span class="eyebrow">// Android</span>
	<h2>Próximamente en Google Play</h2>
	<p class="game-download__note">Gratis · Sin anuncios forzados · Sin conexión · Español e inglés</p>
</div>

## Así se juega

Las reglas son cuatro:

- **Empieza en el 1** y arrastra el hilo a las baldosas vecinas, sin diagonales.
- **No se cruza**: el hilo no puede pasar dos veces por la misma baldosa.
- **Los números van en orden**, y el hilo termina en el último.
- **Cubre todo el tablero.** Si te equivocas, vuelve por el hilo para recogerlo o toca un punto para cortarlo ahí.

Cada nivel da hasta tres estrellas: una por completarlo, dos si es sin pistas y tres si además lo haces en el tiempo objetivo. Las estrellas nunca bloquean nada: para avanzar basta con completar el nivel.

<div class="nubo-carrusel mw-carrusel js-carrusel">
	<ul class="nubo-carrusel__pista js-carrusel-pista" aria-label="Capturas de Mewline" tabindex="0">
		<li><img src="{{ mw }}capturas/01.jpg" alt="Pantalla de inicio de Mewline: Mango dormida sobre el ovillo, el botón Jugar, el reto diario y el modo libre" width="540" height="1200" loading="lazy"><span>El inicio</span></li>
		<li><img src="{{ mw }}capturas/02.jpg" alt="Nivel 40 de la cocina, con el hilo a medias y dos muebles en el tablero" width="540" height="1200" loading="lazy"><span>La cocina</span></li>
		<li><img src="{{ mw }}capturas/03.jpg" alt="Nivel completado con tres estrellas y tres regalos: una pista, un color de lana y la gata siamesa" width="540" height="1200" loading="lazy"><span>Tres estrellas y regalos</span></li>
		<li><img src="{{ mw }}capturas/04.jpg" alt="El mapa de la casa, con el salón a medias y el adelanto de lo que trae cada habitación cerrada" width="540" height="1200" loading="lazy"><span>La casa de Mango</span></li>
		<li><img src="{{ mw }}capturas/05.jpg" alt="Nivel 125 del jardín, con dos ovillos de colores y sus propios números" width="540" height="1200" loading="lazy"><span>El jardín: dos gatas</span></li>
		<li><img src="{{ mw }}capturas/06.jpg" alt="Nivel 160 del desván, con baldosas oscuras que esconden lo que hay debajo" width="540" height="1200" loading="lazy"><span>El desván a oscuras</span></li>
		<li><img src="{{ mw }}capturas/07.jpg" alt="El reto diario: el calendario del mes, la racha y el resultado de hoy para compartir" width="540" height="1200" loading="lazy"><span>El reto diario</span></li>
		<li><img src="{{ mw }}capturas/08.jpg" alt="La tienda de gatas: Mango, la siamesa, la bengalí, la calicó y más" width="540" height="1200" loading="lazy"><span>Las gatas</span></li>
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

## Seis habitaciones, un objeto nuevo en cada una

La campaña es la casa de Mango, habitación por habitación. Cada una es un mundo de 30 niveles con su decorado y **un objeto nuevo que cambia la regla**. Llega con dos o tres niveles muy fáciles para presentarlo y después se mezcla con todo lo anterior.

Dentro de cada habitación la dificultad sube en dientes de sierra: cuatro niveles que aprietan y uno de respiro. El 30 es un jefe, más grande que los demás, y al terminarlo Mango se queda dormida en esa habitación.

<ul class="nubo-regiones mw-habitaciones">
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-01.jpg" alt="El salón: Mango dormida sobre el ovillo junto al sofá lila" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 1 <em>4×4 → 6×6</em></span>
			<h3>El salón</h3>
			<p>Solo la regla: números en orden y todas las baldosas cubiertas.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-02.jpg" alt="La cocina: Mango dormida sobre el ovillo entre muebles lilas y una mesa con mantel de cuadros" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 2 <em>5×5 → 6×6</em></span>
			<h3>La cocina</h3>
			<p>Muebles: cortan el paso entre dos baldosas y obligan a rodearlos.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-03.jpg" alt="El dormitorio: Mango dormida sobre el ovillo en una alfombra junto a la cama" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 3 <em>6×6 → 7×7</em></span>
			<h3>El dormitorio</h3>
			<p>Cojines: el hilo los cruza recto, sin girar encima.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-04.jpg" alt="El baño: Mango dormida sobre el ovillo junto a la bañera" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 4 <em>6×6 → 7×7</em></span>
			<h3>El baño</h3>
			<p>Rascadores: lo contrario del cojín. Encima, el hilo tiene que girar.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-05.jpg" alt="El jardín: Mango dormida sobre el ovillo en un patio con flores al atardecer" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 5 <em>7×7 → 8×8</em></span>
			<h3>El jardín</h3>
			<p>Dos gatas: dos ovillos, cada uno con sus números, que no se pueden cruzar.</p>
		</div>
	</li>
	<li class="nubo-region">
		<img src="{{ mw }}habitaciones/habitacion-06.jpg" alt="El desván: Mango dormida sobre el ovillo bajo una ventana redonda" width="560" height="560" loading="lazy">
		<div class="nubo-region__texto">
			<span class="nubo-region__num">Habitación 6 <em>7×7 → 9×9</em></span>
			<h3>El desván</h3>
			<p>Baldosas oscuras: esconden lo que hay debajo hasta que el hilo pasa al lado.</p>
		</div>
	</li>
</ul>

Además de la campaña, hay un **reto diario** igual para todo el mundo y un **modo libre** con tableros infinitos de 5×5 a 9×9 que mezclan los objetos que ya conoces.

## Pruébalo: el nivel 44

En la cocina hay un nivel que me gusta especialmente. Es un 5×5 con solo **cinco números** y cuatro muebles, así que casi todo el camino lo tienes que deducir tú. Y el primer paso ya esconde una trampa.

Aquí lo tienes, con las reglas, los mensajes y el arte del juego:

<div class="demo mw-demo js-demo-mewline" data-arte="{{ mw }}demo/">
	<div class="demo__cabecera">
		<span class="eyebrow">// Demo jugable</span>
		<h3 class="demo__titulo">Nivel 44 · La cocina</h3>
		<p class="demo__intro">Une los números del 1 al 5 y cubre las 25 baldosas. <strong>Arrastra</strong> desde el 1. Para corregir, vuelve por el hilo o toca un punto para cortarlo ahí. También puedes usar las <strong>flechas</strong> del teclado con el tablero enfocado. Para la tercera estrella: sin pistas y en <strong>19 segundos</strong>.</p>
	</div>

	<div class="nubo-demo__hud mw-demo__hud">
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Tiempo</span><span class="nubo-demo__valor js-tiempo">0:00</span></div>
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Por cubrir</span><span class="nubo-demo__valor js-quedan">25</span></div>
		<div class="nubo-demo__dato"><span class="nubo-demo__rotulo">Pistas</span><span class="nubo-demo__valor js-pistas">0</span></div>
	</div>

	<div class="mw-demo__cocina" style="background-image: url('{{ mw }}demo/fondo.jpg');">
		<div class="mw-demo__marco" tabindex="0" role="application" aria-label="Tablero del nivel 44, de 5 por 5. Usa las flechas para llevar el hilo, la tecla Z para deshacer y la H para pedir una pista.">
			<svg class="mw-demo__tablero js-tablero" viewBox="-14 -40 528 554" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
		</div>
		<div class="mw-final js-final" hidden></div>
	</div>

	<p class="mw-mensaje js-mensaje" role="status" aria-live="polite"></p>

	<div class="mw-demo__acciones">
		<button type="button" class="btn btn--ghost btn--small js-deshacer">Deshacer</button>
		<button type="button" class="btn btn--ghost btn--small js-reiniciar">Reiniciar</button>
		<button type="button" class="btn btn--ghost btn--small js-pista">Pista</button>
		<button type="button" class="btn btn--ghost btn--small js-solucion" aria-pressed="false">Ver solución</button>
	</div>

	<p class="demo__pie">La solución no viene guardada en la página. Al cargarla, un backtracking con la misma poda que el solucionador del juego la busca y demuestra que es la única. Para ello explora <strong class="js-nodos">51</strong> nodos, los mismos que cuenta el de Godot en este nivel.</p>
</div>

<details class="nubo-spoiler">
	<summary>¿Dónde está la trampa? <span>(contiene pistas)</span></summary>
	<p>El 2 está a dos baldosas del 1, a la izquierda, y apetece ir directo a por él. Pero fíjate en la baldosa que hay <strong>justo encima del 1</strong>: tiene un mueble a cada lado, así que solo se puede entrar en ella desde arriba o desde el propio 1.</p>
	<p>Si no la pisas al empezar, el día que llegues desde arriba ya no podrás salir: sería un callejón sin salida, y el único sitio donde el hilo puede terminar es el 5. Así que <strong>el primer paso está obligado: hacia arriba</strong>, y el segundo también. Es exactamente la regla que usa el solucionador para descartar caminos, y es la que hace que el nivel tenga una sola solución con tan pocos números.</p>
</details>

## Un solucionador que demuestra que solo hay un camino

Como en Shadow Maze y en NUBO, lo que más he disfrutado no se ve. El problema de un puzle como este es muy concreto: **¿cómo sabes que cada tablero tiene una sola solución?** Si tuviera dos, el jugador podría llegar a la «otra» y el juego no la aceptaría, o habría que adivinar en algún punto. Con 180 niveles, un reto al día y un modo libre infinito, a ojo es imposible.

Mewline empezó como un prototipo en una sola página web, con su generador y su solucionador. Lo primero que hice al pasar a Godot fue portarlos a GDScript, y las pruebas comprueban que con la misma semilla salen exactamente los mismos tableros. La demo de arriba es el viaje de vuelta: el mismo solucionador, otra vez en JavaScript.

El solucionador es un **backtracking**: desde el 1, prueba cada vecina libre, avanza y, si se atasca, deshace el paso y prueba la siguiente. Contado así explotaría enseguida, porque un 7×7 tiene una cantidad enorme de caminos. Lo que lo hace viable es la **poda**: después de cada paso mira el tablero que queda y descarta la rama en cuanto es imposible terminarla, aunque aún falten veinte baldosas.

<div class="figura">
	<div class="figura__lienzo">
		<ul class="mw-poda">
			<li><svg viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Callejón: el hilo sale del 1 hacia la derecha y baja, y deja la esquina de arriba a la izquierda con una sola vecina libre."><rect class="mwf-alerta" x="4" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="100" width="20" height="20" rx="4"/><polyline class="mwf-hilo" points="38,14 62,14 62,38"/><circle class="mwf-num mwf-num--hecho" cx="38" cy="14" r="8.5"/><text class="mwf-num-texto" x="38" y="18.5" text-anchor="middle">1</text><circle class="mwf-num" cx="110" cy="110" r="8.5"/><text class="mwf-num-texto" x="110" y="114.5" text-anchor="middle">2</text></svg><div class="mw-poda__texto"><strong>Callejón</strong><span>Una baldosa libre con una sola salida tiene que ser el final del hilo. Si no es el último número, la rama se descarta.</span></div></li>
			<li><svg viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Isla: el hilo baja recto por la columna del centro y parte las baldosas libres en dos grupos que ya no se tocan."><rect class="mwf-alerta" x="4" y="4" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="28" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="4" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="4" y="28" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="28" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="28" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="4" y="52" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="28" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="52" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="4" y="76" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="28" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="76" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="4" y="100" width="20" height="20" rx="4"/><rect class="mwf-alerta" x="28" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="100" width="20" height="20" rx="4"/><polyline class="mwf-hilo" points="62,14 62,38 62,62 62,86 62,110"/><circle class="mwf-num mwf-num--hecho" cx="62" cy="14" r="8.5"/><text class="mwf-num-texto" x="62" y="18.5" text-anchor="middle">1</text><circle class="mwf-num" cx="110" cy="110" r="8.5"/><text class="mwf-num-texto" x="110" y="114.5" text-anchor="middle">2</text></svg><div class="mw-poda__texto"><strong>Isla</strong><span>Las baldosas libres tienen que seguir unidas. Si el hilo las parte en dos grupos, nunca podrá volver a por uno de ellos.</span></div></li>
			<li><svg viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fuera de orden: el hilo va del 1 hacia el 3 sin haber pasado por el 2, y ese paso se descarta."><rect class="mwf-baldosa" x="4" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="4" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="28" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="52" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="76" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="4" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="28" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="52" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="76" y="100" width="20" height="20" rx="4"/><rect class="mwf-baldosa" x="100" y="100" width="20" height="20" rx="4"/><polyline class="mwf-hilo" points="14,14 38,14"/><line class="mwf-salto" x1="38" y1="14" x2="38" y2="38"/><path class="mwf-cruz" d="M33 21l10 10M43 21l-10 10"/><circle class="mwf-num mwf-num--hecho" cx="14" cy="14" r="8.5"/><text class="mwf-num-texto" x="14" y="18.5" text-anchor="middle">1</text><circle class="mwf-num" cx="38" cy="38" r="8.5"/><text class="mwf-num-texto" x="38" y="42.5" text-anchor="middle">3</text><circle class="mwf-num" cx="86" cy="62" r="8.5"/><text class="mwf-num-texto" x="86" y="66.5" text-anchor="middle">2</text></svg><div class="mw-poda__texto"><strong>Fuera de orden</strong><span>Un número solo se pisa cuando le toca, y el último solo cuando ya está todo cubierto.</span></div></li>
		</ul>
	</div>
	<p class="figura__pie">Las tres podas del solucionador. En ámbar, lo que hace imposible terminar el tablero desde ahí.</p>
</div>

Con eso, el generador es sencillo. Primero saca un camino aleatorio que cubre todo el tablero. Parte de un zigzag y le aplica miles de **backbites**: une un extremo del camino con una baldosa vecina e invierte el tramo de en medio, de modo que sigue pasando por todas. Después pone un número cada pocos pasos y le pregunta al solucionador:

```gdscript

# Pone números a lo largo de `path` hasta que la solución sea única.
# Simplificado de generator.gd: sin cojines, rascadores
# ni búsquedas abortadas.
static func _place_numbers(path, neighbors, gap, rng):
    # El 1 y el último, siempre; luego uno cada `gap` pasos, más o menos uno.
    var indices := {0: true, path.size() - 1: true}
    var i := gap
    while i < path.size() - 1:
        indices[mini(path.size() - 2, i + rng.next_int(3) - 1)] = true
        i += gap
    for _try in MAX_TRIES_PER_PATH:
        var sorted := indices.keys()
        sorted.sort()
        var checkpoints := PackedInt32Array()
        for index in sorted:
            checkpoints.append(path[index])
        # Con 2 soluciones basta para saber que no es única.
        var result := Solver.solve(neighbors, checkpoints, 2)
        if result.solutions.size() == 1:
            return checkpoints
        # Hay otra: un número justo donde se separa del camino bueno.
        var alt := _first_different(result.solutions, path)
        var d := 0
        while alt[d] == path[d]:
            d += 1
        indices[mini(path.size() - 2, d + rng.next_int(2))] = true
    return PackedInt32Array()  # se prueba con otro camino

```

Cada vez que el solucionador encuentra una segunda solución, el generador pone un número justo en la baldosa donde se separa del camino bueno, y vuelve a preguntar. Los muebles se colocan en uniones que el camino no usa, así que nunca rompen la solución. Con ellos el tablero se resuelve con unos dos números menos, porque las paredes ya descartan caminos.

### Al revés para los tableros grandes

En 8×8 y 9×9 ese método se ahoga: cada pregunta al solucionador cuesta millones de pasos, y un 9×9 podía tardar minutos o no salir nunca. Así que para los grandes lo hago al revés: pongo **un número cada tres pasos**, añado los que falten hasta que la solución sea única y luego **los voy quitando al azar** mientras siga siéndolo, sin bajar de una sexta parte de las baldosas. Un 9×9 sale ahora en unos 3 segundos en el PC.

También aceleré el solucionador, con una condición que no podía saltarme: **explorar exactamente los mismos nodos, en el mismo orden**. Si cambiaba un solo nodo, cambiarían los tableros generados y el reto diario dejaría de ser el mismo en todos los móviles. Así que las optimizaciones solo abaratan cada nodo: llevar la cuenta de vecinas libres en vez de recontarlas, revisar solo las baldosas que el último paso puede haber cambiado y comprobar la conexión cerca de la cabeza del hilo en vez de recorrer todo el tablero. Una prueba lo compara con el port original, y un 8×8 ha pasado de 165 a 27 segundos.

### Dos gatas, un solo camino

En el jardín hay dos ovillos que no se pueden cruzar y que entre los dos cubren el tablero. Podría haber escrito un solucionador nuevo, pero hay un truco más barato: una **baldosa puente** que no existe en el tablero y que solo toca el último número del primer hilo y el 1 del segundo. Con ella, los dos hilos son un único camino, y el solucionador, el generador y la puntuación de dificultad funcionan sin cambiar una línea. Una prueba compara el resultado con una búsqueda a mano de todos los pares de hilos.

### La dificultad, en números

El mismo solucionador sirve para medir. La dificultad de un tablero suma su tamaño, la distancia media y máxima entre números, cada objeto de la casa y, sobre todo, **cuántos nodos necesita el solucionador para demostrar que la solución es única**, empezando por el 1 y también por el final. Va de unos 8 puntos en un 4×4 lleno de números a unos 90 en el jefe del desván.

Con esa nota se monta la campaña: los niveles se generan por lotes en el ordenador y, para cada hueco de la curva, se elige el tablero que más se acerca a la dificultad buscada. Una prueba comprueba que los 180 tienen solución única, que la curva hace sus dientes de sierra y que el jefe es siempre el más difícil de su habitación.

El tiempo de la tercera estrella sale del mismo número. En partidas cronometradas de los primeros niveles, el tiempo crece de forma **exponencial** con la dificultad: unos 4 segundos en dificultad 10, 10 en 25 y 25 en 42. El objetivo es ese tiempo con un margen de 1,5, y nunca menos de 8 segundos. Por eso el nivel 44, con 29,9 puntos, pide 19.

## El reto diario, sin servidor

Cada día hay un tablero nuevo, el mismo para todo el mundo, y no hay ningún servidor detrás. **La semilla sale de la fecha** y el generador es determinista, así que cualquier móvil llega al mismo tablero por su cuenta. Para no hacer esperar a nadie, los retos del año ya van generados y validados dentro de la app.

La dificultad sube durante la semana, como en el crucigrama del New York Times:

<ul class="mw-semana" aria-label="Tamaño del reto diario según el día de la semana">
	<li><span class="mw-semana__dia">Lun</span><span class="mw-semana__rejilla" style="--n: 5" aria-hidden="true">{% for i in (1..25) %}<i></i>{% endfor %}</span><strong>5×5</strong></li>
	<li><span class="mw-semana__dia">Mar</span><span class="mw-semana__rejilla" style="--n: 5" aria-hidden="true">{% for i in (1..25) %}<i></i>{% endfor %}</span><strong>5×5</strong></li>
	<li><span class="mw-semana__dia">Mié</span><span class="mw-semana__rejilla" style="--n: 6" aria-hidden="true">{% for i in (1..36) %}<i></i>{% endfor %}</span><strong>6×6</strong></li>
	<li><span class="mw-semana__dia">Jue</span><span class="mw-semana__rejilla" style="--n: 6" aria-hidden="true">{% for i in (1..36) %}<i></i>{% endfor %}</span><strong>6×6</strong></li>
	<li><span class="mw-semana__dia">Vie</span><span class="mw-semana__rejilla" style="--n: 7" aria-hidden="true">{% for i in (1..49) %}<i></i>{% endfor %}</span><strong>7×7</strong></li>
	<li><span class="mw-semana__dia">Sáb</span><span class="mw-semana__rejilla" style="--n: 7" aria-hidden="true">{% for i in (1..49) %}<i></i>{% endfor %}</span><strong>7×7</strong></li>
	<li class="mw-semana--domingo"><span class="mw-semana__dia">Dom</span><span class="mw-semana__rejilla" style="--n: 8" aria-hidden="true">{% for i in (1..64) %}<i></i>{% endfor %}</span><strong>8×8</strong></li>
</ul>

El domingo es un 8×8 con ocho muebles. Alrededor del reto hay una racha, un calendario del mes para recuperar los días que se te pasaron y un regalo por cada semana y cada mes completos. Los tiempos van a una clasificación de Play Juegos, que se encarga de apartar los sospechosos, y el resultado se comparte con una imagen que enseña el tablero **sin la solución**, para no destripárselo a nadie.

## Diez gatas y seis lanas

Mango es la protagonista, pero no está sola. La siamesa se gana al terminar el salón y el resto esperan en la tienda. La gata elegida sale en el tablero, en la celebración y en la imagen que compartes.

<ul class="mw-gatas">
	<li><img src="{{ mw }}gatas/mango.webp" alt="" width="220" height="220" loading="lazy"><span>Mango</span></li>
	<li><img src="{{ mw }}gatas/siamese.webp" alt="" width="220" height="220" loading="lazy"><span>Siamesa</span></li>
	<li><img src="{{ mw }}gatas/bengal.webp" alt="" width="220" height="220" loading="lazy"><span>Bengalí</span></li>
	<li><img src="{{ mw }}gatas/calico.webp" alt="" width="220" height="220" loading="lazy"><span>Calicó</span></li>
	<li><img src="{{ mw }}gatas/blue.webp" alt="" width="220" height="220" loading="lazy"><span>Gris azulada</span></li>
	<li><img src="{{ mw }}gatas/white.webp" alt="" width="220" height="220" loading="lazy"><span>Blanca con manchas</span></li>
	<li><img src="{{ mw }}gatas/tabby.webp" alt="" width="220" height="220" loading="lazy"><span>Atigrada parda</span></li>
	<li><img src="{{ mw }}gatas/tortie.webp" alt="" width="220" height="220" loading="lazy"><span>Carey</span></li>
	<li><img src="{{ mw }}gatas/cream.webp" alt="" width="220" height="220" loading="lazy"><span>Crema</span></li>
	<li><img src="{{ mw }}gatas/silver.webp" alt="" width="220" height="220" loading="lazy"><span>Plateada</span></li>
</ul>

Las lanas cambian el color del hilo, de las baldosas que recorre y de los números que pisa. Las estrellas regalan las primeras:

<ul class="mw-lanas" aria-label="Colores de lana">
	<li><i style="--lana: #d2386c"></i>Frambuesa</li>
	<li><i style="--lana: #1f937b"></i>Menta</li>
	<li><i style="--lana: #3270cc"></i>Azul cielo</li>
	<li><i style="--lana: #b57c0c"></i>Mostaza</li>
	<li><i style="--lana: #8253c6"></i>Lila</li>
	<li><i style="--lana: #5e9420"></i>Pistacho</li>
</ul>

## Pensado para ratos tranquilos

Todo lo que rodea a los tableros va en la misma dirección: que nada te meta prisa y que nada salte sin que lo pidas.

<ul class="nubo-rasgos">
	<li><strong>Sin vidas ni derrota</strong><span>Un camino equivocado se corrige recogiendo hilo. La tensión la ponen el reloj y las estrellas, nunca un castigo.</span></li>
	<li><strong>Pistas con huellas</strong><span>Una pista enseña los tres pasos siguientes y, si te habías equivocado, recoge el hilo hasta el último paso bueno.</span></li>
	<li><strong>Anuncios solo si los pides</strong><span>Un vídeo a cambio de una pista, como mucho diez al día. Ni banners ni anuncios al terminar un nivel.</span></li>
	<li><strong>La casa no se vende</strong><span>Todas las habitaciones se juegan gratis. Lo que se compra son ayudas y aspecto: pistas, gatas y lanas.</span></li>
	<li><strong>Sin conexión</strong><span>Todo funciona sin internet, salvo los vídeos, las compras y la clasificación. El progreso viaja en la nube con Play Juegos.</span></li>
	<li><strong>Para todos los ojos</strong><span>Tema claro y oscuro, alto contraste y vibración ajustable.</span></li>
</ul>

## El tráiler

Treinta segundos para verlo en movimiento. Lo graba el propio juego: el Movie Maker de Godot captura una partida real fotograma a fotograma, y la música, un lo-fi corto, también está compuesta por código.

<div class="nubo-video js-video" data-video="koyr8ny0DEs">
	<a class="nubo-video__enlace" href="https://youtu.be/koyr8ny0DEs" target="_blank" rel="noopener noreferrer">
		<img src="{{ mw }}trailer-portada.jpg" alt="Fotograma del tráiler de Mewline: «…y cubre todo el tablero», con Mango saltando sobre un tablero resuelto" width="960" height="540" loading="lazy">
		<span class="nubo-video__texto">Ver el tráiler en YouTube</span>
	</a>
	<button type="button" class="nubo-video__play" aria-label="Reproducir el tráiler de Mewline">
		<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
	</button>
</div>

<div class="game-download nubo-cierre">
	<span class="eyebrow">// Muy pronto</span>
	<h2>Mango ya tiene el ovillo preparado</h2>
	<p>Mewline llegará muy pronto a Google Play.</p>
	<p class="game-download__note">¿Dudas sobre tus datos, los anuncios o las compras? Están explicadas en la <a href="{{ '/privacidad/' | relative_url }}">política de privacidad</a>.</p>
</div>

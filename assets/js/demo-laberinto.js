/* =============================================================
 *  javiercanadilla.com — demo de excavación por backtracking
 *
 *  Ejecuta el mismo bucle que explica la página de Shadow Maze:
 *  una pila explícita, las vecinas a dos celdas, se tira el muro
 *  de en medio y se avanza; y cuando no queda ninguna candidata,
 *  se retrocede.
 *
 *  El dibujo es SVG y no lleva un solo color propio: pinta por
 *  clase, igual que las figuras del artículo, así que el modo
 *  claro y el oscuro salen gratis.
 * ============================================================= */
(function () {
	'use strict';

	var raiz = document.querySelector('.js-demo-laberinto');
	if (!raiz) { return; }

	var NS = 'http://www.w3.org/2000/svg';

	// Pasos por segundo en cada posición del mando de velocidad.
	var RITMOS = [4, 12, 32, 90, 240];
	// Tope de pasos por fotograma: sin él, una pestaña que vuelve del
	// segundo plano intentaría ponerse al día de golpe.
	var TOPE_POR_FOTOGRAMA = 24;
	// Las cuatro vecinas están a dos celdas; entre medias queda el muro.
	var DIRECCIONES = [[0, -1], [1, 0], [0, 1], [-1, 0]];

	// ---------------------------------------------- piezas del DOM

	var svg       = raiz.querySelector('.js-lienzo');
	var columna   = raiz.querySelector('.js-pila');
	var traza     = raiz.querySelector('.js-traza');
	var anuncio   = raiz.querySelector('.js-anuncio');
	var rotulo    = raiz.querySelector('.js-semilla');
	var btnJugar  = raiz.querySelector('.js-jugar');
	var btnPaso   = raiz.querySelector('.js-paso');
	var btnOtra   = raiz.querySelector('.js-otra');
	var mandoVel  = raiz.querySelector('.js-velocidad');

	var marcador = {
		profundidad: raiz.querySelector('.js-profundidad'),
		excavadas:   raiz.querySelector('.js-excavadas'),
		retrocesos:  raiz.querySelector('.js-retrocesos')
	};

	var animacionReducida = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---------------------------------------------- estado

	var lado;          // ancho de la rejilla, muros incluidos
	var totalCeldas;   // celdas excavables, sin contar los muros
	var esPared;       // Uint8Array de lado * lado
	var baldosas;      // rects ya creados, indexados igual que esPared
	var suelo;         // <g> donde cuelgan los rects
	var pila;          // [{ x, y, mx, my }] — mx,my es el muro que se tiró al entrar
	var segmentos;     // los <i> de la columna de la pila
	var altoColumna;   // alto en píxeles del hueco de la columna

	var semilla, aleatorio;
	var excavadas, retrocesos;
	var terminado, jugando, arrancada;
	var mensaje, mensajePintado;
	var ultimoInstante, pendiente;

	// ---------------------------------------------- utilidades

	// Mulberry32: un generador diminuto y, sobre todo, reproducible.
	// La misma semilla tiene que dar siempre el mismo laberinto, que es
	// justo lo que el botón "Repetir" enseña.
	function generador(valor) {
		var a = valor >>> 0;
		return function () {
			a = (a + 0x6D2B79F5) >>> 0;
			var t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	// Una rejilla más pequeña en pantallas estrechas: con celdas de
	// menos de seis o siete píxeles no se distingue el camino de la pila.
	function celdasPorLado() {
		var ancho = window.innerWidth || 1024;
		if (ancho >= 760) { return 15; }
		if (ancho >= 520) { return 13; }
		return 9;
	}

	function indice(x, y) { return y * lado + x; }

	function pintar(x, y, clase) {
		var i = indice(x, y);
		var rect = baldosas[i];
		if (!rect) {
			rect = document.createElementNS(NS, 'rect');
			rect.setAttribute('x', x);
			rect.setAttribute('y', y);
			rect.setAttribute('width', '1');
			rect.setAttribute('height', '1');
			baldosas[i] = rect;
			suelo.appendChild(rect);
		}
		rect.setAttribute('class', clase);
	}

	// ---------------------------------------------- montaje

	function montar(nuevaSemilla) {
		var celdas = celdasPorLado();
		lado = celdas * 2 + 1;
		totalCeldas = celdas * celdas;

		semilla = nuevaSemilla;
		aleatorio = generador(semilla);
		rotulo.textContent = String(semilla);

		esPared = new Uint8Array(lado * lado);
		esPared.fill(1);
		baldosas = new Array(lado * lado);

		excavadas = 1;
		retrocesos = 0;
		terminado = false;
		pendiente = 0;

		svg.setAttribute('viewBox', '0 0 ' + lado + ' ' + lado);
		svg.textContent = '';

		var fondo = document.createElementNS(NS, 'rect');
		fondo.setAttribute('class', 'dl-roca');
		fondo.setAttribute('width', String(lado));
		fondo.setAttribute('height', String(lado));
		svg.appendChild(fondo);

		suelo = document.createElementNS(NS, 'g');
		svg.appendChild(suelo);

		// La salida es siempre (1, 1): la primera celda impar de la rejilla.
		esPared[indice(1, 1)] = 0;
		pila = [{ x: 1, y: 1, mx: -1, my: -1 }];
		pintar(1, 1, 'dl-actual');

		var inicio = document.createElementNS(NS, 'circle');
		inicio.setAttribute('class', 'dl-inicio');
		inicio.setAttribute('cx', '1.5');
		inicio.setAttribute('cy', '1.5');
		inicio.setAttribute('r', '0.3');
		svg.appendChild(inicio);

		segmentos = [];
		columna.textContent = '';
		medirColumna();

		decir('peek (1, 1)');
		sincronizar();
		pintarMensaje();
	}

	// ---------------------------------------------- el bucle del artículo

	function paso() {
		if (terminado) { return false; }

		var cima = pila[pila.length - 1];
		var libres = [];
		var i, d, vx, vy;

		for (i = 0; i < 4; i++) {
			d = DIRECCIONES[i];
			vx = cima.x + d[0] * 2;
			vy = cima.y + d[1] * 2;
			if (vx > 0 && vy > 0 && vx < lado && vy < lado && esPared[indice(vx, vy)]) {
				libres.push(d);
			}
		}

		if (libres.length === 0) {
			// pila.Pop(): esta celda ya no forma parte del camino de vuelta.
			pila.pop();
			pintar(cima.x, cima.y, 'dl-suelo');
			if (cima.mx !== -1) { pintar(cima.mx, cima.my, 'dl-suelo'); }
			retrocesos++;

			if (pila.length === 0) {
				terminado = true;
				jugando = false;
				var fondos = fondosDeSaco();
				decir('pila vacía · laberinto perfecto · ' + fondos + ' fondos de saco');
				pintarBotones();
				avisar('Laberinto terminado: ' + excavadas + ' celdas excavadas, ' +
					retrocesos + ' retrocesos y ' + fondos + ' fondos de saco.');
			} else {
				var vuelta = pila[pila.length - 1];
				pintar(vuelta.x, vuelta.y, 'dl-actual');
				decir('pop  (' + cima.x + ', ' + cima.y + ') · sin salidas');
			}
			return true;
		}

		d = libres[Math.floor(aleatorio() * libres.length)];
		var mx = cima.x + d[0];
		var my = cima.y + d[1];
		var sx = cima.x + d[0] * 2;
		var sy = cima.y + d[1] * 2;

		esPared[indice(mx, my)] = 0;
		esPared[indice(sx, sy)] = 0;

		pintar(cima.x, cima.y, 'dl-pila');
		pintar(mx, my, 'dl-pila');
		pintar(sx, sy, 'dl-actual');

		pila.push({ x: sx, y: sy, mx: mx, my: my });
		excavadas++;
		decir('push (' + sx + ', ' + sy + ') · ' + libres.length +
			(libres.length === 1 ? ' candidata' : ' candidatas'));
		return true;
	}

	// Un fondo de saco es una celda con una sola salida. Son los que el
	// trenzado va a buscar después, así que el dato encaja con lo que
	// cuenta el artículo justo debajo de la demo.
	function fondosDeSaco() {
		var fondos = 0, x, y, i, salidas;
		for (y = 1; y < lado; y += 2) {
			for (x = 1; x < lado; x += 2) {
				salidas = 0;
				for (i = 0; i < 4; i++) {
					if (!esPared[indice(x + DIRECCIONES[i][0], y + DIRECCIONES[i][1])]) { salidas++; }
				}
				if (salidas === 1) { fondos++; }
			}
		}
		return fondos;
	}

	// ---------------------------------------------- pintado

	function decir(texto) { mensaje = texto; }

	function pintarMensaje() {
		if (mensaje === mensajePintado) { return; }
		traza.textContent = mensaje;
		mensajePintado = mensaje;
	}

	function avisar(texto) { if (anuncio) { anuncio.textContent = texto; } }

	function medirColumna() {
		var estilo = window.getComputedStyle(columna);
		var relleno = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
		altoColumna = Math.max(40, (columna.clientHeight || 220) - (relleno || 0));
	}

	// La pila se dibuja como lo que es: una pila. Crece hacia arriba
	// (el CSS la pone del revés) y cada empujón añade una pieza.
	function sincronizarPila() {
		var objetivo = pila.length;
		var pieza;

		while (segmentos.length > objetivo) {
			columna.removeChild(segmentos.pop());
		}
		while (segmentos.length < objetivo) {
			pieza = document.createElement('i');
			pieza.className = 'demo__pieza';
			columna.appendChild(pieza);
			segmentos.push(pieza);
		}

		// Cuando la pila es honda, las piezas adelgazan y se quedan sin
		// separación antes que desbordar el hueco que tienen.
		var cuantas = Math.max(1, objetivo);
		var bruto = altoColumna / cuantas;
		var hueco = bruto >= 6 ? 2 : (bruto >= 3 ? 1 : 0);
		var alto = Math.max(1.5, Math.min(8, (altoColumna - (cuantas - 1) * hueco) / cuantas));

		columna.style.setProperty('--pieza-alto', alto.toFixed(2) + 'px');
		columna.style.setProperty('--pieza-hueco', hueco + 'px');
	}

	function sincronizar() {
		sincronizarPila();
		marcador.profundidad.textContent = String(pila.length);
		marcador.excavadas.textContent = excavadas + ' / ' + totalCeldas;
		marcador.retrocesos.textContent = String(retrocesos);
	}

	function pintarBotones() {
		btnJugar.textContent = terminado ? 'Repetir' : (jugando ? 'Pausa' : 'Excavar');
		btnJugar.setAttribute('aria-pressed', String(jugando));
		btnPaso.disabled = terminado;
	}

	// ---------------------------------------------- reloj

	function bucle(instante) {
		if (!jugando) { return; }

		var nivel = parseInt(mandoVel.value, 10) || 1;
		var ritmo = RITMOS[Math.min(RITMOS.length - 1, Math.max(0, nivel - 1))];
		var salto = Math.min(0.25, (instante - ultimoInstante) / 1000);
		ultimoInstante = instante;

		pendiente += salto * ritmo;
		var cuantos = Math.min(TOPE_POR_FOTOGRAMA, Math.floor(pendiente));
		pendiente -= cuantos;

		while (cuantos-- > 0 && !terminado) { paso(); }

		sincronizar();
		pintarMensaje();

		if (terminado) { return; }
		requestAnimationFrame(bucle);
	}

	function arrancar() {
		if (jugando) { return; }
		if (terminado) { montar(semilla); }
		jugando = true;
		pendiente = 0;
		ultimoInstante = performance.now();
		pintarBotones();
		avisar('Excavando.');
		requestAnimationFrame(bucle);
	}

	function parar() {
		if (!jugando) { return; }
		jugando = false;
		pintarBotones();
		avisar('En pausa.');
	}

	// ---------------------------------------------- mandos

	btnJugar.addEventListener('click', function () {
		arrancada = true;
		if (jugando) { parar(); } else { arrancar(); }
	});

	btnPaso.addEventListener('click', function () {
		arrancada = true;
		parar();
		if (terminado) { return; }
		paso();
		sincronizar();
		pintarMensaje();
		pintarBotones();
		if (terminado) { return; }
		avisar(mensaje);
	});

	btnOtra.addEventListener('click', function () {
		arrancada = true;
		// Si estaba corriendo o ya había terminado, se pone en marcha con el
		// laberinto nuevo; solo se queda quieta si el visitante la pausó.
		var seguir = jugando || terminado;
		jugando = false;
		montar(Math.floor(Math.random() * 100000));
		pintarBotones();
		if (seguir) { arrancar(); }
	});

	// Sin JavaScript el bloque ni se muestra, así que el mando de
	// velocidad puede vivir aquí y no en el HTML.
	mandoVel.addEventListener('input', function () {
		pendiente = 0;
	});

	var temporizador;
	window.addEventListener('resize', function () {
		clearTimeout(temporizador);
		temporizador = setTimeout(function () {
			medirColumna();
			sincronizarPila();
		}, 200);
	});

	// ---------------------------------------------- puesta en marcha

	montar(Math.floor(Math.random() * 100000));
	pintarBotones();

	// Arranca sola al entrar en pantalla, como el resto de la página; con
	// el sistema pidiendo menos animación se queda quieta esperando.
	if (!animacionReducida && 'IntersectionObserver' in window) {
		var observador = new IntersectionObserver(function (entradas) {
			entradas.forEach(function (entrada) {
				if (entrada.isIntersecting && !arrancada) {
					arrancada = true;
					observador.disconnect();
					arrancar();
				}
			});
		}, { threshold: 0.35 });
		observador.observe(raiz);
	}

})();

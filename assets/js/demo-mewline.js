/* =============================================================
 *  javiercanadilla.com — demo jugable de Mewline (nivel 44)
 *
 *  El nivel 44 de la cocina, copiado tal cual de la campaña
 *  (game/levels/world2.json), con las reglas del juego: el hilo
 *  sale del 1, va a baldosas vecinas sin cruzar muebles, pasa por
 *  los números en orden y tiene que cubrir todo el tablero.
 *
 *  La solución no viene en los datos: al cargar la página, un
 *  backtracking con la misma poda que el solucionador del juego
 *  la busca y demuestra que es la única. Explora los mismos nodos
 *  que el de Godot (51 en este nivel), así que el número que sale
 *  en el pie no es decorativo.
 *
 *  El tablero es un SVG con una baldosa de 100 unidades, así que
 *  escala solo y se ve nítido a cualquier tamaño.
 * ============================================================= */
(function () {
	'use strict';

	var raiz = document.querySelector('.js-demo-mewline');
	if (!raiz) { return; }

	var NS = 'http://www.w3.org/2000/svg';
	var ARTE = raiz.getAttribute('data-arte') || '/assets/images/projects/mewline/demo/';

	// ---------------------------------------------- el nivel 44

	// Las baldosas se numeran por filas: 0 arriba a la izquierda y 24 abajo
	// a la derecha. Los números van en orden: el primero es el 1.
	var NIVEL = {
		lado: 5,
		numeros: [22, 20, 18, 2, 0],
		muebles: [[16, 17], [17, 18], [10, 11], [1, 6]],
		objetivo: 19 // segundos para la tercera estrella, como en el juego
	};

	var N = NIVEL.lado;
	var TOTAL = N * N;
	var ULTIMO = NIVEL.numeros[NIVEL.numeros.length - 1];
	var NUM_DE = {};
	NIVEL.numeros.forEach(function (c, i) { NUM_DE[c] = i; });

	// Vecinas en el mismo orden que Board.neighbors_of(): arriba, abajo,
	// izquierda y derecha. El orden importa para contar los mismos nodos.
	function vecinasDe(c) {
		var f = Math.floor(c / N), k = c % N, v = [];
		if (f > 0) { v.push(c - N); }
		if (f < N - 1) { v.push(c + N); }
		if (k > 0) { v.push(c - 1); }
		if (k < N - 1) { v.push(c + 1); }
		return v;
	}
	var VECINAS = [];
	for (var c0 = 0; c0 < TOTAL; c0++) { VECINAS.push(vecinasDe(c0)); }
	var MUEBLE = {};
	NIVEL.muebles.forEach(function (m) {
		MUEBLE[m[0] + '-' + m[1]] = MUEBLE[m[1] + '-' + m[0]] = true;
		VECINAS[m[0]] = VECINAS[m[0]].filter(function (x) { return x !== m[1]; });
		VECINAS[m[1]] = VECINAS[m[1]].filter(function (x) { return x !== m[0]; });
	});

	function pegadas(a, b) {
		var fa = Math.floor(a / N), fb = Math.floor(b / N);
		return (fa === fb && Math.abs(a - b) === 1) || (a % N === b % N && Math.abs(fa - fb) === 1);
	}

	// ---------------------------------------------- solucionador

	// Backtracking desde el 1 con la poda del juego: ninguna baldosa libre
	// puede quedarse sin salida ni ser un callejón (salvo el último número),
	// y las libres tienen que seguir formando una sola región.
	function resolver(limite) {
		var visitada = new Uint8Array(TOTAL);
		var camino = [NIVEL.numeros[0]];
		var soluciones = [];
		var nodos = 0;
		visitada[NIVEL.numeros[0]] = 1;

		function libres(c) {
			var g = 0;
			VECINAS[c].forEach(function (y) { if (!visitada[y]) { g++; } });
			return g;
		}

		function viable(cabeza, cuenta) {
			var quedan = TOTAL - cuenta;
			for (var c = 0; c < TOTAL; c++) {
				if (visitada[c]) { continue; }
				var g = libres(c) + (VECINAS[c].indexOf(cabeza) >= 0 ? 1 : 0);
				if (g === 0 || (g === 1 && c !== ULTIMO)) { return false; }
			}
			if (libres(cabeza) === 0) { return false; }
			// Relleno desde una vecina libre de la cabeza: tiene que llegar a todas.
			var inicio = VECINAS[cabeza].filter(function (x) { return !visitada[x]; })[0];
			var vista = new Uint8Array(TOTAL), pila = [inicio], alcanzadas = 1;
			vista[inicio] = 1;
			while (pila.length) {
				VECINAS[pila.pop()].forEach(function (x) {
					if (!visitada[x] && !vista[x]) { vista[x] = 1; alcanzadas++; pila.push(x); }
				});
			}
			return alcanzadas === quedan;
		}

		function buscar(cabeza, cuenta, siguiente) {
			if (soluciones.length >= limite) { return; }
			nodos++;
			if (cuenta === TOTAL) {
				if (siguiente === NIVEL.numeros.length) { soluciones.push(camino.slice()); }
				return;
			}
			VECINAS[cabeza].forEach(function (x) {
				if (visitada[x] || soluciones.length >= limite) { return; }
				var k = NUM_DE[x];
				if (k !== undefined) {
					if (k !== siguiente) { return; }
					if (x === ULTIMO && cuenta + 1 !== TOTAL) { return; }
				}
				visitada[x] = 1;
				camino.push(x);
				if (cuenta + 1 === TOTAL || viable(x, cuenta + 1)) {
					buscar(x, cuenta + 1, k !== undefined ? siguiente + 1 : siguiente);
				}
				visitada[x] = 0;
				camino.pop();
			});
		}

		buscar(NIVEL.numeros[0], 1, 1);
		return { soluciones: soluciones, nodos: nodos };
	}

	// Con un límite de 2 basta: si encuentra una segunda, no es única.
	var busqueda = resolver(2);
	var SOLUCION = busqueda.soluciones.length === 1 ? busqueda.soluciones[0] : null;
	var nodosEl = raiz.querySelector('.js-nodos');
	if (nodosEl) { nodosEl.textContent = busqueda.nodos; }

	// ---------------------------------------------- dibujo

	var C = 100;                 // lado de una baldosa
	var svg = raiz.querySelector('.js-tablero');
	var marco = raiz.querySelector('.mw-demo__marco');
	var mensaje = raiz.querySelector('.js-mensaje');
	var final = raiz.querySelector('.js-final');
	var tiempoEl = raiz.querySelector('.js-tiempo');
	var pistasEl = raiz.querySelector('.js-pistas');
	var quedanEl = raiz.querySelector('.js-quedan');
	var btnDeshacer = raiz.querySelector('.js-deshacer');
	var btnReiniciar = raiz.querySelector('.js-reiniciar');
	var btnPista = raiz.querySelector('.js-pista');
	var btnSolucion = raiz.querySelector('.js-solucion');

	function el(nombre, attrs, padre) {
		var e = document.createElementNS(NS, nombre);
		Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
		if (padre) { padre.appendChild(e); }
		return e;
	}

	function centro(c) { return [(c % N) * C + C / 2, Math.floor(c / N) * C + C / 2]; }

	var defs = el('defs', {}, svg);
	var recorte = el('clipPath', { id: 'mw-baldosa', clipPathUnits: 'objectBoundingBox' }, defs);
	el('rect', { width: 1, height: 1, rx: 0.18, ry: 0.18 }, recorte);

	// El panel lila del tablero, con su borde redondeado.
	el('rect', { class: 'mw-panel', x: -12, y: -12, width: N * C + 24, height: N * C + 24, rx: 30 }, svg);

	var capaBaldosas = el('g', {}, svg);
	var baldosas = [];
	for (var c = 0; c < TOTAL; c++) {
		var x = (c % N) * C + 5, y = Math.floor(c / N) * C + 5;
		var r = el('rect', { class: 'mw-baldosa', x: x, y: y, width: 90, height: 90, rx: 16 }, capaBaldosas);
		el('image', {
			href: ARTE + 'suelo.webp', x: x, y: y, width: 90, height: 90,
			'clip-path': 'url(#mw-baldosa)', class: 'mw-suelo', preserveAspectRatio: 'none'
		}, capaBaldosas);
		baldosas.push(r);
	}

	// Los muebles: una barra de madera sobre la unión de dos baldosas.
	var capaMuebles = el('g', {}, svg);
	NIVEL.muebles.forEach(function (m) {
		var a = centro(m[0]), b = centro(m[1]);
		var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
		var vertical = Math.abs(m[0] - m[1]) === 1;
		var w = vertical ? 17 : 92, h = vertical ? 92 : 17;
		el('rect', { class: 'mw-mueble', x: mx - w / 2, y: my - h / 2, width: w, height: h, rx: 8.5 }, capaMuebles);
		var lw = vertical ? 5 : 64, lh = vertical ? 64 : 5;
		el('rect', { class: 'mw-mueble__brillo', x: mx - lw / 2, y: my - lh / 2, width: lw, height: lh, rx: 2.5 }, capaMuebles);
	});

	var hilo = el('polyline', { class: 'mw-hilo', points: '' }, svg);
	var brillo = el('polyline', { class: 'mw-hilo__brillo', points: '' }, svg);

	var capaNumeros = el('g', {}, svg);
	var fichas = {};
	NIVEL.numeros.forEach(function (c, i) {
		var p = centro(c);
		var g = el('g', { class: 'mw-numero' }, capaNumeros);
		el('circle', { cx: p[0], cy: p[1], r: 30 }, g);
		var t = el('text', { x: p[0], y: p[1] + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
		t.textContent = i + 1;
		fichas[c] = g;
	});

	var capaHuellas = el('g', {}, svg);
	var cabeza = el('image', { href: ARTE + 'cabeza.webp', width: 74, height: 88, class: 'mw-cabeza', visibility: 'hidden' }, svg);

	// ---------------------------------------------- estado

	var camino = [];
	var pistas = 0;
	var solucionVista = false;
	var inicio = null;       // instante del primer paso
	var fin = null;          // instante de la victoria
	var reloj = null;
	var reproduciendo = null; // temporizador de «Ver solución»

	function siguienteNumero() {
		var k = 0;
		camino.forEach(function (c) { if (NUM_DE[c] !== undefined) { k++; } });
		return k;
	}

	function ganado() { return camino.length === TOTAL && camino[camino.length - 1] === ULTIMO; }

	function formato(seg) {
		seg = Math.max(0, Math.floor(seg));
		return Math.floor(seg / 60) + ':' + (seg % 60 < 10 ? '0' : '') + (seg % 60);
	}

	function segundos() {
		if (!inicio) { return 0; }
		return ((fin || Date.now()) - inicio) / 1000;
	}

	function pintar() {
		var puntos = camino.map(function (c) { return centro(c).join(','); }).join(' ');
		hilo.setAttribute('points', puntos);
		brillo.setAttribute('points', puntos);
		var dentro = {};
		camino.forEach(function (c) { dentro[c] = true; });
		baldosas.forEach(function (b, i) { b.classList.toggle('mw-baldosa--hilo', !!dentro[i]); });
		Object.keys(fichas).forEach(function (c) { fichas[c].classList.toggle('mw-numero--hecho', !!dentro[c]); });

		if (camino.length) {
			var p = centro(camino[camino.length - 1]);
			cabeza.setAttribute('x', p[0] - 37 + 14);
			cabeza.setAttribute('y', p[1] - 44 - 22);
			cabeza.setAttribute('visibility', 'visible');
		} else {
			cabeza.setAttribute('visibility', 'hidden');
		}

		quedanEl.textContent = TOTAL - camino.length;
		pistasEl.textContent = pistas;
		tiempoEl.textContent = formato(segundos());
		btnDeshacer.disabled = !camino.length || !!fin;
		btnPista.disabled = !!fin || !SOLUCION;
	}

	function decir(texto, tono) {
		mensaje.textContent = texto;
		mensaje.className = 'mw-mensaje js-mensaje' + (tono ? ' mw-mensaje--' + tono : '');
	}

	function quedan() {
		var n = TOTAL - camino.length;
		if (!camino.length) { decir('Arrastra desde el 1.'); return; }
		if (camino[camino.length - 1] === ULTIMO && n > 0) {
			decir('Te faltan ' + n + ' baldosas por cubrir.', 'aviso');
			return;
		}
		decir(n === 1 ? '1 baldosa por cubrir.' : n + ' baldosas por cubrir.');
	}

	function sacudir() {
		marco.classList.remove('mw-demo__marco--no');
		void marco.offsetWidth;
		marco.classList.add('mw-demo__marco--no');
		if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) { /* sin vibración */ } }
	}

	function arrancarReloj() {
		if (inicio) { return; }
		inicio = Date.now();
		reloj = setInterval(function () { tiempoEl.textContent = formato(segundos()); }, 250);
	}

	// ---------------------------------------------- reglas

	// Intenta llevar el hilo a la baldosa c, vecina de la cabeza.
	// Devuelve true si el hilo ha cambiado.
	function paso(c) {
		if (fin) { return false; }
		var n = camino.length;
		if (!n) {
			if (c !== NIVEL.numeros[0]) { decir('Empieza en el 1.', 'aviso'); sacudir(); return false; }
			camino.push(c);
			arrancarReloj();
			return true;
		}
		var cab = camino[n - 1];
		if (c === cab) { return false; }
		// Volver por el mismo hilo lo recoge.
		if (n >= 2 && c === camino[n - 2]) { camino.pop(); return true; }
		if (camino.indexOf(c) >= 0) { return false; }
		if (!pegadas(cab, c)) { return false; }
		if (MUEBLE[cab + '-' + c]) { decir('Hay un mueble en medio.', 'aviso'); sacudir(); return false; }
		if (cab === ULTIMO) { decir('El hilo ya llegó al último número.', 'aviso'); sacudir(); return false; }
		var k = NUM_DE[c];
		if (k !== undefined && k !== siguienteNumero()) { decir('Los números van en orden.', 'aviso'); sacudir(); return false; }
		camino.push(c);
		arrancarReloj();
		return true;
	}

	// Avanza hacia una baldosa que puede no ser vecina (un dedo rápido se
	// salta baldosas): un paso cada vez por el eje en el que más falta.
	function irHacia(destino) {
		var guardia = 2 * N;
		while (camino.length && camino[camino.length - 1] !== destino && guardia--) {
			var cab = camino[camino.length - 1];
			var df = Math.floor(destino / N) - Math.floor(cab / N);
			var dk = (destino % N) - (cab % N);
			var sig = Math.abs(dk) >= Math.abs(df) ? cab + Math.sign(dk) : cab + Math.sign(df) * N;
			if (!paso(sig)) { break; }
		}
	}

	function despues() {
		pintar();
		if (ganado()) { victoria(); } else { quedan(); }
	}

	// ---------------------------------------------- final

	function estrellas() {
		if (solucionVista || pistas > 0) { return 1; }
		return segundos() <= NIVEL.objetivo ? 3 : 2;
	}

	function victoria() {
		fin = Date.now();
		clearInterval(reloj);
		pintar();
		cabeza.setAttribute('href', ARTE + 'cabeza-orgullosa.webp');
		var e = estrellas();
		var nota;
		if (solucionVista) {
			nota = 'Has visto la solución, así que este intento se queda en una estrella.';
		} else if (pistas > 0) {
			nota = 'Sin pistas te llevas la segunda estrella.';
		} else if (e === 2) {
			nota = 'Para la tercera, termínalo en ' + formato(NIVEL.objetivo) + ' o menos.';
		} else {
			nota = 'Tres estrellas: sin pistas y a tiempo.';
		}
		final.innerHTML = '';
		var t = document.createElement('p');
		t.className = 'mw-final__titulo';
		t.textContent = '¡Nivel completado!';
		var est = document.createElement('p');
		est.className = 'mw-final__estrellas';
		est.setAttribute('aria-label', e + (e === 1 ? ' estrella de 3' : ' estrellas de 3'));
		for (var i = 0; i < 3; i++) {
			var s = document.createElement('span');
			s.className = 'mw-estrella' + (i < e ? ' mw-estrella--on' : '');
			s.setAttribute('aria-hidden', 'true');
			s.textContent = '★';
			est.appendChild(s);
		}
		var datos = document.createElement('p');
		datos.className = 'mw-final__datos';
		datos.textContent = 'Tiempo: ' + formato(segundos()) + ' · objetivo ' + formato(NIVEL.objetivo) +
			' · ' + (pistas ? 'Pistas usadas: ' + pistas : 'Sin pistas');
		var n = document.createElement('p');
		n.className = 'mw-final__nota';
		n.textContent = nota;
		var b = document.createElement('button');
		b.type = 'button';
		b.className = 'btn btn--primary btn--small';
		b.textContent = 'Repetir';
		b.addEventListener('click', reiniciar);
		[t, est, datos, n, b].forEach(function (x) { final.appendChild(x); });
		final.hidden = false;
		decir('¡Nivel completado!', 'exito');
	}

	// ---------------------------------------------- botones

	function pararSolucion() {
		if (reproduciendo) { clearTimeout(reproduciendo); reproduciendo = null; }
		btnSolucion.setAttribute('aria-pressed', 'false');
	}

	function reiniciar() {
		pararSolucion();
		camino = [];
		pistas = 0;
		solucionVista = false;
		inicio = fin = null;
		clearInterval(reloj);
		final.hidden = true;
		while (capaHuellas.firstChild) { capaHuellas.removeChild(capaHuellas.firstChild); }
		cabeza.setAttribute('href', ARTE + 'cabeza.webp');
		pintar();
		quedan();
	}

	function deshacer() {
		if (fin || !camino.length) { return; }
		pararSolucion();
		camino.pop();
		despues();
	}

	// Huellas sobre las baldosas que ha puesto la pista, que se desvanecen.
	function huellas(celdas) {
		while (capaHuellas.firstChild) { capaHuellas.removeChild(capaHuellas.firstChild); }
		celdas.forEach(function (c, i) {
			var p = centro(c);
			var h = el('image', {
				href: ARTE + 'huella.webp', x: p[0] + 6, y: p[1] - 46, width: 40, height: 40,
				class: 'mw-huella', style: 'animation-delay: ' + (i * 0.12) + 's'
			}, capaHuellas);
			setTimeout(function () { if (h.parentNode) { h.parentNode.removeChild(h); } }, 2600);
		});
	}

	// Como en el juego: una pista recoge el hilo hasta el último paso
	// correcto y enseña los tres siguientes.
	function pista() {
		if (fin || !SOLUCION) { return; }
		pararSolucion();
		var bien = 0;
		while (bien < camino.length && camino[bien] === SOLUCION[bien]) { bien++; }
		var recogido = camino.length > bien;
		camino = camino.slice(0, bien);
		var nuevas = SOLUCION.slice(bien, bien + (bien === 0 ? 4 : 3));
		camino = camino.concat(nuevas);
		pistas++;
		arrancarReloj();
		huellas(nuevas);
		despues();
		if (!fin && recogido) { decir('La pista ha recogido el hilo hasta el último paso bueno.', 'aviso'); }
	}

	function solucion() {
		if (!SOLUCION) { return; }
		if (reproduciendo) { pararSolucion(); return; }
		if (fin) { reiniciar(); }
		solucionVista = true;
		btnSolucion.setAttribute('aria-pressed', 'true');
		arrancarReloj();
		camino = [];
		var i = 0;
		(function siguiente() {
			camino.push(SOLUCION[i++]);
			pintar();
			if (i < SOLUCION.length) {
				reproduciendo = setTimeout(siguiente, 140);
			} else {
				reproduciendo = null;
				btnSolucion.setAttribute('aria-pressed', 'false');
				despues();
			}
		})();
		decir('Así se recorre: fíjate en la baldosa que hay justo encima del 1.');
	}

	btnDeshacer.addEventListener('click', deshacer);
	btnReiniciar.addEventListener('click', reiniciar);
	btnPista.addEventListener('click', pista);
	btnSolucion.addEventListener('click', solucion);

	// ---------------------------------------------- dedo y ratón

	function celdaEn(e) {
		var m = svg.getScreenCTM();
		if (!m) { return -1; }
		var p = svg.createSVGPoint();
		p.x = e.clientX; p.y = e.clientY;
		var q = p.matrixTransform(m.inverse());
		var k = Math.floor(q.x / C), f = Math.floor(q.y / C);
		if (k < 0 || f < 0 || k >= N || f >= N) { return -1; }
		return f * N + k;
	}

	var arrastrando = false;

	svg.addEventListener('pointerdown', function (e) {
		if (fin || reproduciendo) { return; }
		var c = celdaEn(e);
		if (c < 0) { return; }
		e.preventDefault();
		var i = camino.indexOf(c);
		if (i >= 0) {
			// Tocar un punto del hilo lo corta ahí y se sigue desde él.
			camino = camino.slice(0, i + 1);
			arrastrando = true;
		} else if (!camino.length || pegadas(camino[camino.length - 1], c)) {
			arrastrando = paso(c) || camino.length > 0;
		} else {
			decir(camino.length ? 'Sigue desde la punta del hilo.' : 'Empieza en el 1.', 'aviso');
			return;
		}
		if (svg.setPointerCapture) { svg.setPointerCapture(e.pointerId); }
		despues();
	});

	svg.addEventListener('pointermove', function (e) {
		if (!arrastrando || fin) { return; }
		var c = celdaEn(e);
		if (c < 0 || !camino.length || c === camino[camino.length - 1]) { return; }
		var antes = camino.length;
		irHacia(c);
		if (camino.length !== antes || camino[camino.length - 1] === c) { despues(); }
	});

	function soltar() { arrastrando = false; }
	svg.addEventListener('pointerup', soltar);
	svg.addEventListener('pointercancel', soltar);

	// ---------------------------------------------- teclado

	var DIRS = { ArrowUp: -N, ArrowDown: N, ArrowLeft: -1, ArrowRight: 1 };
	marco.addEventListener('keydown', function (e) {
		if (e.key in DIRS) {
			e.preventDefault();
			if (fin || reproduciendo) { return; }
			if (!camino.length) { paso(NIVEL.numeros[0]); }
			var cab = camino[camino.length - 1];
			var sig = cab + DIRS[e.key];
			if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && Math.floor(sig / N) !== Math.floor(cab / N)) { return; }
			if (sig < 0 || sig >= TOTAL) { return; }
			paso(sig);
			despues();
		} else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
			e.preventDefault();
			deshacer();
		} else if (e.key === 'h' || e.key === 'H') {
			e.preventDefault();
			pista();
		}
	});

	reiniciar();
})();

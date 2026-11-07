/* =============================================================
 *  javiercanadilla.com — demo jugable de NUBO (reparto 02-02)
 *
 *  «El huerto de paso», el segundo reparto del bosque del viento,
 *  con las mismas reglas que el motor de referencia del juego:
 *  una casilla por orden, el viento te arrastra hasta chocar, el
 *  lago recarga al entrar y solo se llueve encima de un huerto.
 *
 *  La pista y «Ver solución» no traen nada precalculado: lanzan
 *  un BFS desde el estado actual, el mismo que valida los 72
 *  repartos del juego, y se quedan con la primera orden.
 *
 *  El tablero es un SVG en las unidades del arte original del
 *  juego (cada casilla mide 140 × 130 de cara superior), así que
 *  escala solo y se ve nítido a cualquier tamaño.
 * ============================================================= */
(function () {
	'use strict';

	var raiz = document.querySelector('.js-demo-nubo');
	if (!raiz) { return; }

	var NS = 'http://www.w3.org/2000/svg';
	var ARTE = raiz.getAttribute('data-arte') || '/assets/images/projects/nubo/demo/';

	// ---------------------------------------------- el reparto 02-02

	// Copiado tal cual de la campaña (nubo-campana-72-niveles.json).
	// x crece hacia la derecha e y hacia abajo, empezando en cero.
	var NIVEL = {
		id: '02-02',
		filas: [
			'.G<.G',
			'.#.^.',
			'..#.L',
			'###..'
		],
		inicio: [2, 1],
		agua: 2,
		capacidad: 4,
		encargos: [{ x: 1, y: 0, pide: 1 }, { x: 4, y: 0, pide: 3 }],
		lagos: [{ x: 4, y: 2, reserva: 2 }],
		optimo: 13
	};

	var ANCHO = NIVEL.filas[0].length;
	var ALTO = NIVEL.filas.length;

	var DIR = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] };
	var VIENTO = { '^': 'N', '>': 'E', 'v': 'S', '<': 'O' };
	var NOMBRE_DIR = { N: 'al norte', E: 'al este', S: 'al sur', O: 'al oeste' };
	var ORDENES = ['N', 'E', 'S', 'O', 'R'];

	// ---------------------------------------------- reglas

	function celda(x, y) {
		if (y < 0 || y >= ALTO || x < 0 || x >= ANCHO) { return '#'; }
		return NIVEL.filas[y].charAt(x);
	}

	function indice(lista, x, y) {
		for (var i = 0; i < lista.length; i++) {
			if (lista[i].x === x && lista[i].y === y) { return i; }
		}
		return -1;
	}

	function inicial() {
		return {
			x: NIVEL.inicio[0],
			y: NIVEL.inicio[1],
			agua: NIVEL.agua,
			entregado: NIVEL.encargos.map(function () { return 0; }),
			reservas: NIVEL.lagos.map(function (l) { return l.reserva; })
		};
	}

	function copia(s) {
		return { x: s.x, y: s.y, agua: s.agua, entregado: s.entregado.slice(), reservas: s.reservas.slice() };
	}

	// La clave del estado: todo lo que cambia el futuro, nada más.
	function clave(s) {
		return s.x + ',' + s.y + '|' + s.agua + '|' + s.entregado.join(',') + '|' + s.reservas.join(',');
	}

	function ganado(s) {
		for (var i = 0; i < NIVEL.encargos.length; i++) {
			if (s.entregado[i] < NIVEL.encargos[i].pide) { return false; }
		}
		return true;
	}

	function transitable(x, y) { return celda(x, y) !== '#'; }

	// Entrar en una casilla: en este reparto solo el lago tiene efecto.
	function entrar(s, x, y, ev) {
		s.x = x; s.y = y;
		var l = indice(NIVEL.lagos, x, y);
		if (l >= 0) {
			var toma = Math.min(NIVEL.capacidad - s.agua, s.reservas[l]);
			if (toma > 0) {
				s.agua += toma;
				s.reservas[l] -= toma;
				ev.recarga = (ev.recarga || 0) + toma;
			}
		}
	}

	// Devuelve el estado nuevo y lo que ha pasado, o null si la orden
	// no es válida. El estado de partida nunca se toca.
	function accion(s0, a) {
		if (ganado(s0)) { return null; }
		var s = copia(s0);
		var ev = { ruta: [], viento: false, cruzados: [] };

		if (DIR[a]) {
			var x = s.x + DIR[a][0], y = s.y + DIR[a][1];
			if (!transitable(x, y)) { return null; }
			entrar(s, x, y, ev);
			ev.ruta.push([x, y]);

			// Desplazamiento forzado: sigue hasta que la siguiente no se puede pisar.
			var sentido = VIENTO[celda(x, y)];
			var vistos = {};
			while (sentido) {
				ev.viento = true;
				var k = clave(s) + sentido;
				if (vistos[k]) { return null; }
				vistos[k] = true;
				var nx = s.x + DIR[sentido][0], ny = s.y + DIR[sentido][1];
				if (!transitable(nx, ny)) { break; }
				if (indice(NIVEL.encargos, s.x, s.y) >= 0) { ev.cruzados.push([s.x, s.y]); }
				entrar(s, nx, ny, ev);
				ev.ruta.push([nx, ny]);
				sentido = VIENTO[celda(nx, ny)] || sentido;
			}
			return { estado: s, ev: ev };
		}

		if (a === 'R') {
			if (!s.agua) { return null; }
			var i = indice(NIVEL.encargos, s.x, s.y);
			if (i < 0 || s.entregado[i] >= NIVEL.encargos[i].pide) { return null; }
			s.agua -= 1;
			s.entregado[i] += 1;
			ev.llueve = i;
			return { estado: s, ev: ev };
		}
		return null;
	}

	// BFS con coste uno por orden: la primera vez que se gana es con el
	// mínimo de acciones. Devuelve la ruta y cuántos estados ha visto.
	function resolver(desde) {
		var cola = [desde];
		var previo = {};
		previo[clave(desde)] = null;
		var vistos = 1;
		for (var c = 0; c < cola.length; c++) {
			var s = cola[c];
			if (ganado(s)) {
				var ruta = [];
				var k = clave(s);
				while (previo[k]) { ruta.push(previo[k].a); k = previo[k].k; }
				return { ruta: ruta.reverse(), estados: vistos };
			}
			for (var j = 0; j < ORDENES.length; j++) {
				var r = accion(s, ORDENES[j]);
				if (!r) { continue; }
				var kn = clave(r.estado);
				if (Object.prototype.hasOwnProperty.call(previo, kn)) { continue; }
				previo[kn] = { k: clave(s), a: ORDENES[j] };
				vistos++;
				cola.push(r.estado);
			}
		}
		return { ruta: null, estados: vistos };
	}

	function estrellas(acciones) {
		var a = NIVEL.optimo;
		if (acciones <= a) { return 3; }
		if (acciones <= a + Math.max(2, Math.ceil(a * 0.2))) { return 2; }
		return 1;
	}

	// ---------------------------------------------- dibujo

	var CW = 140;   // ancho de la cara superior de una casilla
	var CH = 130;   // alto de la cara superior (el resto es el canto)

	var svg = raiz.querySelector('.js-tablero');
	var hudAgua = raiz.querySelector('.js-agua');
	var hudAcciones = raiz.querySelector('.js-acciones');
	var hudEncargos = raiz.querySelector('.js-encargos');
	var mensaje = raiz.querySelector('.js-mensaje');
	var final = raiz.querySelector('.js-final');
	var btnLlover = raiz.querySelector('.js-llover');
	var btnDeshacer = raiz.querySelector('.js-deshacer');
	var btnReiniciar = raiz.querySelector('.js-reiniciar');
	var btnPista = raiz.querySelector('.js-pista');
	var btnSolucion = raiz.querySelector('.js-solucion');
	var rotuloEstados = raiz.querySelector('.js-estados');

	var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function el(nombre, attrs, padre) {
		var n = document.createElementNS(NS, nombre);
		for (var k in attrs) { if (attrs.hasOwnProperty(k)) { n.setAttribute(k, attrs[k]); } }
		if (padre) { padre.appendChild(n); }
		return n;
	}

	function imagen(src, x, y, w, h, padre, extra) {
		var attrs = { href: ARTE + src, x: x, y: y, width: w, height: h, preserveAspectRatio: 'none' };
		if (extra) { for (var k in extra) { attrs[k] = extra[k]; } }
		return el('image', attrs, padre);
	}

	var capaSuelo = el('g', {}, svg);
	var capaObjetos = el('g', {}, svg);
	var capaPista = el('g', { 'class': 'nd-pista' }, svg);
	var capaRotulos = el('g', {}, svg);
	var capaLluvia = el('g', { 'class': 'nd-lluvia' }, svg);

	var huertos = [];   // { img, texto, pastilla }
	var lagos = [];     // { img, texto }

	// Variantes de césped como en el juego: mezcla fija por casilla.
	var CESPED = ['lawn-a.webp', 'lawn-b.webp', 'lawn-c.webp'];

	for (var y = 0; y < ALTO; y++) {
		for (var x = 0; x < ANCHO; x++) {
			var c = celda(x, y);
			var src = c === '#' ? 'rocks.webp' : c === 'L' ? 'pond.webp' : CESPED[(x * 7 + y * 3) % 3];
			var img = imagen(src, x * CW - 2, y * CH - 3, 144, 155, capaSuelo);
			if (c === 'L') { lagos.push({ img: img }); }
		}
	}

	// Flechas de viento, giradas sobre el centro de su casilla.
	for (var vy = 0; vy < ALTO; vy++) {
		for (var vx = 0; vx < ANCHO; vx++) {
			var s = VIENTO[celda(vx, vy)];
			if (!s) { continue; }
			var giro = { E: 0, S: 90, O: 180, N: -90 }[s];
			var cx = vx * CW + CW / 2, cy = vy * CH + CH / 2;
			var g = el('g', { transform: 'rotate(' + giro + ' ' + cx + ' ' + cy + ')' }, capaObjetos);
			imagen('wind.webp', cx - 72, cy - 60, 144, 120, g, { 'class': 'nd-viento' });
		}
	}

	NIVEL.encargos.forEach(function (t) {
		var w = 122, h = Math.round(w * 104 / 131);
		var img = imagen('huerto-seco.webp', t.x * CW + (CW - w) / 2, t.y * CH + CH - h - 6, w, h, capaObjetos);
		var px = t.x * CW + CW - 60, py = t.y * CH + 6;
		var pastilla = el('rect', { x: px, y: py, width: 54, height: 30, rx: 15, 'class': 'nd-pastilla' }, capaRotulos);
		var texto = el('text', { x: px + 27, y: py + 21, 'text-anchor': 'middle', 'class': 'nd-pastilla__texto' }, capaRotulos);
		huertos.push({ img: img, texto: texto, pastilla: pastilla });
	});

	NIVEL.lagos.forEach(function (l, i) {
		var px = l.x * CW + CW - 52, py = l.y * CH + 6;
		el('rect', { x: px, y: py, width: 46, height: 30, rx: 15, 'class': 'nd-pastilla nd-pastilla--lago' }, capaRotulos);
		var gota = el('path', { d: 'M0-9C0-9 6-2 6 2.5A6 6 0 0 1-6 2.5C-6-2 0-9 0-9Z', transform: 'translate(' + (px + 14) + ' ' + (py + 15) + ')', 'class': 'nd-gotita' }, capaRotulos);
		var texto = el('text', { x: px + 32, y: py + 21, 'text-anchor': 'middle', 'class': 'nd-pastilla__texto' }, capaRotulos);
		lagos[i].texto = texto;
		lagos[i].gota = gota;
	});

	// Nubo: un grupo que se traslada y, dentro, la imagen que flota.
	var nube = el('g', { 'class': 'nd-nube' }, svg);
	var nubeFlota = el('g', { 'class': 'nd-nube__flota' }, nube);
	imagen('nubo.webp', -58, -62, 116, 93, nubeFlota);

	function centro(x, y) { return [x * CW + CW / 2, y * CH + CH / 2 - 4]; }

	function colocarNube(px, py) {
		nube.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
	}

	// ---------------------------------------------- estado de la partida

	var estado = inicial();
	var historial = [];
	var ocupado = false;
	var pistaUsada = false;
	// Como en el juego: un intento en el que has visto la solución
	// se queda en una estrella como mucho. Las pistas no quitan estrellas.
	var solucionVista = false;
	var reproduciendo = false;
	var temporizador = null;

	function pintar() {
		NIVEL.encargos.forEach(function (t, i) {
			var hecho = estado.entregado[i] >= t.pide;
			huertos[i].img.setAttribute('href', ARTE + (hecho ? 'huerto.webp' : 'huerto-seco.webp'));
			huertos[i].texto.textContent = estado.entregado[i] + '/' + t.pide;
			huertos[i].pastilla.setAttribute('class', 'nd-pastilla' + (hecho ? ' nd-pastilla--hecho' : ''));
		});
		NIVEL.lagos.forEach(function (l, i) {
			var queda = estado.reservas[i];
			lagos[i].img.setAttribute('href', ARTE + (queda ? 'pond.webp' : 'pond-dry.webp'));
			lagos[i].texto.textContent = queda;
		});

		var gotas = '';
		for (var g = 0; g < NIVEL.capacidad; g++) {
			gotas += '<span class="nd-gota' + (g < estado.agua ? ' nd-gota--llena' : '') + '" aria-hidden="true"></span>';
		}
		hudAgua.innerHTML = gotas + '<span class="nd-hud__num">' + estado.agua + '/' + NIVEL.capacidad + '</span>';
		hudAgua.setAttribute('aria-label', 'Agua: ' + estado.agua + ' de ' + NIVEL.capacidad + ' gotas');
		hudAcciones.textContent = historial.length;

		var completos = 0;
		NIVEL.encargos.forEach(function (t, i) { if (estado.entregado[i] >= t.pide) { completos++; } });
		hudEncargos.textContent = completos + '/' + NIVEL.encargos.length;

		var fin = ganado(estado);
		btnLlover.disabled = fin;
		btnDeshacer.disabled = !historial.length || reproduciendo;
		btnReiniciar.disabled = !historial.length || reproduciendo;
		btnPista.disabled = fin || reproduciendo;
		btnSolucion.disabled = fin;
		btnSolucion.textContent = reproduciendo ? 'Detener' : 'Ver solución';
		btnSolucion.setAttribute('aria-pressed', reproduciendo ? 'true' : 'false');
	}

	function decir(texto, tono) {
		mensaje.textContent = texto;
		mensaje.className = 'nd-mensaje js-mensaje' + (tono ? ' nd-mensaje--' + tono : '');
	}

	function limpiarPista() { while (capaPista.firstChild) { capaPista.removeChild(capaPista.firstChild); } }

	// ---------------------------------------------- animaciones

	function animarRuta(desde, puntos, hecho) {
		if (reducido || !puntos.length) {
			var ult = puntos.length ? puntos[puntos.length - 1] : [desde.x, desde.y];
			var p = centro(ult[0], ult[1]);
			colocarNube(p[0], p[1]);
			hecho();
			return;
		}
		var tramos = [centro(desde.x, desde.y)].concat(puntos.map(function (q) { return centro(q[0], q[1]); }));
		var porTramo = puntos.length > 1 ? 120 : 170;
		var total = porTramo * (tramos.length - 1);
		var t0 = null;
		function paso(t) {
			if (t0 === null) { t0 = t; }
			var avance = Math.min(1, (t - t0) / total);
			var pos = avance * (tramos.length - 1);
			var i = Math.min(tramos.length - 2, Math.floor(pos));
			var f = pos - i;
			if (puntos.length === 1) { f = 1 - Math.pow(1 - f, 3); }
			var a = tramos[i], b = tramos[i + 1];
			colocarNube(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
			if (avance < 1) { requestAnimationFrame(paso); } else { hecho(); }
		}
		requestAnimationFrame(paso);
	}

	// La sacudida sustituye un momento al flotar; al acabar, vuelve a flotar.
	function sacudir() {
		if (reducido) { return; }
		nubeFlota.classList.remove('nd-nube--no');
		void nubeFlota.getBBox();
		nubeFlota.classList.add('nd-nube--no');
	}
	nubeFlota.addEventListener('animationend', function (e) {
		if (e.animationName === 'nd-no') { nubeFlota.classList.remove('nd-nube--no'); }
	});

	function llover(x, y) {
		if (reducido) { return; }
		var c = centro(x, y);
		for (var i = 0; i < 5; i++) {
			var gx = c[0] - 30 + i * 15;
			// La posición va en el grupo y la animación en la gota: si
			// compartieran elemento, la animación pisaría el transform.
			var gota = el('g', { transform: 'translate(' + gx + ' ' + (c[1] + 10) + ')' }, capaLluvia);
			el('path', {
				d: 'M0-7C0-7 4.5-1.5 4.5 2A4.5 4.5 0 0 1-4.5 2C-4.5-1.5 0-7 0-7Z',
				'class': 'nd-gota-cae',
				style: 'animation-delay:' + (i % 2 ? 90 : 0) + 'ms'
			}, gota);
			(function (n) { setTimeout(function () { if (n.parentNode) { n.parentNode.removeChild(n); } }, 700); })(gota);
		}
	}

	function aviso(x, y, texto) {
		if (reducido) { return; }
		var c = centro(x, y);
		var t = el('text', { x: c[0], y: c[1] - 40, 'text-anchor': 'middle', 'class': 'nd-flotante' }, capaLluvia);
		t.textContent = texto;
		setTimeout(function () { if (t.parentNode) { t.parentNode.removeChild(t); } }, 1100);
	}

	// ---------------------------------------------- jugar

	function jugar(a, desdeSolucion) {
		if (ocupado) { return false; }
		if (!desdeSolucion) { pararSolucion(); }
		limpiarPista();

		if (ganado(estado)) { return false; }
		var r = accion(estado, a);
		if (!r) {
			if (a === 'R') {
				var i = indice(NIVEL.encargos, estado.x, estado.y);
				if (i < 0) { decir('Colócate encima de un huerto para llover.'); }
				else if (estado.entregado[i] >= NIVEL.encargos[i].pide) { decir('Este huerto ya tiene toda su agua.'); }
				else { decir('No te queda agua: recarga en el lago.'); }
			} else {
				decir('Por ahí no se puede pasar.');
			}
			sacudir();
			return false;
		}

		var antes = estado;
		historial.push(antes);
		estado = r.estado;
		var ev = r.ev;

		if (a === 'R') {
			llover(estado.x, estado.y);
			var t = NIVEL.encargos[ev.llueve];
			var n = estado.entregado[ev.llueve];
			decir(n >= t.pide ? 'Huerto regado: ' + n + '/' + t.pide + '. ¡Listo!' : 'Llueve sobre el huerto: ' + n + '/' + t.pide + '.');
			pintar();
			comprobarFinal();
			return true;
		}

		ocupado = true;
		animarRuta(antes, ev.ruta, function () {
			ocupado = false;
			if (ev.recarga) {
				aviso(estado.x, estado.y, '+' + ev.recarga);
				decir('Recargas ' + ev.recarga + (ev.recarga === 1 ? ' gota' : ' gotas') + ' en el lago.');
			} else if (ev.cruzados.length) {
				decir('El viento te lleva por encima del huerto sin dejarte llover.', 'aviso');
			} else if (ev.viento) {
				decir('¡El viento te arrastra hasta chocar!');
			} else {
				decir('Nubo avanza ' + NOMBRE_DIR[a] + '.');
			}
			pintar();
			comprobarFinal();
		});
		pintar();
		return true;
	}

	function comprobarFinal() {
		if (!ganado(estado)) { final.hidden = true; return; }
		pararSolucion();
		var n = historial.length;
		var e = solucionVista ? Math.min(1, estrellas(n)) : estrellas(n);
		var html = '<p class="nd-final__titulo">¡Reparto completado!</p><p class="nd-final__estrellas" aria-label="' + e + ' de 3 estrellas">';
		for (var i = 0; i < 3; i++) { html += '<span class="nd-estrella' + (i < e ? ' nd-estrella--on' : '') + '" aria-hidden="true">★</span>'; }
		html += '</p><p class="nd-final__datos">' + n + ' acciones · ruta mínima ' + NIVEL.optimo + '</p>';
		var nota;
		if (solucionVista) { nota = 'Has visto la solución, así que este intento se queda en una estrella. ¿Lo intentas por tu cuenta?'; }
		else if (e === 3) { nota = pistaUsada ? 'Ruta perfecta.' : 'Ruta perfecta y sin pistas. Esto ya es oficio.'; }
		else { nota = 'Se puede hacer en ' + NIVEL.optimo + '. ¿Lo intentas otra vez?'; }
		html += '<p class="nd-final__nota">' + nota + '</p>';
		html += '<button type="button" class="btn btn--primary btn--small js-otra-vez">Jugar otra vez</button>';
		final.innerHTML = html;
		final.hidden = false;
		decir('¡Reparto completado en ' + n + ' acciones!', 'exito');
		var b = final.querySelector('.js-otra-vez');
		b.addEventListener('click', reiniciar);
	}

	function deshacer() {
		if (ocupado || !historial.length) { return; }
		pararSolucion();
		limpiarPista();
		estado = historial.pop();
		var p = centro(estado.x, estado.y);
		colocarNube(p[0], p[1]);
		final.hidden = true;
		decir('Deshecho. Sin castigo.');
		pintar();
	}

	function reiniciar() {
		if (ocupado) { return; }
		pararSolucion();
		limpiarPista();
		estado = inicial();
		historial = [];
		pistaUsada = false;
		solucionVista = false;
		var p = centro(estado.x, estado.y);
		colocarNube(p[0], p[1]);
		final.hidden = true;
		decir('Reparto nuevo. Piensa la ruta antes de moverte.');
		pintar();
		svg.parentNode.focus({ preventScroll: true });
	}

	function pista() {
		if (ocupado || ganado(estado)) { return; }
		pararSolucion();
		limpiarPista();
		var r = resolver(estado);
		if (!r.ruta) { decir('Desde aquí ya no hay salida: deshaz algún paso.', 'aviso'); return; }
		pistaUsada = true;
		var a = r.ruta[0];
		var faltan = r.ruta.length;
		if (a === 'R') {
			marcar(estado.x, estado.y);
			decir('Pista: llueve aquí. Te quedan ' + faltan + ' acciones como mínimo.');
		} else {
			marcar(estado.x + DIR[a][0], estado.y + DIR[a][1]);
			decir('Pista: muévete ' + NOMBRE_DIR[a] + '. Te quedan ' + faltan + ' acciones como mínimo.');
		}
	}

	// Dos trazos: uno azul por debajo para que el blanco discontinuo
	// se lea encima del césped otoñal, que es casi todo amarillo.
	function marcar(x, y) {
		var attrs = { x: x * CW + 7, y: y * CH + 7, width: CW - 14, height: CH - 14, rx: 18 };
		attrs['class'] = 'nd-pista__fondo';
		el('rect', attrs, capaPista);
		attrs['class'] = 'nd-pista__marco';
		el('rect', attrs, capaPista);
	}

	function pararSolucion() {
		if (!reproduciendo) { return; }
		reproduciendo = false;
		clearTimeout(temporizador);
		pintar();
	}

	function solucion() {
		if (reproduciendo) { pararSolucion(); decir('Solución detenida. Sigue tú desde aquí.'); return; }
		if (ocupado || ganado(estado)) { return; }
		var r = resolver(estado);
		if (!r.ruta) { decir('Desde aquí ya no hay salida: deshaz algún paso.', 'aviso'); return; }
		pistaUsada = true;
		solucionVista = true;
		reproduciendo = true;
		pintar();
		var ruta = r.ruta.slice();
		(function siguiente() {
			if (!reproduciendo) { return; }
			if (ocupado) { temporizador = setTimeout(siguiente, 60); return; }
			if (!ruta.length) { reproduciendo = false; pintar(); return; }
			jugar(ruta.shift(), true);
			temporizador = setTimeout(siguiente, reducido ? 450 : 620);
		})();
	}

	// ---------------------------------------------- mandos

	raiz.querySelectorAll('[data-dir]').forEach(function (b) {
		b.addEventListener('click', function () { jugar(b.getAttribute('data-dir')); });
	});
	btnLlover.addEventListener('click', function () { jugar('R'); });
	btnDeshacer.addEventListener('click', deshacer);
	btnReiniciar.addEventListener('click', reiniciar);
	btnPista.addEventListener('click', pista);
	btnSolucion.addEventListener('click', solucion);

	// Teclado, solo con el tablero enfocado: así las flechas no
	// secuestran el scroll del resto de la página.
	var marco = svg.parentNode;
	var TECLAS = {
		ArrowUp: 'N', ArrowRight: 'E', ArrowDown: 'S', ArrowLeft: 'O',
		w: 'N', d: 'E', s: 'S', a: 'O', W: 'N', D: 'E', S: 'S', A: 'O',
		' ': 'R', Enter: 'R'
	};
	marco.addEventListener('keydown', function (e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }
		if (TECLAS[e.key]) { e.preventDefault(); jugar(TECLAS[e.key]); return; }
		if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') { e.preventDefault(); deshacer(); return; }
		if (e.key === 'h' || e.key === 'H') { e.preventDefault(); pista(); }
	});

	// Deslizar como en el móvil, o tocar una casilla vecina.
	var toque = null;
	svg.addEventListener('pointerdown', function (e) {
		toque = { x: e.clientX, y: e.clientY };
		marco.focus({ preventScroll: true });
	});
	svg.addEventListener('pointerup', function (e) {
		if (!toque) { return; }
		var dx = e.clientX - toque.x, dy = e.clientY - toque.y;
		toque = null;
		if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) {
			jugar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'O') : (dy > 0 ? 'S' : 'N'));
			return;
		}
		var m = svg.getScreenCTM();
		if (!m) { return; }
		var p = svg.createSVGPoint();
		p.x = e.clientX; p.y = e.clientY;
		var q = p.matrixTransform(m.inverse());
		var cx = Math.floor(q.x / CW), cy = Math.floor(q.y / CH);
		var ddx = cx - estado.x, ddy = cy - estado.y;
		if (Math.abs(ddx) + Math.abs(ddy) !== 1) {
			if (ddx === 0 && ddy === 0 && indice(NIVEL.encargos, cx, cy) >= 0) { jugar('R'); }
			return;
		}
		jugar(ddx === 1 ? 'E' : ddx === -1 ? 'O' : ddy === 1 ? 'S' : 'N');
	});
	svg.addEventListener('pointercancel', function () { toque = null; });

	// ---------------------------------------------- arranque

	var optimo = resolver(inicial());
	if (rotuloEstados) { rotuloEstados.textContent = optimo.estados; }

	var p0 = centro(estado.x, estado.y);
	colocarNube(p0[0], p0[1]);
	decir('Desliza sobre el tablero, usa las flechas o los botones.');
	pintar();
})();

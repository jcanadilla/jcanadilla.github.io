/* =============================================================
 *  javiercanadilla.com — detalles de la página de NUBO
 *
 *  Tres piezas pequeñas e independientes:
 *    · el carrusel de capturas (flechas sobre un scroll-snap que
 *      ya funciona sin JavaScript),
 *    · el comparador diseño/juego (pestañas + deslizador),
 *    · el tráiler, que no carga YouTube hasta que le das al play.
 * ============================================================= */
(function () {
	'use strict';

	// ---------------------------------------------- carrusel

	document.querySelectorAll('.js-carrusel').forEach(function (raiz) {
		var pista = raiz.querySelector('.js-carrusel-pista');
		var prev = raiz.querySelector('.js-carrusel-prev');
		var next = raiz.querySelector('.js-carrusel-next');
		if (!pista || !prev || !next) { return; }

		function paso() {
			var item = pista.querySelector('li');
			return item ? item.getBoundingClientRect().width + 16 : pista.clientWidth * 0.8;
		}
		function estado() {
			var max = pista.scrollWidth - pista.clientWidth - 2;
			prev.disabled = pista.scrollLeft <= 2;
			next.disabled = pista.scrollLeft >= max;
		}
		prev.addEventListener('click', function () { pista.scrollBy({ left: -paso() * 2, behavior: 'smooth' }); });
		next.addEventListener('click', function () { pista.scrollBy({ left: paso() * 2, behavior: 'smooth' }); });
		pista.addEventListener('scroll', estado, { passive: true });
		window.addEventListener('resize', estado);
		estado();
	});

	// ---------------------------------------------- comparador

	document.querySelectorAll('.js-comparador').forEach(function (raiz) {
		var marco = raiz.querySelector('.js-comparador-marco');
		var antes = raiz.querySelector('.js-comparador-antes');
		var despues = raiz.querySelector('.js-comparador-despues');
		var rango = raiz.querySelector('.js-comparador-rango');
		var pie = raiz.querySelector('.js-comparador-pie');
		var pestanas = raiz.querySelectorAll('[data-par]');

		function mover(v) {
			marco.style.setProperty('--corte', v + '%');
			rango.setAttribute('aria-valuetext', v + ' % diseño');
		}
		rango.addEventListener('input', function () { mover(rango.value); });

		pestanas.forEach(function (b) {
			b.addEventListener('click', function () {
				pestanas.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
				var par = b.getAttribute('data-par');
				antes.src = antes.getAttribute('data-base') + 'diseno-' + par + '.jpg';
				despues.src = despues.getAttribute('data-base') + 'juego-' + par + '.jpg';
				antes.alt = 'Diseño inicial: ' + b.textContent.trim();
				despues.alt = 'Juego final: ' + b.textContent.trim();
				if (pie) { pie.textContent = b.getAttribute('data-pie') || ''; }
				rango.value = 50;
				mover(50);
			});
		});

		// Arrastrar directamente sobre la imagen, además del deslizador.
		var arrastrando = false;
		function desdePuntero(e) {
			var r = marco.getBoundingClientRect();
			var v = Math.round(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)));
			rango.value = v;
			mover(v);
		}
		marco.addEventListener('pointerdown', function (e) { arrastrando = true; marco.setPointerCapture(e.pointerId); desdePuntero(e); });
		marco.addEventListener('pointermove', function (e) { if (arrastrando) { desdePuntero(e); } });
		marco.addEventListener('pointerup', function () { arrastrando = false; });
		marco.addEventListener('pointercancel', function () { arrastrando = false; });

		mover(rango.value);
	});

	// ---------------------------------------------- tráiler

	document.querySelectorAll('.js-video').forEach(function (raiz) {
		var boton = raiz.querySelector('button');
		if (!boton) { return; }
		boton.addEventListener('click', function () {
			var id = raiz.getAttribute('data-video');
			var iframe = document.createElement('iframe');
			iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
			iframe.title = boton.getAttribute('aria-label') || 'Tráiler de NUBO';
			iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
			iframe.allowFullscreen = true;
			raiz.innerHTML = '';
			raiz.appendChild(iframe);
		});
	});
})();

/* =============================================================
 *  javiercanadilla.com — sin dependencias
 *  Modo de color, menú móvil, revelado al hacer scroll y volver arriba.
 * ============================================================= */
(function () {
	'use strict';

	var raiz = document.documentElement;
	var CLAVE = 'modo-color';

	// ---------------------------------------------- modo de color
	//
	// Tres estados: sin clase en <html> manda el sistema (lo resuelve el CSS
	// con prefers-color-scheme); .light o .dark son la elección del visitante,
	// que se recuerda en localStorage.

	var consulta = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

	function leerGuardado() {
		try {
			var v = localStorage.getItem(CLAVE);
			return (v === 'dark' || v === 'light') ? v : null;
		} catch (e) {
			return null;
		}
	}

	function modoEfectivo() {
		if (raiz.classList.contains('dark')) { return 'dark'; }
		if (raiz.classList.contains('light')) { return 'light'; }
		return (consulta && consulta.matches) ? 'dark' : 'light';
	}

	var botonesModo = Array.prototype.slice.call(document.querySelectorAll('.js-mode'));

	function pintarBotones() {
		var actual = modoEfectivo();
		botonesModo.forEach(function (boton) {
			boton.setAttribute('aria-pressed', String(boton.dataset.modo === actual));
		});
	}

	botonesModo.forEach(function (boton) {
		boton.addEventListener('click', function () {
			var elegido = boton.dataset.modo;
			raiz.classList.remove('light', 'dark');
			raiz.classList.add(elegido);
			try { localStorage.setItem(CLAVE, elegido); } catch (e) { /* sin almacenamiento */ }
			pintarBotones();
		});
	});

	// Mientras no haya elección explícita, seguir al sistema en caliente
	if (consulta) {
		var alCambiarSistema = function () { if (!leerGuardado()) { pintarBotones(); } };
		if (consulta.addEventListener) { consulta.addEventListener('change', alCambiarSistema); }
		else if (consulta.addListener) { consulta.addListener(alCambiarSistema); }
	}

	pintarBotones();

	// ---------------------------------------------- menú móvil

	var burger = document.querySelector('.js-nav-burger');
	var menu = document.querySelector('.js-nav-menu');

	if (burger && menu) {
		var cerrarMenu = function () {
			menu.classList.remove('is-open');
			burger.setAttribute('aria-expanded', 'false');
		};

		burger.addEventListener('click', function () {
			var abierto = menu.classList.toggle('is-open');
			burger.setAttribute('aria-expanded', String(abierto));
		});

		menu.addEventListener('click', function (e) {
			if (e.target.closest('a')) { cerrarMenu(); }
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && menu.classList.contains('is-open')) {
				cerrarMenu();
				burger.focus();
			}
		});
	}

	// ---------------------------------------------- revelado al hacer scroll

	var reveladas = document.querySelectorAll('.reveal');
	var animacionReducida = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (!reveladas.length) {
		// nada que hacer
	} else if (animacionReducida || !('IntersectionObserver' in window)) {
		Array.prototype.forEach.call(reveladas, function (el) { el.classList.add('is-visible'); });
	} else {
		var observador = new IntersectionObserver(function (entradas) {
			entradas.forEach(function (entrada) {
				if (entrada.isIntersecting) {
					entrada.target.classList.add('is-visible');
					observador.unobserve(entrada.target);
				}
			});
		}, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

		Array.prototype.forEach.call(reveladas, function (el) { observador.observe(el); });
	}

	// ---------------------------------------------- volver arriba

	var botonArriba = document.querySelector('.js-to-top');

	if (botonArriba) {
		var ultimo = false;
		var alScroll = function () {
			var visible = window.pageYOffset > 400;
			if (visible !== ultimo) {
				botonArriba.classList.toggle('is-visible', visible);
				ultimo = visible;
			}
		};

		window.addEventListener('scroll', alScroll, { passive: true });
		alScroll();

		botonArriba.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: animacionReducida ? 'auto' : 'smooth' });
		});
	}

})();

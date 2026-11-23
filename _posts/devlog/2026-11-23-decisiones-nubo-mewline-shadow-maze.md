---
layout: post
title: "Lo que decidí en Shadow Maze, NUBO y Mewline"
description: Tres puzles, nueve decisiones y el porqué de cada una.
keywords: devlog, diseño de juegos, decisiones, Shadow Maze, NUBO, Mewline, puzles, juegos para móvil, IA
date: 2026-11-23
categories: devlog
tags: Devlog ShadowMaze NUBO Mewline
excerpt_separator: <!--more-->
---
En mis juegos, la IA pone el arte, el código, la música y los textos. Yo pongo las decisiones: qué entra, en qué orden y qué se queda fuera. Aquí van tres de cada uno de mis puzles, con su porqué.
<!--more-->

## Shadow Maze {#shadow-maze}

Un laberinto a oscuras y una linterna que se está apagando.

### La luz baja con el reloj, no con los pasos

Estar quieto gasta igual que andar. Pararte a mirar el laberinto te cuesta lo mismo que recorrerlo, así que la luz no es una barra de vida: es el precio de cada segundo que pasas dentro.

### La Sombra nunca va más rápido que tú

Del cuarto mundo en adelante algo te persigue. Perseguir sin poder alcanzar es tensión; perseguir más rápido es una carrera perdida antes de empezar.

### Doce cosas que recordar, ni una más

Entre velas, puertas y placas, un nivel tiene como mucho doce. Es el límite del evaluador que puntúa los niveles, y también el punto en el que el jugador deja de llevar la cuenta. Cuando el techo técnico y el de diseño coinciden, la decisión se toma sola.

[Más sobre Shadow Maze]({{ '/projects/5-shadow-maze' | relative_url }})

## NUBO {#nubo}

Una nube que reparte el clima. Justo lo contrario de Shadow Maze: sin reloj y sin reflejos.

### De 5.000 niveles a 72

La máquina generó 5.000 niveles. Yo elegí los 72 que entraron, el orden en que la dificultad sube y da respiros, y muchas otras cosas que tuve que decidir. Cada región estrena una regla: el reparto 01 la presenta, el 02 enseña lo que implica y el 03 es el primer pico.

### Una gota en el icono

Hubo tres candidatos: Nubo con una gota, con un brote y con un rayo. El brote se emborronaba a 48 píxeles y el rayo ataba la identidad a la última región. Ganó la gota, que es lo que Nubo hace en todos los repartos.

### Las pistas no quitan estrellas

Están para aprender. Ver la solución completa sí cuenta: ese intento se queda en una estrella. Y la compra única desbloquea regiones, pero no da agua extra ni acorta ningún nivel.

[Más sobre NUBO]({{ '/projects/6-nubo' | relative_url }})

## Mewline {#mewline}

Un hilo de lana, una gata torpe y un tablero que hay que cubrir entero.

### Una sola solución

Cada tablero tiene una única solución, y se llega a ella pensando, nunca adivinando. Si hubiera dos, podrías llegar a la «otra» y el juego no te la aceptaría. Por eso un solucionador lo demuestra en los 180 niveles.

### Ninguna forma de perder

No hay vidas ni derrota. Si te equivocas, recoges el hilo y sigues. La tensión la ponen el reloj y las estrellas, nunca un castigo.

### El mismo reto diario en todos los móviles

No hay servidor: el tablero del día sale de una semilla que es la fecha. Por eso, cuando aceleré el solucionador, me puse una condición que no podía saltarme: explorar exactamente los mismos nodos, en el mismo orden. Si cambiaba uno solo, el reto dejaría de ser el mismo para todos.

[Más sobre Mewline, con un nivel para jugar aquí mismo]({{ '/projects/7-mewline' | relative_url }}#demo)

## Lo que tienen en común

Ninguna de estas decisiones es código, y todas acabaron siéndolo. Así trabajo: la IA ejecuta, y yo decido qué se construye, cómo y qué se queda fuera.

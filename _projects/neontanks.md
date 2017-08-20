---
layout: project
title: Neon Tanks
technologies: [Unity3D, Photon Unity Networking, C#, Jenkins, Mocha, Webdriver.io]
thumbnail: neontanks_thumb.png
image: neontanks.png
---

NeonTanks es el proyecto más grande que he desarrollado en mi especialización en los gráficos por ordenador y el desarrollo de los videojuegos. Se trata de un juego multijugador en tiempo real en el que los jugadores tienen que robar, con su tanque, la bandera enemiga para llevarla hasta su base.
  
Es el proyecto que presenté como Proyecto Fin de Máster, del **Máster Universitario en Informática Gráfica, Realidad Virtual y Juegos** de la **Universidad Rey Juan Carlos** de Madrid. El tribunal consideró que realicé un gran trabajo y que le dediqué mucho esfuerzo durante todo el desarrollo y, por ello, me otorgó un **10**.
<!--more-->

## Ambientación
La ambientación del juego está basada en un aspecto futurista con iluminación del mundo por neones del escenario y de los tanques con efecto _Bloom_.

> _Bloom:  se utiliza para provocar un brillo adicional alrededor de los objetos que emiten luz. En este caso se ha utilizado para los neones creando la ilusión de que los neones son más luminosos de lo que son en realidad._  

## Mecánica
El **jugador** dentro del juego consta de varios elementos con los que ir progresando:
- Nivel
- Experiencia
- Monedas
- Tanque
  
A su vez, el **tanque** consta de varias características que se pueden mejorar:
- Vida
- Blindaje
- Daño
- Velocidad
- Velocidad de disparo

Estas características se tienen que ir mejorando para progresar en el juego. El jugador con las monedas, que adquiere en las batallas, puede comprar mejoras del tanque. Pero sólo las podrá comprar si tiene el sufiente nivel como para desbloquear esa mejora. El nivel lo aumenta con la experiencia conseguida en las batallas.

![Interfaz de mejoras]({{site.url}}/assets/images/projects/neontanks/interfaz_mejoras.png "Interfaz de mejoras"){:.img-responsive}  

## Gameplay
Hay dos equipos el rojo y el azul. Cada equipo, con un máximo de 5 jugadores, tiene que robar un número determinado de veces la bandera enemiga y llevarla hasta su base para ganar la partida. La dificultad aumenta gracias al escenario que es un laberinto en el que te puedes perder y provocar que el equipo contrario te mate y, por tanto, defienda su bandera.

![Gameplay]({{site.url}}/assets/images/projects/neontanks/gameplay.png "Gameplay"){:.img-responsive}


El tanque consta de dos partes: el chasis y la torreta. Con el teclado se puede rotar y mover a través del mapa el chasis y con el ratón se puede apuntar a los enemigos de una forma fácil.

Además, cada 10 segundos a cada jugador se le activa un **Power Up** que le proporciona una mejora temporal sobre alguna cualidad del tanque (velocidad, recarga, daño) o que recupera la vida o blindaje del tanque.

Los **Power Up** que mejoran las características del tanque son temporales y tienen una duración limitada de 10 segundos. Una vez terminado este tiempo se vuelven a restaurar las características originales del tanque.

<p class="text-center">
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/damage.png"/>
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/speed.png"/>
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/reload.png"/>
</p>

Y los **Power Ups** que mejoran la vida y el blindaje, obviamente, no es por tiempo limitado sino que tendrán ese valor hasta que el tanque sufra daños.

<p class="text-center">
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/shield.png"/>
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/shield_blue.png"/>
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/hp.png"/>
  <img class="img-120x120" src="{{site.url}}/assets/images/projects/neontanks/hp_blue.png"/>
</p>

## Ecosistema
El juego está desarrollado para Windows Store y, además, tiene un ecosistema a su alrededor que le aporta un valor añadido. Tiene una aplicación web, con base de datos, que almacena toda la información del usuario permitiéndole desinstalar el juego y jugar en varios dispositivos diferentes sin perder el progreso.

La página web del juego está en este enlace:  
[NeonTanks]  
Desde ella los usuarios se registran para poder jugar y si inician sesión pueden ver la información completa de su usuario, cambiar su avatar, comprar mejoras para el tanque y ver el histórico de batallas que han realizado. También tiene un sistema de tickets que permite enviar sugerencias, pedir ayuda o avisar de un error fácilmente.

## Tecnologías utilizadas
### Unity 3D
El juego está desarrollado en **Unity 3D** y se ha utilizado **C#** como lenguaje de scripting. Además, se ha utilizado **Photon Unity Networking ([PUN])** como librería multijugador. 

### Symfony 2.8
Para la aplicación web se ha utilizado **[Symfony] 2.8** como framework de programación. También, se ha desarrollado la API Rest que comunica el juego con la aplicación web y que almacena toda la información del usuario para que pueda cambiar de dispositivo y mantenga su progreso.

### Jenkins
Para el despliegue de la aplicación web, se ha creado un _job_ de **Jenkins** con el que automatizar el proceso. Este _job_ lee el repositorio de **Github**, descargar los últimos cambios y los despliega en el servidor web (Apache) en cuestion de **40 segundos**.
Gracias a esta automatización, se ahorra más de 1 hora en el despliegue de una versión y sobre todo, se evitan posibles caídas del servicio web.

### NodeJS: Mocha y Webdriver.io
Por otro lado, y para mi tranquilidad, se ha desarrollado una batería de **tests funcionales** con **Mocha** y **Webdriver.io** que permite comprobar automáticamente que toda la aplicación web funciona a la perfección.

## Descarga
El juego está disponible para descargar a través de la tienda de Windows 10. En el siguiente enlace:

<a target="_blank" href="https://www.microsoft.com/store/apps/9nblggh4qdt9?ocid=badge">
<img style="max-height: 50px !important; " src="https://assets.windowsphone.com/f2f77ec7-9ba9-4850-9ebe-77e366d08adc/English_Get_it_Win_10_InvariantCulture_Default.png" alt="Get it on Windows 10"/>
</a>

[NeonTanks]: http://neontanks.mundoescena.es
[PUN]: https://www.photonengine.com/en-US/PUN
[Symfony]: https://symfony.com/
---
layout: project
title: Mundo Escena
technologies: [Symfony 2.8, MySQL, PHP]
thumbnail: '/mundoescena/mundoescena.png'
image: '/mundoescena/mundoescena.png'
---

MundoEscena, mi red social. Es el proyecto que he hecho con más cariño de todos. El que más me ha gustado preparar, desarrollar y testear. Fue un trabajo muy duro, muchísimas horas de desarrollo y de detalles en todas las secciones que tiene. Se trata de mi **Proyecto Fin de Grado** del **Grado en Ingeniería del Software**. El tribunal consideró que realicé un gran trabajo y, por ello, me otorgaron un **10** y lo propusieron para **Mención de Honor**.
<!--more-->

## Objetivo
La red social tenía como objetivo ser un escaparate para todas las personas que se dedican al mundo del espectáculo, un lugar en el que puedan poner donde serán sus próximas actuaciones, publicar sus vídeos, de qué tratan sus espectáculos y que los fans los comenten y puntuen de forma fácil.

## Desarrollo
El proyecto tiene más de 50 tablas de base de datos y más de 29.000 líneas de código. Se desarrolló siguiendo la metodología Scrum con sprints de 2 semanas. En las que se planificaba, desarrollaba y, posteriormente, se probaban todas las mejoras que se habían desarrollado.

A continuación, se muestra el resultado de algunas páginas:

**Página de inicio** donde el usuario puede ver lo que han publicado sus amigos y lo que ha publicado él.  

<img src="{{site.url}}/assets/images/projects/mundoescena/inicio.png" class="img-responsive"/>

**Página de biografía** donde el usuario puede ver sus publicaciones. Si entra en el perfil de otro usuario u organización (compañía, sala de teatro o asociación) verá las publicaciones de ese perfil.  

<img src="{{site.url}}/assets/images/projects/mundoescena/biografia.png" class="img-responsive"/>  
<img src="{{site.url}}/assets/images/projects/mundoescena/compania.png" class="img-responsive"/>

Como vemos todas las páginas tienen un estilo acorde con el resto, iconos personalizados para expresar mejor a qué se refieren y la interfaz de usuario es 100% responsive por lo que se adapta perfectamente a todos los tamaños de pantalla.

## Tecnologías
Como ya se ha explicado anteriorente, el proyecto se ha desarrollado con Symfony 2.8 y, también, se ha integrado con Jenkins.

### Jenkins
Para el despliegue de la aplicación web, se ha creado un _job_ de **Jenkins** con el que automatizar el proceso. Este _job_ lee el repositorio de **Github**, descargar los últimos cambios y los despliega en el servidor web (Apache) en cuestion de **40 segundos**.
Gracias a esta automatización, se ahorra más de 1 hora en el despliegue de una versión y sobre todo, se evitan posibles caídas del servicio web.

## Sitio web

El link a la versión que está publicada es [MundoEscena]

[MundoEscena]: http://mundoescena.es
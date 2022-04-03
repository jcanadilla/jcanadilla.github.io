---
layout: post
title:  "Estas son las librerías más útiles de JavaScript / Typescript"
date:   2022-04-03 10:20:15 +0200
categories: Programación JavaScript
tags: JavaScript Typescript BigData IoT
image: lodash-bluebird.png
main-image: lodash-bluebird.png
excerpt_separator: <!--more-->
---
Hoy en día, con el pleno desarrollo de la inteligencia artificial, el big-data, IoT y la utilización de tantos dispositivos móviles en el mundo, la cantidad de datos que se generan es inmensa. Y, es por esto que también las aplicaciones están creciendo en la cantidad de información que controlan en proyectos que tengan que ver con estos ámbitos y con muchos otros.

Así que aquí van las que para mí son las librerías más útiles que más utilizo y que, sin duda, deberías conocer para hacer frente a tantísima cantidad de datos. Con ellas podrás modificar, filtrar, ordenar, hacer cálculos, re-estructurar la información, etc.

# Lodash
[Lodash](https://lodash.com/) es la librería por excelencia para el control y manejo de colecciones y arrays pero no solo eso. Lodash es mucho más. Tiene multitud de funciones, muy sencillas de utilizar, que sirven para hacer operaciones matemáticas, comparadores del lenguaje, operaciones con strings y muchas más utilidades. Si no la has utilizado nunca, estoy seguro de que te sorprenderá. Es cierto que muchas funcionalidades que aporta se encuentran nativas en el lenguaje de JavaScript pero aun así es una librería que te puede ayudar a hacer lo que quieras.

Comunmente se importa como **_** y así es muy fácil de identificar en toda la aplicación.

Aquí te dejo algunos ejemplos de uso de Lodash y te invito a que **escribas en los comentarios** cuál es la función de **lodash** que más útil te resulta:

```javascript
const _ = require('lodash');

const zeroToTen = _.range(0, 10); // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
const tenToZero = _rangeRight(0, 10); // [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ]

const multipleOfTwo = _.filter(zeroToTen, n => n % 2 === 0); // [ 0, 2, 4, 6, 8 ]

const player = {
	name: 'John',
	age: 30,
	isAlive: true,
	email: undefined,
	address: {
		street: 'Main Street',
		number: 123,
		city: 'New York',
		country: 'USA'
	}
}

const name = _.get(player, 'name'); // John
const street = _.get(player, 'address.street'); // Main Street
const email = _.get(player, 'email', 'no-email-provided'); // no-email-provided

```

# Bluebird.js
Otra gran librería que te puede ayudar a hacer frente a muchos datos y que te permite hacer operaciones asíncronas. De esta forma no tienes que esperar a que se complete una operación para continuar con otra. Bluebird también permite que operaciones **síncronas** como las anteriores que hemos visto en **Lodash** sean asíncronas. Y en los ejemplos te explicaré como hacerlo.

[Bluebird](http://bluebirdjs.com/) tiene una documentación un poco más complicada que la de lodash pero aún así es sencilla de entender y cuando hagas unos cuantos ejemplos te resultará algo muy práctico. Yo suelo importar el paquete como Bluebird y así es muy fácil de identificar en toda la aplicación.

```javascript
const Bluebird = require('bluebird');
const _ = require('lodash');

(async () => {
	// Esta función simplemente es para utilizar async/await

	const zeroToTen = _.range(0, 10); // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
	const sum = await Bluebird.reduce(zeroToTen, (acc, n) => acc + n, 0);

	console.log(sum); // 45
})();
```

En el ejemplo anterior de Bluebird estoy utilizando la función **reduce** de Bluebird. Esta función nos permite recorrer el array anterior *zeroToTen* y además, aplicar una función a cada elemento del array. En este caso, la función recibe dos parámetros: el primer parámetro es el acumulador, el segundo es el elemento actual del array. En este caso, la función es la suma de los elementos del array.

En el siguiente ejemplo, te muestro como utilizarlo con un array de objetos:

```javascript
const Bluebird = require('Bluebird');
const axios = require('axios');

(async () => {
	const pokemonsResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/');
	const pokemons = pokemonsResponse.data.results;

	const mappedByName = await Bluebird.reduce(pokemons, async (acc, pokemon) => {
		
		// Obtenemos la información de este pokemon
		const response = await axios.get(pokemon.url);

		// Obtenemos los campos que nos interesan del objeto pokemon
		const { id, name, weight, types } = response.data;

		return {
			// Muy importante devolver el contenido del acumulador!
			...acc,
			// Agregamos el nuevo elemento al acumulador
			[name]: {
			 	id,
				name,
				weight,
				types
			}
		};
	}, {});

	console.log(mappedByName);
})();
```

Dime en los comentarios qué te han parecido estas dos librerías, si las conocías o no y cuales son las que librerías que más utilizas tu. Espero que te haya resultado interesante el post. Si ha sido así, compártelo con otros usuarios. Nos vemos en el siguiente post.

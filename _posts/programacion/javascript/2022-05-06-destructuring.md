---
layout: post
title: Forma elegante de extraer datos de un objeto o un array
description: Aprende a extraer información de un objeto o de un array como un auténtico PRO. Utilizando destructuring podrás extraer los datos de un objeto o de un array de forma muy elegante.
date: 2022-05-06
categories: programacion destructuring
tags: JavaScript Typescript Destructuring PRO
image: dos-pantallas-teclado.jpg
main-image: dos-pantallas-teclado.jpg
excerpt_separator: <!--more-->
---
Si estás aquí para conocer la forma más elegante de extraer datos de un objeto o de un array muy atento porque te voy a presentar el **Destructuring**.

## ¿Destructuring?
Pensarás que es una técnica muy difícil de entender y muy compleja de utilizar en el día a día. Pensarás que casi nunca lo llegarás a utilizar en una aplicación. O que tendrás que instalar una librería muy pesada en tu proyecto. Nada más lejos de la realidad. Es muy sencillo, muy útil y rápido de utilizar. Tanto que no necesitas instalar nada en tu aplicación porque forma parte del lenguaje.

## Vale, te creo. ¿Cómo funciona?
El **destructuring** es una técnica que permite extraer datos de un objeto o de un array de forma muy elegante. Además, evitas poner *magic numbers* en el código para extraer posiciones concretas de un array, hasta cierto límite.

### Destructuring con objetos
Te pongo un ejemplo con un objeto:

```javascript

// Supongamos que buscamos un usuario en nuestra base de datos
const user = await User.findById(id);

// Y ahora del usuario, sólo nos interesa quedarnos con algunos datos
// En este caso, queremos quedarnos con el nombre, email y contraseña
const { name, email, password } = user;

// ¿Sencillo no?
console.log(name);
console.log(email);
console.log(password);

```

Como puedes ver en el ejemplo anterior, el **destructuring** utiliza la sintaxis de objeto *{* *}* para extraer los datos en nuevas variables. Así la variable **name** tendrá el valor del nombre del usuario, **email** el valor del email del usuario y **password** el valor de la contraseña del usuario.

También podemos acceder a objetos dentro de otro objeto:

```javascript

// Supongamos que buscamos un usuario en nuestra base de datos
const user = await User.findById(id);

// Y en este ejemplo queremos la dirección del usuario que, a su vez contiene, una dirección
const { address: { street, city } } = user;

// ¿Sencillo no?
console.log(street);
console.log(city);

```

En este caso, hay que tener más cuidado porque *address* puede ser **undefined** y eso provocaría un error al intentar acceder a una propiedad de un objeto que no está definido.

### Destructuring con arrays
Vale, también te dije que podíamos usar **destructuring** para extraer datos de un array de forma elegante. Vamos con el ejemplo:

```javascript

// En este caso, tenemos un array de usuarios que tenemos en la base de datos
const users = await User.find();

// Queremos quedarnos con el primer usuario
const [user] = users;

```

Al poner el **[user]**, el **destructuring** extrae el primer usuario del array y lo guarda en la variable **user**.

Otro ejemplo para quedarnos con el segundo usuario:

```javascript

const users = await User.find();

// Queremos quedarnos con el segundo usuario

// FEO:
const user = users[1];

// ELEGANTE:
const [, user] = users;

```
> ¡OJO! Hay que comprobar que el array no esté vacío y que contenga al menos los elementos que queremos extraer con el **destructuring**.

Al poner la coma en el **[, user]**, el **destructuring** extrae el segundo usuario del array y lo guarda en la variable **user**.

Y por otro lado, ¿que pasa si queremos quedarnos con el *resto* de usuarios o de propiedades de un objeto? Con el resto me refiero a que quiero quitar una propiedad de un objeto o un array y quedarme con las demás. Vamos con ello.

### Excluir una propiedad de un objeto
Para excluir propiedades de un objeto hay que utilizar el operador **spread**. Muy probablemente dedique otro post para verlo pero de momento podemos ver unas pinceladas en este post.

Vamos con el ejemplo:

```javascript

// En nuestra base de datos tenemos un usuario con toda la información
// Sin embargo, no queremos devolver la contraseña (aunque esté encriptada). Para no exponer esta información.

// ¿Cómo podemos hacerlo?
const user = await User.findById(id);

// En este caso, queremos quedarnos con todo el usuario excepto la contraseña
const { password, ...partialUser } = user;

// Y lo que devolveremos en la API será la variable: partialUser
console.log(partialUser); // Tendrá todo el usuario excepto la contraseña

// ¿Sencillo no?

```

### Excluir un elemento de un array
Para excluir un elemento de un array podemos utilizar **destructuring** con el operador **spread**. Pero, tiene algunas restricciones y es que sólo podemos quitar elementos desde el inicio. Veamos como:

```javascript

// En nuestra base de datos tenemos un array de usuarios con toda la información
const users = await User.find();

// En este caso, queremos quedarnos con todos los usuarios excepto el primero
const [user, ...otherUsers] = users;

// Y lo que devolveremos en la API será la variable: otherUsers
console.log(otherUsers); // Tendrá todos los usuarios excepto el primero

``` 

Lo que **NO** podemos hacer es quedarnos con el último usuario porque el *spread operator* no puede ponerse al principio del array, sólo puede ponerse al final.

```javascript

// En nuestra base de datos tenemos un array de usuarios con toda la información
const users = await User.find();

// En este caso, queremos quedarnos con todos los usuarios excepto el último
const [...otherUsers, user] = users; // ¡ERROR! Uncaught SyntaxError: Rest element must be last element

```

Estoy seguro de que a partir de ahora no pararás de utilizar este método para extraer información de un objeto o para quedarte con el resto de elementos de un array.

¡Nos vemos programando!


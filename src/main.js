/**
 Pasos a seguir para instalar Docker, PostgreSQL y establecer los ajustes iniciales
 */


// Yo he instalado la biblioteca "dotenv" (npm i dotenv --save) -> https://www.npmjs.com/package/dotenv para esconder las variables en el repositorio público
// Además, he ignorado el archivo .env escribiendo su nombre en el archivo .gitignore
// Por otro lado, para poder establecer la coneción, es necesaria la biblioteca "pg" (npm i pg) -> https://www.npmjs.com/package/pg 
require('dotenv').config()
const { Readline } = require('node:readline/promises');
const { Client } = require('pg');

// https://dev.to/mohsenkamrani/run-postgresql-with-docker-locally-and-connect-to-it-with-nodejs-451g
/**
 * -> docker run --name [name-of-docker-container] -p 5432:5432 -e POSTGRES_PASSWORD=[password] -e POSTGRES_USER=[user] -d postgres
 * -> docker ps
 * -> docker exec -ti [name-of-docker-container] bash
 * -> psql -h localhost -U [username]
 * -> CREATE DATABASE [name-of-db = p.e: employees];
 * -> \l
 * -> \c [name-of-db];
 * -> CREATE TABLE tech_authors(ID INT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL, TYPE TEXT NOT NULL, CATEGORY TEXT NOT NULL, ATICLES INT NOT NULL);
 * -> INSERT INTO tech_authors VALUES (1, 'Laiba', 'Senior', 'Docker', 50);
 * -> SELECT * FROM tech_authors;
 */





/**
 Pasos a seguir con docker:
 1 - Abrir Docker Desktop
 2 - Seleccionar "Imágenes" en la barra lateral izquierda
 3 - Seleccionar el icono de "play" en el recuadro de "postgres"
 4 - Abrir el menú expandible de las opciones adicionales
 5 - Poner un nombre a nuestro nuevo contenedor
 6 - Escribir un puerto (por defecto: 5432)
 7 - Pulsar las opciones de "Host path", crear y seleccionar una carpeta (usualmente en Documentos>docker-volumes(así nombré yo a la que creé en ese momento))
 8 - Escribir "POSTGRES_USER" en el input de la variable de entorno y en su valor, el rol con el que hayáis iniciado sesión al instalar PSQL
 9 - Escribir "POSTGRES_PASSWORD" en el input de debajo, y, en su valor, la contraseña de vuestro rol  
 */


// 10 - Definir el objeto que nos permitirá conectarnos:
/**
 * user: [valor de POSTGRES_USER]
 * host: [usualmente "localhost"]
 * database: [nombre de la base de datos, en nuestro caso el nombre del contenedor]
 * password: [valor de POSTGRES_PASSWORD]
 * port: [el puerto que hayamos escogido, por defecto: 5432]
 */
const connectionData = {
    user: process.env.SECRET_U, 
    host: process.env.SECRET_H, 
    database: process.env.SECRET_DB, 
    password: process.env.SECRET_P, 
    port: process.env.SECRET_PORT,
}

const schemaEmployees = `CREATE TABLE employees(
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    title TEXT NOT NULL
);`;

const schemaDepartaments = `CREATE TABLE departaments(
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    title TEXT NOT NULL
);`;

const createEmployees = () => client.query(schemaEmployees, showRows);
const createDepartaments = () => client.query(schemaDepartaments, showRows);

function alter (alteringThing, alteringName, typeAlter, alteredThing ,alteredName, alteredTyping) {
    client.query(`${String(alteringThing).toUpperCase()}${String(alteringName).toLocaleLowerCase()}
    ${String(typeAlter).toUpperCase()}${String(alteredThing).toUpperCase()}${String(alteredName).toLowerCase}${String(alteredTyping).toUpperCase()};`)
} // alter no funciona en sqlite

function pushTable (insertTableName, fields, values) {
    const valueDecorator = (arr) => arr.map(v => typeof v == 'string' ? `'${v}'` : v).join(', ');
    const query = `
    INSERT INTO ${String(insertTableName).toLocaleLowerCase()}(${String(fields)})
    VALUES (${valueDecorator(values)});`
    client.query(query);
}

// 11 - Establecer conexión
const client = new Client(connectionData);
client.connect().then(() => {
    // pushTable('employees', 'id, name, age', [1, "Allan", 30])
    client.query('SELECT * FROM employees', showRows);

}).catch(err => {
    console.error(err);
    client.end();
    process.exit(1);
})

const showRows = (err, res) => {
    if (err != null) {
        console.log(err.message);
    } else {
        const fields = res.fields.map(v => v.name);
        console.log(fields)
        console.log(res.rows)
    }

    client.end();
    process.exit(1);
};
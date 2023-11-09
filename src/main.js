require('dotenv').config()
const { Client } = require('pg');
// He instalado la biblioteca "dotenv" (npm i dotenv --save) -> https://www.npmjs.com/package/dotenv para esconder las variables en el repositorio público
// Además, he ignorado el archivo .env escribiendo su nombre en el archivo .gitignore
// Por otro lado, para poder establecer la conexión, es necesaria la biblioteca "pg" (npm i pg) -> https://www.npmjs.com/package/pg 

// https://dev.to/mohsenkamrani/run-postgresql-with-docker-locally-and-connect-to-it-with-nodejs-451g
// https://www.commandprompt.com/education/how-to-create-a-postgresql-database-in-docker/ 

// SQL handbook -> https://www.freecodecamp.org/news/a-beginners-guide-to-sql/ 

/** 
 * CREAR TABLA CON DOCKER DESDE LA CONSOLA BASH 
 * -> docker run --name [name-of-docker-container] -p 5432:5432 -e POSTGRES_PASSWORD=[password] -e POSTGRES_USER=[user] -d postgres
 * -> docker ps
 * -> docker exec -ti [name-of-docker-container] bash
 * -> psql -h localhost -U [username]
 * -> CREATE DATABASE [name-of-db = p.e: testdb];
 * -> \l
 * -> \c [name-of-db];
 * -> CREATE TABLE tech_authors(ID INT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL, TYPE TEXT NOT NULL, CATEGORY TEXT NOT NULL, ATICLES INT NOT NULL);
 * -> INSERT INTO tech_authors VALUES (1, 'Laiba', 'Senior', 'Docker', 50);
 * -> SELECT * FROM tech_authors;

    (existe esta forma o cambiando el comando inicial por el que recomienda docker en la imagen de postgreSQL -> https://hub.docker.com/_/postgres)

 -> La tabla será alojada en el sistema y podrá verse en la app pgAdmin, usualmente en el servidor y con el usuario y contraseña principales.
 En mi caso, se crea en un servidor llamado 'PostgreSQL 16', en la base de datos 'postgres';
 Por esta razón, también podéis conectaros al servidor que creéis desde pgAdmin, crearos otra base de datos y nombrarla como queráis para conectaros a ella, 
 o incluso creárosla desde la consola de "SQL powershell (psql)" que podéis encontrar una vez descarguéis PostgreSQL escribiendo psql en el buscador de inicio.
 */

// 10 - Definir el objeto que nos permitirá conectarnos:
/**
 * user: [valor de POSTGRES_USER]
 * host: [usualmente "localhost"]
 * database: [nombre de la base de datos, en nuestro caso el nombre del contenedor]
 * password: [valor de POSTGRES_PASSWORD]
 * port: [el puerto que hayamos escogido, por defecto: 5432] -> esto junto al host os conectará al server que tengáis creado o creéis
 */
const connectionData = {
    user: process.env.SECRET_U, 
    host: process.env.SECRET_H, 
    database: process.env.SECRET_DB, 
    password: process.env.SECRET_P, 
    port: process.env.SECRET_PORT,
}

// 11 - Establecer conexión
const client = new Client(connectionData);

const simpleTypeQuery = (query) => {client.query(String(query), showRows)}

client.connect().then(() => {
    console.log(process.env.SECRET_P)
    // simpleTypeQuery('SELECT NOW()');

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
        console.log(res.rows)
    }

    client.end();
    process.exit();
};


// -----------------------------------------------------------------------------------------------
const exampleSchemaEmployees = `CREATE TABLE employees(
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    title TEXT NOT NULL
);`;

const exampleSchemaDepartaments = `CREATE TABLE departaments(
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    title TEXT NOT NULL
);`;

const createEmployees = () => client.query(exampleSchemaEmployees, showRows);
const createDepartaments = () => client.query(exampleSchemaDepartaments, showRows);

const alterTable = (alteringThing, alteringName, typeAlter, alteredThing ,alteredName, alteredTyping) => {
    client.query(`ALTER ${String(alteringThing).toUpperCase()}${String(alteringName).toLocaleLowerCase()}
    ${String(typeAlter).toUpperCase()}${String(alteredThing).toUpperCase()}${String(alteredName).toLowerCase}${String(alteredTyping).toUpperCase()};`)
} // alter no funciona en sqlite

const pushTable = (insertTableName, fields, values) => {
    const valueDecorator = (arr) => arr.map(v => typeof v == 'string' ? `'${v}'` : v).join(', ');
    const query = `
    INSERT INTO ${String(insertTableName).toLocaleLowerCase()}(${String(fields)})
    VALUES (${valueDecorator(values)});`
    client.query(query);
}

const updateTable = (insertTableName, changes, condition) => {
    const valueDecorator = (arr) => arr.map(v => typeof v == 'string' ? `'${v}'` : v).join(', ');
    const query = `
    UPDATE ${String(insertTableName).toLocaleLowerCase()}
    SET ${changes}
    WHERE ${condition};`
    client.query(query);
}
# postgre-connect-node
Template for connections between nodeJS and a postgres BD with or without Docker


## Bibliotecas necesarias: 
* [pg](https://www.npmjs.com/package/pg) -> para establecer la conexión con el servidor y escribir queries en formato SQL

`npm i pg`

## Bibliotecas opcionales
* [dotenv](https://www.npmjs.com/package/dotenv) -> para esconder tus contraseñas

`npm i dotenv --save`



# Pasos para crear una tabla con docker desde la consola bash
1. `docker run --name [name-of-docker-container] -p 5432:5432 -e POSTGRES_PASSWORD=[password] -e POSTGRES_USER=[user] -d postgres`
2. `docker ps`
3. `docker exec -ti [name-of-docker-container] bash`
4. `psql -h localhost -U [username]`
5. `CREATE DATABASE [name-of-db = p.e: testdb];`
6. `\l`
7. `\c [name-of-db];`
8. `CREATE TABLE tech_authors(ID INT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL, TYPE TEXT NOT NULL, CATEGORY TEXT NOT NULL, ATICLES INT NOT NULL);`
9. `INSERT INTO tech_authors VALUES (1, 'Laiba', 'Senior', 'Docker', 50);`
10.` SELECT * FROM tech_authors;`


*Existe esta forma o cambiando el comando inicial por el que recomienda docker en la [imagen de postgreSQL](https://hub.docker.com/_/postgres)*

- La tabla será alojada en el sistema y podrá verse en la app pgAdmin, usualmente en el servidor y con el usuario y contraseña principales.
En mi caso, se crea en un servidor llamado 'PostgreSQL 16', en la base de datos 'postgres';
Por esta razón, también podéis conectaros al servidor que creéis desde pgAdmin, crearos otra base de datos y nombrarla como queráis para conectaros a ella, 
o incluso creárosla desde la consola de "SQL powershell (psql)" que podéis encontrar una vez descarguéis PostgreSQL escribiendo psql en el buscador de inicio.

### Definir el objeto que nos permitirá conectarnos
~~~
const connectionData = {
user: [valor de POSTGRES_USER],
host: [usualmente "localhost"],
database: [nombre de la base de datos, en nuestro caso el nombre del contenedor],
password: [valor de POSTGRES_PASSWORD],
port: [el puerto que hayamos escogido, por defecto: 5432] // esto junto al host os conectará al server que tengáis creado o creéis,
}
~~~

### Establecer conexión
`const client = new Client(connectionData);`

&&
~~~
client.connect().then(() => {
    client.query('SELECT NOW()');

}).catch(err => {
    console.error(err);
    client.end();
    process.exit(1);
})
~~~



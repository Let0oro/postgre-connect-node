require('dotenv').config()
const { Client } = require('pg');

const connectionData = {
    user: 'user-name', 
    host: 'localhost', 
    database: 'exampledb', 
    password: 'secret', 
    port: 5432,
}

const client = new Client(connectionData);

const simpleTypeQuery = (query) => {client.query(String(query), showRows)}

client.connect().then(() => {
    simpleTypeQuery('SELECT NOW()');

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
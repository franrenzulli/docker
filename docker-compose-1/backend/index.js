const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000; // Puerto donde escuchará la API dentro del contenedor

// Configuración de la conexión a la base de datos
// Estas variables de entorno serán inyectadas por docker-compose
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const client = new Client(dbConfig);

// Conectar a la base de datos cuando la aplicación inicia
client.connect()
    .then(() => {
        console.log('Conectado a PostgreSQL');
        // Crear una tabla simple si no existe
        return client.query(`
            CREATE TABLE IF NOT EXISTS mensajes (
                id SERIAL PRIMARY KEY,
                texto VARCHAR(255) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    })
    .then(() => console.log('Tabla "mensajes" verificada/creada'))
    .catch(err => console.error('Error al conectar o crear tabla:', err.stack));

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Endpoint para obtener todos los mensajes
app.get('/mensajes', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM mensajes ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener mensajes:', err.stack);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

// Endpoint para agregar un nuevo mensaje
app.post('/mensajes', async (req, res) => {
    const { texto } = req.body;
    if (!texto) {
        return res.status(400).json({ error: 'El campo "texto" es requerido.' });
    }
    try {
        const result = await client.query('INSERT INTO mensajes(texto) VALUES($1) RETURNING *', [texto]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al insertar mensaje:', err.stack);
        res.status(500).json({ error: 'Error al insertar mensaje' });
    }
});

// Ruta raíz simple
app.get('/', (req, res) => {
    res.send('API de mensajes funcionando. Prueba /mensajes');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de API escuchando en el puerto ${port}`);
});

// Manejo de errores para cerrar la conexión de la DB
process.on('SIGINT', () => {
    client.end(() => {
        console.log('Conexión a PostgreSQL cerrada.');
        process.exit();
    });
});
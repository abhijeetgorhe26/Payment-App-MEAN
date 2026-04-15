import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'paymentuser',
    password: 'radhika',
    port: 5432
});


pool.connect().then((client) => {
    console.log("Successfullly connected....")
    client.release;
}).catch(err => console.error("Connection error...", err.stack));


export default pool;
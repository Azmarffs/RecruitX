const sql = require('mssql');
require('dotenv').config();

console.log(process.env.DB_DATABASE);
const config = {
    user: "nuss",
    password: "N123456",
    server: "NOORAYY", 
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: "MSSQLSEVER",
    },
    port: parseInt(process.env.DB_PORT) || 1433
}
const connectDB = async () =>
{
    try
    {
        await sql.connect(config);
        console.log('Database Connected');
    }
    catch (err)
    {
        console.log('Database connection failed:', err);
    }
};

module.exports = {connectDB, sql};

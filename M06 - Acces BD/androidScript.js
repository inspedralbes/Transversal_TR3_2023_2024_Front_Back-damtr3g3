const bcrypt = require('bcrypt');
module.exports = {registrarUsuariJoc, getUsuarisLogin};

async function registrarUsuariJoc(connection, usuari){
    try {
        // INSERT
        console.log(usuari)
        const { nomUsuari, correu, contrasenya } = usuari;
        
        // Generar el salt y el hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasenya, salt);

        const [result] = await connection.execute(
            'INSERT INTO Usuaris (nomUsuari, correu, contrasenya, salt) VALUES (?,?,?,?)',
            [nomUsuari, correu, hashedPassword, salt]
        );

        // Casos Error
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar usuari:', error.message);
        throw error;
    }
}

async function getUsuarisLogin(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT user_id, nomUsuari, contrasenya, salt FROM Usuaris');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}
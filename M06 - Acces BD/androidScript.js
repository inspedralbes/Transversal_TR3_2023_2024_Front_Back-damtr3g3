module.exports = {registrarUsuariJoc, getUsuarisLogin};

async function registrarUsuariJoc(connection, usuari){
    try {
        // INSERT
        console.log(usuari)
        const { nomCognoms, correu, contrasenya } = usuari;
        const [result] = await connection.execute(
            'INSERT INTO Usuaris (nomCognoms, correu, contrasenya) VALUES (?,?,?)',
            [nomCognoms, correu, contrasenya]
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
        const [rows, fields] = await connection.execute('SELECT user_id, correu, contrasenya FROM Usuaris');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}


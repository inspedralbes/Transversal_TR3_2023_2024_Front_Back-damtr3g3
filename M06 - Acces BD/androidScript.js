const bcrypt = require('bcrypt');
module.exports = {registrarUsuariJoc, getUsuarisLogin, updateScore, getInventariUsuari, afegirInventari, getOnlyProductsUsuari, 
    getUserMoney, restarDiners};

async function registrarUsuariJoc(connection, usuari){
    try {
        // INSERT
        console.log(usuari)
        const { nomUsuari, correu, contrasenya } = usuari;
        
        // Comprobar si el nombre de usuario ya existe
        const [usuarios] = await connection.execute(
            'SELECT * FROM Usuaris WHERE nomUsuari = ?',
            [nomUsuari]
        );

        if (usuarios.length > 0) {
            console.error('Error: El nombre de usuario ya existe.');
            return false;
        }
        
        // Generar el salt y el hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasenya, salt);

        const [result] = await connection.execute(
            'INSERT INTO Usuaris (nomUsuari, correu, contrasenya, salt, diners) VALUES (?,?,?,?, 0)',
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

async function updateScore(connection, score, username){
    try{
        const [result] = await connection.execute(
            'UPDATE Usuaris SET diners = diners + ? WHERE nomUsuari = ?',
            [score, username]
        );
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al actualizar score:', error.message);
        throw error;
    }
}

async function restarDiners(connection, username, amount){
    try{
        const [result] = await connection.execute(
            'UPDATE Usuaris SET diners = diners - ? WHERE nomUsuari = ?',
            [amount, username]
        );
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al restar dinero:', error.message);
        throw error;
    }
}


async function getInventariUsuari(connection, nomUsuari) {
    try {
        const [rows, fields] = await connection.execute('SELECT product_id FROM Inventario WHERE nomUsuari = ?', [nomUsuari]);
        const inventariJson = JSON.stringify(rows);
        return inventariJson;
    } catch (error) {
        console.error('Error al obtener inventario del usuario:', error.message);
        throw error;
    }
}

async function getOnlyProductsUsuari(connection, nomUsuari) {
    try {
        const [rows, fields] = await connection.execute('SELECT product_id FROM Inventario WHERE nomUsuari = ?', [nomUsuari]);
        const productIds = rows.map(row => row.product_id);
        return productIds;
    } catch (error) {
        console.error('Error al obtener inventario del usuario:', error.message);
        throw error;
    }
}

async function afegirInventari(connection, playerId, productId){
    try {
        const [result] = await connection.execute(
            'INSERT INTO Inventario (nomUsuari, product_id) VALUES (?,?)',
            [playerId, productId]
        );
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar producto en inventario:', error.message);
        throw error;
    }
}

async function getUserMoney(connection, username){
    try {
        const [rows, fields] = await connection.execute('SELECT diners FROM Usuaris WHERE nomUsuari = ?', [username]);
        return rows[0].diners;
    } catch (error) {
        console.error('Error al obtener dinero del usuario:', error.message);
        throw error;
    }
}


async function startGame(socket, io){
    socket.on('START_GAME', async (salaInfo) => {
        console.log('Start Game emit rebut', salaInfo);
        try {
            io.to(salaInfo.idSala).emit('GAME_STARTED', salaInfo.idSala);
            console.log('Game started a la sala', salaInfo.idSala);
            console.log("Llista d'usuaris a la sala", io.sockets.adapter.rooms.get(salaInfo.idSala));
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

async function listenKeyUp(socket, io){
    socket.on('keyUp', async(data) => {
        //console.log('KeyDown emit rebut', data);
        let parsedData = JSON.parse(data);
        try {
            io.to(parsedData.salaId).emit('key_up', parsedData);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

async function listenKeyDown(socket, io){
    socket.on('keyDown', async(data) => {
        //console.log('KeyUp emit rebut', data);
        let parsedData = JSON.parse(data);
        try {
            io.to(parsedData.salaId).emit('key_down', parsedData);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });

}

async function checkPositions(socket, io){
    socket.on('user_position', async(data) => {
        //console.log('User Position emit rebut', data);
        try {
            io.to(data.salaId).emit('update_positions', data);
            //console.log('User Position enviat a la sala', data.salaId);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

async function checkHitByLog(socket, io){
    socket.on('hitByLog', async(data) => {
        //console.log('Hit by log emit rebut', data);
        let parsedData = JSON.parse(data);
        try {
            io.to(parsedData.salaId).emit('hit_by_log', parsedData);
            //console.log('Hit by log enviat a la sala', parsedData.salaId);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

async function checkHitByPlayer(socket, io){
    socket.on('hitByPlayer', async(data) => {
        //console.log('Hit by player emit rebut', data);
        let parsedData = JSON.parse(data);
        try {
            io.to(parsedData.salaId).emit('hit_by_player', parsedData);
            //console.log('Hit by player enviat a la sala', parsedData.salaId);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

async function checkPlayerDead(socket, io){
    socket.on('playerDead', async(data) => {
        //console.log('Player dead emit rebut', data);
        let parsedData = JSON.parse(data);
        try {
            io.to(parsedData.salaId).emit('player_dead', parsedData);
            //console.log('Player dead enviat a la sala', parsedData.salaId);
        } catch (error) {
            console.error("Error al obtener la información de la sala:", error);
        }
    });
}

module.exports = {startGame, listenKeyUp, listenKeyDown, checkPositions, checkHitByLog, checkHitByPlayer, checkPlayerDead};
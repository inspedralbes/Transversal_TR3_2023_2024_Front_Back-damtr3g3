

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

module.exports = {startGame, listenKeyUp, listenKeyDown, checkPositions};
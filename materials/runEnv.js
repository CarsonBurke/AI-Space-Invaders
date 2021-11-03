let bestScore = 0

function findClosestEnemy() {

    for (const enemy of Object.values(object.enemy)) {


    }
}

function run(tickSpeed) {

    setInterval(runTick, tickSpeed)

    function runTick() {


    }
    function runBatch() {

        const players = Object.values(objects.player)
        const playerCount = players.length

        for (const player of players) {

            // Stop loop if there is only 1 player left

            if (Object.keys(object.player) == 1) break

            // Define inputs and outputs

            const inputs = [

            ]

            const outputs = [
                
            ]
            
            // Create network if player doesn't have one

            if (!player.network) player.createNetwork(inputs, outputs)
        }
    }
}
let displayTick = 0
let displayGeneration = 0
let displayPlayers = 0
let displayBestScore = 0

function findBestPlayer(players) {

    // Sort player by score and return first in assortment

    const bestPlayers = players.sort(function(a, b) { a.score - b.score })
    return bestPlayers[0]
}

function run(tickSpeed) {

    setInterval(runTick, tickSpeed)

    function runTick() {

        runBatch()

        moveEnemies()
    }
    function runBatch() {

        const players = Object.values(objects.player)
        const playerCount = players.length

        for (const player of players) {

            // Stop loop if there is only 1 player left

            if (Object.keys(objects.player) == 1) break

            // Find closest enemy

            const closestEnemy = player.findClosestEnemy()

            // Define inputs and outputs

            const inputs = [
                { name: 'Player X', value: player.x },
                { name: 'Player Y', value: player.x },
                { name: 'Closest enemy  X', value: closestEnemy.x },
                { name: 'Closest enemy Y', value: closestEnemy.y },
            ]
            
            const outputs = [
                { name: 'Shoot' },
                { name: 'Move left' },
                { name: 'Move right' },
            ]       
            
            // Create network if player doesn't have one

            if (!player.network) player.createNetwork(inputs, outputs)

            // Run network

            player.network.forwardPropagate(inputs)

            // Find last layer

            const lastLayer = player.network.layers[Object.keys(player.network.layers).length - 1]

            // Track iterations and loop through output perceptrons

            let i = 0

            for (const perceptronName in lastLayer.perceptrons) {

                const perceptron = lastLayer.perceptrons[perceptronName]

                // Iterate if output is 0

                if (perceptron.activateValue == 0) continue

                // Take action connected to output

                player.options[i]()

                // Record iteration

                i++
            }

            // Hide player's visualsParent

            player.network.visualsParent.classList.remove('visualsParentShow')
        }

        // Find best player

        const bestPlayer = findBestPlayer(players)

        // Update score if player's score is best

        if (bestPlayer.score > bestScore) bestScore = bestPlayer.score

        // Show player's visuals

        bestPlayer.network.visualsParent.classList.add("visualsParentShow")

        // Update player's visuals

        bestPlayer.network.updateVisuals()

        // If there is only 1 player left

        if (players.length == 1) {

            // Reproduce with player

            reproduce(bestPlayer, tick)
        }
    }
    function moveEnemies() {

        for (const enemy of Object.values(objects.enemy)) {

            enemy.moveDown()
        }
    }
    function updateDisplay() {


    }
}
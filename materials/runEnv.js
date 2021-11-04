let displayTick = 0
let displayGeneration = 0
let displayPlayers = 0
let displayBestScore = 0

let tick = 0
let lastReset = 0
let enemyWon
let enemySpawnDelay = 100
let lastEnemySpawn = 0

function findBestPlayer(players) {

    // Sort player by score and return first in assortment

    const bestPlayers = players.sort(function(a, b) { a.score - b.score })
    return bestPlayers[0]
}

function reproduce(bestPlayer) {

    // Record stats

    displayGeneration++
    lastReset = 0
    enemyWon = false

    // Delete all game objects

    for (let type in objects) {

        if (type == 'background') continue

        for (let objectID in objects[type]) {

            const object = objects[type][objectID]

            if (type == 'player' && object.id != bestPlayer.id) {

                object.kill()
                continue
            }

            delete objects[type][objectID]
        }
    }

    // Create new players

    for (let i = 0; i < 50; i++) {

        const duplicateNetwork = bestPlayer.network.clone(bestPlayer.inputs, bestPlayer.outputs)

        createPlayer({ network: duplicateNetwork.learn() })
    }

    // Kill bestPlayer

    bestPlayer.kill()

    // Create an enemy

    createEnemy()
}

function run(tickSpeed) {

    setInterval(runTick, tickSpeed)

    function runTick() {

        tick++
        lastReset++

        displayTick = tick

        runPlayers()

        runEnemies()

        runLasers()

        updateObjectPositions()

        updateDisplay()
    }

    function runPlayers() {

        const players = Object.values(objects.player)
        const playerCount = players.length

        let noEnemies

        displayPlayers = playerCount

        for (const player of players) {

            // Iterate if there are no enemies

            if (Object.keys(objects.enemy).length == 0) continue

            // Find closest enemy

            const closestEnemy = player.findClosestEnemy()

            // Define inputs and outputs

            const inputs = [
                { name: 'Player x', value: player.left - player.width / 2 },
                { name: 'Closest enemy  x', value: closestEnemy.left - closestEnemy.width / 2 },
            ]
            player.inputs = inputs

            const outputs = [
                { name: 'Shoot' },
                { name: 'Move left' },
                { name: 'Move right' },
            ]
            player.outputs = outputs

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

                if (perceptron.activateValue > 0) {

                    // Take action connected to output

                    if (i == 0) {

                        player.shoot(tick)
                        continue
                    }
                    if (i == 1) {

                        player.moveLeft()
                        continue
                    }
                    if (i == 2) {

                        player.moveRight()
                        continue
                    }
                }

                // Record iteration

                i++
            }

            // Hide player's visualsParent

            player.network.visualsParent.classList.remove('visualsParentShow')
        }

        // Find best player

        const bestPlayer = findBestPlayer(Object.values(objects.player))

        // Update score if player's score is best

        if (bestPlayer.score > displayBestScore) displayBestScore = bestPlayer.score

        // Show player's visuals

        bestPlayer.network.visualsParent.classList.add("visualsParentShow")

        // Update player's visuals

        bestPlayer.network.updateVisuals()

        // If there is only 1 player left, reproduce with bestPlayer

        if (enemyWon) reproduce(bestPlayer)
    }

    function runEnemies() {

        if (tick - (lastEnemySpawn - enemySpawnDelay / lastReset) - enemySpawnDelay > 0) {

            createEnemy()
            lastEnemySpawn = tick
        }

        for (const enemy of Object.values(objects.enemy)) {

            // Move enemy

            enemy.moveDown()

            // Kill enemy if out of bounds

            if (enemy.bottom >= map.el.height) {

                enemy.kill()
                enemyWon = true
            }
        }
    }

    function runLasers() {

        for (const laser of Object.values(objects.laser)) {

            laser.moveUp()

            laser.canKillEnemy()

            if (laser.top <= 0) laser.delete()
        }
    }

    function updateObjectPositions() {

        // Store the current transformation matrix

        map.cr.save()

        // Use the identity matrix while clearing the canvas

        map.cr.setTransform(1, 0, 0, 1, 0, 0)
        map.cr.clearRect(0, 0, map.el.width, map.el.height)

        // Restore the transform

        map.cr.restore()

        // Re-draw everything

        for (let type in objects) {

            for (let id in objects[type]) {

                let object = objects[type][id]

                object.draw()
            }
        }
    }

    function updateDisplay() {

        let el

        el = document.getElementById('tick')
        el.innerText = displayTick

        el = document.getElementById('generation')
        el.innerText = displayGeneration

        el = document.getElementById('players')
        el.innerText = displayPlayers

        el = document.getElementById('bestScore')
        el.innerText = displayBestScore
    }
}
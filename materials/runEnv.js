let displayTick = 0
let displayGeneration = 0
let displayPlayers = 0
let displayBestScore = 0

let tick = 0
let lastReset = 0
let enemyWon
let spawnAmount = 1
let spawnedEnemies = 0

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
    spawnAmount = 0
    spawnedEnemies = 0

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

    for (let i = 0; i < requiredPlayers; i++) {

        const duplicateNetwork = bestPlayer.network.clone(bestPlayer.inputs, bestPlayer.outputs)

        createPlayer({ network: duplicateNetwork.learn() })
    }

    // Kill bestPlayer

    bestPlayer.kill()
}

function run(tickSpeed) {

    let i = 0

    setInterval(runTick, tickSpeed)

    function runTick() {

        i = 0

        while (i < speedMultiplier) {

            tick++
            lastReset++

            displayTick = tick

            // Find players

            const players = Object.values(objects.player)
            const playerCount = players.length

            // Find enemies

            const closestEnemies = Object.values(objects.enemy).sort((a, b) => a.bottom - b.bottom)
            const closestEnemy = closestEnemies[closestEnemies.length - 1]

            // Find fireballs

            const closestFireballs = Object.values(objects.fireball).sort((a, b) => a.bottom - b.bottom)
            const closestFireball = closestFireballs[closestFireballs.length - 1]

            //

            runPlayers()

            function runPlayers() {

                let noEnemies

                displayPlayers = playerCount

                for (const player of players) {

                    // Define inputs and outputs

                    const inputs = [
                        { name: 'Player x', value: player.left - player.width / 2 },
                        { name: 'Closest enemy  x', value: closestEnemy ? closestEnemy.left - closestEnemy.width / 2 : 0 },
                        { name: 'Closest fireball  x', value: closestFireball ? closestFireball.left - closestFireball.width / 2 : 0 },
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

                    // If there are more than 1 players left

                    if (Object.keys(objects.player).length > 1) {

                        // Check if there is a fireball inside the player

                        player.isDead()
                    }

                    // Hide player's visualsParent

                    player.network.visualsParent.classList.remove('visualsParentShow')
                }

                // Find best player

                const bestPlayer = findBestPlayer(players)

                // Update score if player's score is best

                if (bestPlayer.score > displayBestScore) displayBestScore = bestPlayer.score

                // Show player's visuals

                bestPlayer.network.visualsParent.classList.add("visualsParentShow")

                // Update player's visuals

                bestPlayer.network.updateVisuals()

                // If there is only 1 player left, reproduce with bestPlayer

                if (enemyWon || playerCount == 1) reproduce(bestPlayer)
            }

            runLasers()

            function runLasers() {

                for (const laser of Object.values(objects.laser)) {

                    laser.moveUp()

                    laser.canKillEnemy()

                    if (laser.bottom <= 0) laser.delete()
                }
            }

            runEnemies()

            function runEnemies() {

                spawnAmount += ((lastReset - spawnedEnemies) / 100000)

                while (spawnedEnemies < Math.floor(spawnAmount)) {

                    createEnemy()
                    spawnedEnemies++
                }

                for (const enemy of Object.values(objects.enemy)) {

                    // Move enemy

                    enemy.moveDown()

                    // Restart if out of bounds

                    if (enemy.bottom >= map.el.height) {

                        enemyWon = true
                    }
                }

                // Find closest few enemies

                const closestFewEnemies = closestEnemies.slice(closestEnemies.length - 10, closestEnemies.length)

                // Loop through enemies of closestFewEnemies

                for (const enemy of closestFewEnemies) {

                    // Try to shoot a fireball

                    enemy.shoot()
                }
            }

            runFireballs()

            function runFireballs() {

                for (const fireball of Object.values(objects.fireball)) {

                    fireball.moveUp()

                    if (fireball.top >= map.el.height) fireball.delete()
                }
            }

            updateObjectPositions()

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

            updateDisplay()

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

            i++
        }
    }
}
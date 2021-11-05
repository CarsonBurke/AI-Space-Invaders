let displayTick = 0
let displayGeneration = 0
let displayPlayers = 0
let displayBestScore = 0

let tick = 0
let lastReset = 0

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
    spawning = true
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
            const enemies = Object.values(objects.enemy)
            const closestEnemies = enemies.sort((a, b) => a.bottom - b.bottom)
            const closestEnemy = closestEnemies[closestEnemies.length - 1]

            // Find fireballs
            const fireballs = Object.values(objects.fireball)
            const closestFireballs = fireballs.sort((a, b) => a.bottom - b.bottom)
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

                    const playerShouldDie = player.isDead(fireballs)

                    // Check if there is a fireball inside the player. If there is one player left

                    if (playerShouldDie && Object.keys(objects.player).length == 1) {

                        // Inform that the enemy won

                        enemyWon = true
                    }
                    else if (playerShouldDie) {

                        player.kill()
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

                if (enemyWon) reproduce(bestPlayer)
            }

            runLasers()

            function runLasers() {

                for (const laser of Object.values(objects.laser)) {

                    laser.moveUp()

                    laser.canKillEnemy(enemies, fireballs)

                    if (laser.bottom <= 0) laser.delete()
                }
            }

            runEnemies()

            function runEnemies() {

                spawnAmount += ((lastReset - spawnedEnemies) / 100000)

                while (spawnedEnemies < Math.floor(spawnAmount) && spawning) {

                    createEnemy()
                    spawnedEnemies++
                }

                if (spawnedEnemies == 100 && spawning) spawning = false

                if (enemies.length == 0 && !spawning) enemyWon = true

                for (const enemy of enemies) {

                    // Move enemy

                    enemy.moveDown()
                }

                // Find closest few enemies

                const closestFewEnemies = closestEnemies.slice(-5)

                // Loop through enemies of closestFewEnemies

                for (const enemy of closestFewEnemies) {

                    // If the enemy reaches the bottom of the map, inform to restart

                    if (enemy.bottom >= map.el.height) {

                        enemyWon = true
                    }

                    // Try to shoot a fireball

                    /* enemy.shoot() */
                }
            }

            runFireballs()

            function runFireballs() {

                for (const fireball of fireballs) {

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
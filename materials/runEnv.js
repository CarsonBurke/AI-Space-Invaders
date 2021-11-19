let displayTick = 0
let displayGeneration = 0
let displayPlayers = 0
let displayBestScoreThisGeneration = 0
let displayBestScore = 0
let displayTotalScoreThisGeneration = 0

let tick = 0
let lastReset = 0

function findAllPlayers(allGames) {

    let allPlayers = []

    for (const game of allGames) {

        for (const player of Object.values(game.objects.player)) {

            allPlayers.push(player)
        }
    }

    return allPlayers
}

function findBestPlayers(alivePlayers) {

    // Filter players that have a positive score

    let playersWithScore = alivePlayers.filter(player => player.score > 0)

    // If there are no players with a positive score, use allPlayers

    if (playersWithScore.length == 0) playersWithScore = alivePlayers

    const bestPlayers = playersWithScore.sort(function(a, b) { a.score - b.score })

    // Reverse array

    bestPlayers.reverse()

    // Inform bestPlayers

    return bestPlayers
}

function reproduce(bestPlayers, allGames) {

    // Record stats

    displayGeneration++
    lastReset = 0
    displayBestScoreThisGeneration = 0

    // Delete old objects

    for (const game of allGames) {

        const objects = game.objects

        for (const type in objects) {

            if (type == 'background') continue

            for (const id in objects[type]) {

                const object = objects[type][id]

                if (type == 'player') {

                    // If the player is a bestPlayer iterate

                    if (bestPlayers.includes(object)) continue

                    object.delete()
                }

                delete game.objects[type][id]
            }
        }
    }
    
    let reproducingPlayerIndex = 0

    // Reconfigure games

    for (const game of allGames) {

        // Reset game to default

        game.active = true
        game.spawnedEnemies = 0
        game.spawning = true

        // Create new player

        for (let i = 0; i < requiredPlayers; i++) {

            // Assign reproducingPlayer based on reproducing index

            let reproducingPlayer = bestPlayers[reproducingPlayerIndex]

            // If there is no reproducingPlayer

            if (!reproducingPlayer) {

                // Set reproducing index to 0, assign reproducing player based on it

                reproducingPlayerIndex = 0
                reproducingPlayer = bestPlayers[reproducingPlayerIndex]
            }

            // Create new network and have it learn

            const duplicateNetwork = reproducingPlayer.network.clone(reproducingPlayer.inputs, reproducingPlayer.outputs)
            duplicateNetwork.learn()

            // Create new player with new network and increment reproducing index

            game.createPlayer({ network: duplicateNetwork })
            reproducingPlayerIndex++
        }
    }

    // Loop through bestPlayers and kill them

    for (const player of bestPlayers) player.delete()
}

function run(tickSpeed) {

    let i = 0

    while (i < speedMultiplier) {

        setInterval(runTick, tickSpeed)
        i++
    }
}

function runTick() {

    tick++
    lastReset++

    displayTick = tick
    displayTotalScoreThisGeneration = 0

    const allGames = Object.values(games)

    const allPlayers = findAllPlayers(allGames)

    for (const game of allGames) {

        // Find players

        const players = Object.values(game.objects.player)

        // Find lasers

        const lasers = Object.values(game.objects.laser)

        // Find enemies

        const enemies = Object.values(game.objects.enemy)
        const closestEnemies = enemies.sort((a, b) => a.bottom - b.bottom)
        const closestEnemy = closestEnemies[closestEnemies.length - 1]

        // Find fireballs

        const fireballs = Object.values(game.objects.fireball)

        //

        runPlayers()

        function runPlayers() {

            for (const player of players) {

                // Increase total gen score by player's score

                displayTotalScoreThisGeneration += player.score

                // Define inputs and outputs
                
                const inputs = [
                    { name: 'Player x', value: player.left + player.width / 2 },
                    { name: 'Closest enemy  x', value: closestEnemy ? closestEnemy.left + closestEnemy.width / 2 : 0 },
                    /* { name: 'Closest enemy  y', value: closestEnemy ? closestEnemy.top : 0 }, */
                    /* { name: 'Closest fireball  x', value: closestFireball ? closestFireball.left - closestFireball.width / 2 : 0 }, */
                ]
                player.inputs = inputs

                const outputs = [
                    { name: 'Shoot' },
                    /* { name: 'Move to enemy' }, */
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

                let i = -1

                for (const perceptronName in lastLayer.perceptrons) {

                    const perceptron = lastLayer.perceptrons[perceptronName]

                    // Record iteration

                    i++

                    // Iterate if output is 0

                    if (perceptron.activateValue > 0) {

                        // Take action connected to output

                        if (i == 0) {

                            player.shoot(tick)
                            continue
                        }
                        /* if (i == 1) {

                            if (closestEnemy) player.moveToEnemy(closestEnemy)
                            continue
                        } */
                        if (i == 1) {

                            player.moveLeft()
                            break
                        }
                        if (i == 2) {

                            player.moveRight()
                            break
                        }
                    }
                }

                // If player is dead to a fireball set as not alive

                if (player.isDead(fireballs)) game.stop(players)

                // Hide player's visualsParent

                player.network.visualsParent.classList.remove('visualsParentShow')
            }
        }

        runLasers()

        function runLasers() {

            for (const laser of lasers) {

                laser.moveUp()

                laser.canKillEnemy(enemies, fireballs)

                if (laser.bottom <= 0) laser.delete()
            }
        }

        runEnemies()

        function runEnemies() {

            if ((lastReset == 1 || lastReset % 500 == 0) && game.spawning) {

                game.createEnemy()
                game.spawnedEnemies++
            }

            if (game.spawnedEnemies >= maxEnemies && game.spawning) game.spawning = false

            if (enemies.length == 0 && !game.spawning) game.stop(players)

            for (const enemy of enemies) {

                // Move enemy

                enemy.moveDown()
            }

            // Find closest few enemies

            const closestFewEnemies = closestEnemies.slice(-5)

            // Loop through enemies of closestFewEnemies

            for (const enemy of closestFewEnemies) {

                // If the enemy reaches the bottom of the map, inform to restart

                if (enemy.bottom >= map.el.height) game.stop(players)

                // Try to shoot a fireball

                /* enemy.shoot(tick) */
            }
        }

        runFireballs()

        function runFireballs() {

            for (const fireball of fireballs) {

                fireball.moveDown()

                if (fireball.top >= map.el.height) fireball.delete()
            }
        }

        updateObjectPositions()

        function updateObjectPositions() {

            if (tick % animateSpritesSkip != 0) return

            // Store the current transformation matrix

            map.cr.save()

            // Use the identity matrix while clearing the canvas

            map.cr.setTransform(1, 0, 0, 1, 0, 0)
            map.cr.clearRect(0, 0, map.el.width, map.el.height)

            // Restore the transform

            map.cr.restore()

            // Re-draw everything

            for (const game of allGames) {

                // Iterate if game isn't active

                if (!game.active) continue

                const objects = game.objects

                for (const type in objects) {

                    for (const id in objects[type]) {

                        const object = objects[type][id]

                        object.draw()
                    }
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

            el = document.getElementById('bestScoreThisGeneration')
            el.innerText = displayBestScoreThisGeneration

            el = document.getElementById('totalScoreThisGeneration')
            el.innerText = displayTotalScoreThisGeneration
        }
    }

    const alivePlayers = allPlayers.filter(player => player.alive)
    displayPlayers = alivePlayers.length

    const bestPlayers = findBestPlayers(allPlayers)
    const bestPlayer = bestPlayers[0]

    if (alivePlayers.length == 0) {

        reproduce(bestPlayers, allGames)
    }

    if (bestPlayer.score > displayBestScoreThisGeneration) displayBestScoreThisGeneration = bestPlayer.score
    if (bestPlayer.score > displayBestScore) displayBestScore = bestPlayer.score

    bestPlayer.network.updateVisuals()

    bestPlayer.network.visualsParent.classList.add('visualsParentShow')

}
Player.prototype.shoot = function(tick) {

    const player = this

    // Stop if shooting is on cooldown

    if (player.lastShot - tick + player.shootDelay >= 0) return

    // Create laser

    games[player.gameID].createLaser(player)

    // Record that there was recently a shot

    player.lastShot = tick
}

Player.prototype.moveLeft = function() {

    const player = this

    if (player.left <= 10) return

    player.move({
        x: player.x -= 1
    })
}

Player.prototype.moveRight = function() {

    const player = this

    if (player.right >= map.el.width - 10) return

    player.move({
        x: player.x += 1
    })
}

Player.prototype.createNetwork = function(inputs, outputs) {

    const player = this

    // Create neural network

    const network = new NeuralNetwork()

    // Create layers

    const layerCount = 3

    for (let i = 0; i < layerCount; i++) network.addLayer({})

    // Create perceptrons

    // Create input perceptrons

    for (let i = 0; i < inputs.length; i++) network.layers[0].addPerceptron()

    // Create hidden perceptrons

    const hiddenPerceptronsNeed = 5

    // Loop through layers

    for (const layerName in network.layers) {

        // Filter only hidden layers

        const layersCount = Object.keys(network.layers).length

        if (layerName > 0 && layerName < layersCount - 1) {

            const layer = network.layers[layerName]

            for (let i = 0; i < hiddenPerceptronsNeed; i++) layer.addPerceptron()
        }
    }

    // Create output perceptrons

    for (let i = 0; i < outputs.length; i++) network.layers[layerCount - 1].addPerceptron()

    // Initialize network

    network.init(inputs, outputs)

    // Add network to player

    player.network = network
}

Player.prototype.kill = function() {

    const player = this

    player.network.visualsParent.remove()

    delete games[player.gameID].objects[player.type][player.id]
}

Player.prototype.isDead = function(fireballs) {

    const player = this

    for (const fireball of fireballs) {

        // If fireball is inside player

        if (fireball.bottom >= player.top &&
            fireball.right >= player.left &&
            fireball.left <= player.right) {

            return true
        }
    }
}
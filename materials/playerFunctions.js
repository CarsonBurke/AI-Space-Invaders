Player.prototype.shoot = function() {

    const player = this

    player.findClosestEnemy().kill()
    player.score += 1

    return

    new Player({
        type: "laser",
        x: map.el.width * 0.5,
        y: map.el.height - 55,
        width: 5,
        height: 15,
        image: document.getElementById("laser"),
        outOfBoundsAction: 'delete',
    }).draw()
}

Player.prototype.moveLeft = function() {

    const player = this

    if (player.left == 0) return

    player.move({
        x: player.x -= 1
    })
}

Player.prototype.moveRight = function() {

    const player = this

    if (player.right == map.el.width) return

    player.move({
        x: player.x += 1  
    })
}

Player.prototype.createNetwork = function(inputs, outputs) {

    const player = this

    // Create neural network

    const network = new NeuralNetwork()

    // Create layers
    
    const layerCount = 2
    
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

Player.prototype.findDistanceFrom = function(object) {

    const player = this

    const distance = Math.sqrt(Math.pow(player.x - object.x) + Math.pow(player.y - object.y))
    return distance
}

Player.prototype.findClosestEnemy = function() {

    const player = this

    const enemies = Object.values(objects.enemy)

    const closestEnemies = enemies.sort(function(a, b) { player.findDistanceFrom(a) - player.findDistanceFrom(b) })
    return closestEnemies[0]
}

Player.prototype.kill = function() {

    const player = this

    player.network.visualsParent.remove()

    delete objects[player.type][player.id]
}
Player.prototype.shoot = function() {

    const player = this

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

    player.move({
        x: player.x -= 1  
    })
}

Player.prototype.moveRight = function() {

    const player = this

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

Player.prototype.findDistanceFrom = function(object) {

    const player = this

    const distance = Math.sqrt(Math.pow(player.x - object.x) + Math.pow(player.y - object.y))
    return distance
}

Player.prototype.findClosestEnemy = function() {

    const player = this

    const enemies = Object.values(objects.enemy)

    const closestEnemies = enemies.sort(function(a, b) { player.findClosestEnemy(a) - player.findClosestEnemy(b) })
    return closestEnemies[0]
}

Player.options = [
    Player.shoot,
    Player.moveLeft,
    Player.moveRight
]
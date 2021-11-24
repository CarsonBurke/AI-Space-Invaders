Perceptron.prototype.mutateWeights = function() {

    const perceptron = this
    const network = networks[perceptron.networkID]

    // Randomly adjust a value by a set amount

    function mutate(value, amount) {

        // Decide if to subract or add

        let boolean = Math.floor(Math.random() * 2)

        // Random amount to mutate

        let mutation = Math.random() * amount

        // Apply mutation

        if (boolean == 0) {

            value += Math.random() * mutation
            return value
        }
        if (boolean == 1) {

            value -= Math.random() * mutation
            return value
        }
    }

    // Mutate weights

    let newWeights = []

    for (let weight of perceptron.weights) newWeights.push(mutate(weight, network.learningRate))

    perceptron.weights = newWeights
}

Perceptron.prototype.updateVisual = function() {

    const perceptron = this
    const network = networks[perceptron.networkID]

    // If perceptron's activateValue is 0

    if (perceptron.activateValue == 0) {

        // Display 0

        perceptron.visual.innerText = 0

        // Style outline

        perceptron.visual.style.outlineColor = network.inactiveColor

        // Iterate

        return
    }

    // Style outline

    perceptron.visual.style.outlineColor = network.activeColor

    // Show perceptrons activateValue

    perceptron.visual.innerText = (perceptron.activateValue).toFixed(2)
    return
}

Perceptron.prototype.findWeightCount = function(inputs) {

    const perceptron = this
    const network = networks[perceptron.networkID]

    // Config weightCount with an account for the bias

    let weightCount = 1

    // If perceptron's layerName is 0

    if (perceptron.layerName == 0) {

        weightCount += inputs.length
        return weightCount
    }

    // If perceptron's layerName is more than 0

    if (perceptron.layerName > 0) {

        // Find previous layer

        const previousLayer = network.layers[perceptron.layerName - 1]

        // Find number of perceptrons in previous layer

        let previousLayerPerceptronCount = Object.keys(previousLayer.perceptrons).length

        // Change iterations to number of perceptrons in previous layer
        
        weightCount += previousLayerPerceptronCount
        return weightCount
    }
}

Perceptron.prototype.createWeights = function(inputs) {

    const perceptron = this
    const network = networks[perceptron.networkID]

    // Create one weight perceptron in previous layer

    perceptron.weights = []

    const weightCount = perceptron.findWeightCount(inputs)

    // Iterate for number of perceptrons in previous layer

    for (let i = 0; i < weightCount; i++) {

        // Get a random value relative to the size of learningRate

        let value = Math.random() * network.learningRate

        // Add value to weights
        
        perceptron.weights.push(value)
    }
}

Perceptron.prototype.updateWeights = function() {

    const perceptron = this

    // Reset weight results

    perceptron.weightResults = []

    let i = 0

    for (const input of perceptron.inputs) {

        // Find weight corresponding to input
        
        const weight = perceptron.weights[i]
        
        // Assign weight to input and add value to weightResults
        
        perceptron.weightResults.push(input * weight)

        i++
    }
}

Perceptron.prototype.transfer = function() {

    const perceptron = this

    // Reset transferValue

    perceptron.transferValue = 0

    // Combine all weightResults into transferValue

    for (let weightResult of perceptron.weightResults) perceptron.transferValue += weightResult
}

Perceptron.prototype.activate = function() {

    const perceptron = this

    // Implement transferValue into activateValue, convert to 0 if negative value

    perceptron.activateValue = Math.max(perceptron.transferValue, 0)
}

Perceptron.prototype.run = function(inputs) {

    const perceptron = this

    // Assign inputs

    perceptron.inputs = inputs

    // Run commands to convert the inputs into an activateValue
    
    perceptron.updateWeights()
    perceptron.transfer()
    perceptron.activate()
}
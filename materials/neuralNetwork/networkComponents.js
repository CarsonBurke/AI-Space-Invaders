class Line {
    constructor(opts) {

        const line = this

        // Assign opts

        for (const propertyName in opts) {

            line[propertyName] = opts[propertyName]
        }

        // Set as connected

        line.connected = true

        // Create element

        line.createEl()
    }
}

class Perceptron {
    constructor(opts) {

        const perceptron = this

        // Assign opts

        for (const propertyName in opts) {

            perceptron[propertyName] = opts[propertyName]
        }

        // Create empty properties for the future

        perceptron.weights = []
    }
}

class Layer {
    constructor(opts) {

        const layer = this

        // Assign opts

        for (let propertyName in opts) {

            layer[propertyName] = opts[propertyName]
        }

        // Create empty objects for future properties

        layer.perceptrons = {}
        layer.lines = {}
    }
}

class NeuralNetwork {
    constructor(opts) {

        const network = this

        // Assign default values

        for (let valueName in defaults) {

            network[valueName] = defaults[valueName]
        }

        // Assign opts

        for (let valueName in opts) {

            network[valueName] = opts[valueName]
        }

        // Assign an ID and add to networks

        network.id = newID()
        networks[network.id] = network

        // Create empty objects for future properties

        network.layers = {}
    }
}
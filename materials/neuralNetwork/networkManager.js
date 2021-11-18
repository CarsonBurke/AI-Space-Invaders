const networks = {}

// Define default values for networks

const defaults = {
    learningRate: 0.2,
    bias: 0,
    lineMutation: true,
    layerVisualWidth: 70,
}

//

let idIndex = 0

function newID() {

    // Increment idIndex and return the result

    return idIndex += 1
}
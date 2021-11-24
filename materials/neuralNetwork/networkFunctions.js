NeuralNetwork.prototype.addLayer = function() {

    const network = this

    let layerCount = Object.keys(network.layers).length

    network.layers[layerCount] = new Layer({
        networkID: network.id,
        name: layerCount,
    })

    return network.layers[layerCount]
}
NeuralNetwork.prototype.forwardPropagate = function(inputs) {

    const network = this

    function findInputs(layerName, perceptron, perceptronName) {

        let newInputs = [network.bias]

        // If in first layer

        if (layerName == 0) {

            // Assign input value relative to perceptronName

            newInputs.push(Object.values(inputs)[perceptronName].value)

            return newInputs
        }

        const previousLayer = network.layers[layerName - 1]

        for (const lineID in previousLayer.lines) {

            const line = previousLayer.lines[lineID]

            // Iterate if line's output perceptron isn't network perceptron

            if (line.perceptron2 != perceptron) continue

            // If line is connected

            if (line.connected) {

                // Add line's perceptron activateValue to inputs

                newInputs.push(line.perceptron1.activateValue)
                continue
            }

            // Add 0 to newInputs

            newInputs.push(0)
        }

        return newInputs
    }

    // Loop through layers

    for (let layerName in network.layers) {

        let layer = network.layers[layerName]

        // loop through perceptrons in the layer

        for (let perceptronName in layer.perceptrons) {

            let perceptron = layer.perceptrons[perceptronName]

            // Run the perceptron

            perceptron.run(findInputs(layerName, perceptron, perceptronName))
        }
    }
}

NeuralNetwork.prototype.learn = function() {

    const network = this

    // Loop through layers in network

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        // Loop through perceptrons in the layer

        for (const perceptronName in layer.perceptrons) {

            const perceptron = layer.perceptrons[perceptronName]

            // Mutate perceptron

            perceptron.mutateWeights()
        }

        // Loop through lines in layer

        for (const lineID in layer.lines) {

            const line = layer.lines[lineID]

            network.mutateLine(line)
        }
    }

    return network
}
NeuralNetwork.prototype.createVisuals = function(inputs, outputs) {

    const network = this

    if (network.visualsParent) return

    // Create visuals parent

    let visualsParent = document.createElement("div")

    visualsParent.classList.add("visualsParent")

    visualsParent.style.width = Object.keys(network.layers).length * network.layerVisualWidth + "px"

    document.body.appendChild(visualsParent)
    network.visualsParent = visualsParent

    // Create svg

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.classList.add("lineParent")

    network.visualsParent.appendChild(svg)
    network.svg = svg

    // Loop through each layer

    for (let layerName in network.layers) {

        let layer = network.layers[layerName]

        // make sure there isn't already a visual

        if (layer.visual) continue

        // Create visuals for the layer

        let layerVisual = document.createElement("div")

        layerVisual.classList.add("layerVisual")

        network.visualsParent.appendChild(layerVisual)
        layer.visual = layerVisual

        // loop through perceptrons in the layer

        for (let perceptron1Name in layer.perceptrons) {

            let perceptron1 = layer.perceptrons[perceptron1Name]

            // Create visuals for the perceptron

            let perceptronVisual = document.createElement("div")

            perceptronVisual.classList.add("perceptronVisual")

            // Colour first and last perceptrons

            if (layerName == 0) {

                perceptronVisual.classList.add("inputPerceptron")

            } else if (layerName == Object.keys(network.layers).length - 1) {

                perceptronVisual.classList.add("outputPerceptron")
            }

            //

            layer.visual.appendChild(perceptronVisual)
            perceptron1.visual = perceptronVisual
        }
    }

    network.createLineVisuals()
    network.createTextVisuals(inputs, outputs)
}
NeuralNetwork.prototype.createLineVisuals = function() {

    const network = this

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        // loop through perceptrons in the layer

        for (const perceptron1Name in layer.perceptrons) {

            const perceptron1 = layer.perceptrons[perceptron1Name]

            // Find layer after network one

            const proceedingLayer = network.layers[parseInt(layerName) + 1]

            if (!proceedingLayer) continue

            // Loop through each perceptron in the next layer and draw a line

            for (const perceptron2Name in proceedingLayer.perceptrons) {

                const perceptron2 = proceedingLayer.perceptrons[perceptron2Name]

                const lineID = newID()

                const line = layer.lines[lineID] = new Line({
                    networkID: network.id,
                    perceptron1: perceptron1,
                    perceptron2: perceptron2,
                    id: lineID
                })

                network.mutateLine(line)
            }
        }
    }
}
NeuralNetwork.prototype.createTextVisuals = function(inputs, outputs) {

    const network = this

    let i = 0

    for (const perceptronName in network.layers[0].perceptrons) {

        const perceptron = network.layers[0].perceptrons[perceptronName]

        const textVisual = document.createElement('h3')

        textVisual.innerText = inputs[i].name

        textVisual.classList.add('textVisual')

        textVisual.style.top = perceptron.visual.getBoundingClientRect().top + perceptron.visual.offsetHeight / 4 - network.visualsParent.getBoundingClientRect().top + 'px'
        textVisual.style.right = network.visualsParent.getBoundingClientRect().left - perceptron.visual.getBoundingClientRect().left + Object.keys(network.layers).length * network.layerVisualWidth + 10 + 'px'

        textVisual.style.textAlign = 'right'

        network.visualsParent.appendChild(textVisual)

        i++
    }

    i = 0

    const layerCount = Object.keys(network.layers).length

    for (const perceptronName in network.layers[layerCount - 1].perceptrons) {

        const perceptron = network.layers[layerCount - 1].perceptrons[perceptronName]

        const textVisual = document.createElement('h3')

        textVisual.innerText = outputs[i].name

        textVisual.classList.add('textVisual')

        textVisual.style.top = perceptron.visual.getBoundingClientRect().top + perceptron.visual.offsetHeight / 4 - network.visualsParent.getBoundingClientRect().top + 'px'
        textVisual.style.left = perceptron.visual.getBoundingClientRect().left + perceptron.visual.offsetWidth - network.visualsParent.getBoundingClientRect().left + 10 + 'px'

        textVisual.style.textAlign = 'left'

        network.visualsParent.appendChild(textVisual)

        i++
    }
}
NeuralNetwork.prototype.mutateLine = function(line) {

    const network = this

    // Stop if line mutation is disabled

    if (!network.lineMutation) return

    // Get random value influenced by learning rate

    let value = Math.random() * 5 / network.learningRate

    // Stop if value is more than 1

    if (value > 1) return

    // Decide if to subract or add

    let adjustType = Math.floor(Math.random() * 2)

    // Enable line if 0

    if (adjustType == 0) {

        // Stop if line is already connected

        if (line.connected) return

        // Show line element

        line.el.classList.remove('lineDisconnected')

        // Record that the line is connected

        line.connected = true
        return
    }

    // Disable line if 1

    if (adjustType == 1) {

        // Stop if line is already not connected

        if (!line.connected) return

        // Hide line element

        line.el.classList.add('lineDisconnected')

        // Record that the line is disconnected

        line.connected = false
        return
    }
}

NeuralNetwork.prototype.updateVisuals = function() {

    const network = this

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        // Loop through perceptrons in the layer

        for (const perceptronName in layer.perceptrons) {

            const perceptron = layer.perceptrons[perceptronName]
            
            // Update perceptron's visuals

            perceptron.updateVisual()
        }

        // Loop through lines in layer

        for (const lineID in layer.lines) {

            const line = layer.lines[lineID]

            line.updateVisual()
        }
    }
}
NeuralNetwork.prototype.init = function(inputs, outputs) {

    const network = this

    network.createVisuals(inputs, outputs)

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        // Loop through perceptrons in the layer

        for (const perceptronName in layer.perceptrons) {

            const perceptron = layer.perceptrons[perceptronName]

            // Find layer after network one

            if (layerName == 0) {

                perceptron.createWeights(inputs)
                continue
            }

            const preceedingLayer = network.layers[parseInt(layerName) - 1]

            const inputCount = Object.keys(preceedingLayer.lines).length / Object.keys(layer.perceptrons).length

            let fakeInputs = []

            for (let i = 0; i < inputCount; i++) fakeInputs.push(0)

            perceptron.createWeights(fakeInputs)
        }
    }
}
NeuralNetwork.prototype.clone = function(inputs, outputs) {

    const network = this

    // Create new neural net

    const newNeuralNetwork = new NeuralNetwork()

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        // Create layer for newNeuralNetwork

        newNeuralNetwork.addLayer({})

        const newLayer = newNeuralNetwork.layers[layerName]

        // Loop through perceptrons in layer

        for (const perceptronName in layer.perceptrons) {

            const perceptron = layer.perceptrons[perceptronName]

            newLayer.addPerceptron()
            const newPerceptron = newLayer.perceptrons[perceptronName]

            newPerceptron.weights = perceptron.weights
        }
    }

    // Initialize newNeuralNetwork

    newNeuralNetwork.init(inputs, outputs)

    // Assign line properties to newNeuralNetwork

    for (const layerName in network.layers) {

        const layer = network.layers[layerName]

        const newLayer = newNeuralNetwork.layers[layerName]

        // Count iterations

        let i = 0

        for (const lineID in layer.lines) {

            const line = layer.lines[lineID]

            const newLayerLineID = Object.keys(newLayer.lines)[i]

            // Assign line property to newNeuralNetwork's adjacent line

            newLayer.lines[newLayerLineID].connected = line.connected

            //

            newLayer.lines[newLayerLineID].el.classList = line.el.classList

            // Record iteration

            i++
        }
    }

    // Inform new network

    return newNeuralNetwork
}
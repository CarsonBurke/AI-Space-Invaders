let idIndex = 0

function newID() {

    // Increment idIndex and return the result

    return idIndex += 1
}

let defaults = {
    learningRate: 0.2,
    bias: 0,
    lineMutation: false,
}

class Line {
    constructor(opts) {

        // Assign opts

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        this.connected = true

        // Create element

        let x1 = Math.floor(this.perceptron1.visual.getBoundingClientRect().left)
        let y1 = Math.floor(this.perceptron1.visual.getBoundingClientRect().top)

        let x2 = Math.floor(this.perceptron2.visual.getBoundingClientRect().left)
        let y2 = Math.floor(this.perceptron2.visual.getBoundingClientRect().top)

        let el = document.createElementNS('http://www.w3.org/2000/svg', 'line')

        el.setAttribute('x1', x1 + this.perceptron1.visual.offsetWidth / 2 - this.network.visualsParent.getBoundingClientRect().left)
        el.setAttribute('y1', y1 + this.perceptron1.visual.offsetHeight / 2 - this.network.visualsParent.getBoundingClientRect().top)
        el.setAttribute('x2', x2 + this.perceptron2.visual.offsetWidth / 2 - this.network.visualsParent.getBoundingClientRect().left)
        el.setAttribute('y2', y2 + this.perceptron2.visual.offsetHeight / 2 - this.network.visualsParent.getBoundingClientRect().top)

        el.classList.add("line")

        this.network.svg.appendChild(el)
        this.el = el
    }
}

class Perceptron {
    constructor(opts) {

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        this.weights = []
    }
    mutateWeights() {

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

        for (let weight of this.weights) newWeights.push(mutate(weight, this.network.learningRate))

        this.weights = newWeights
    }
    createWeights(inputs) {

        // Create one weight perceptron in previous layer

        this.weights = []

        // Find previous layer

        let iterations = 1

        // If layerName is 0

        if (this.layerName == 0) {

            iterations += inputs.length
        }

        // If perceptron's layerName is more than 0

        if (this.layerName > 0) {

            // Find previous layer

            const previousLayer = this.network.layers[this.layerName - 1]

            // Find number of perceptrons in previous layer

            let previousLayerPerceptronCount = Object.keys(previousLayer.perceptrons).length

            // Change iterations to number of perceptrons in previous layer
            
            iterations += previousLayerPerceptronCount
        }

        // Iterate for number of perceptrons in previous layer

        for (let i = 0; i < iterations; i++) {

            // Get a random value relative to the size of learningRate

            let value = Math.random() * this.network.learningRate

            // Add value to weights
            
            this.weights.push(value)
        }
    }
    updateWeights() {

        // Reset weight results

        this.weightResults = []

        let i = 0

        for (const input of this.inputs) {

            // Find weight corresponding to input
            
            const weight = this.weights[i]
            
            // Assign weight to input and add value to weightResults
            
            this.weightResults.push(input * weight)

            i++
        }
    }
    transfer() {

        this.transferValue = 0

        for (let weightResult of this.weightResults) this.transferValue += weightResult
    }
    activate() {

        this.activateValue = Math.max(this.transferValue, 0)
    }
    run(inputs) {

        this.inputs = inputs

        // Run commands to take inputs into an end result
        
        this.updateWeights()

        this.transfer()

        this.activate()
    }
}

class Layer {
    constructor(opts) {

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        this.perceptrons = {}
        this.lines = {}
    }
    addPerceptron() {

        // Set the requested layer to have the requested inputs

        let layer = this

        // Find number of perceptrons in this layer

        let perceptronCount = Object.keys(layer.perceptrons).length

        // Create and add new perceptron to the layer

        layer.perceptrons[perceptronCount] = new Perceptron({
            network: this.network,
            layerName: this.name,
        })
    }
}

class NeuralNetwork {
    constructor(opts) {

        // Assign default values

        for (let valueName in defaults) {

            this[valueName] = defaults[valueName]
        }

        this.layers = {}


        // Assign opts

        for (let valueName in opts) {

            this[valueName] = opts[valueName]
        }
    }
    addLayer(opts) {

        let layerCount = Object.keys(this.layers).length

        this.layers[layerCount] = new Layer({
            network: this,
            name: layerCount,
        })

        return this.layers[layerCount]
    }
    forwardPropagate(inputs) {

        let network = this

        function findInputs(layerName, perceptron) {

            let newInputs = [network.bias]

            // If in first layer

            if (layerName == 0) {

                // Add values from default inputs

                for (let inputObject of inputs) newInputs.push(inputObject.value)

                return newInputs
            }

            const previousLayer = network.layers[layerName - 1]

            for (const lineID in previousLayer.lines) {

                const line = previousLayer.lines[lineID]

                // Iterate if line's output perceptron isn't this perceptron

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

        for (let layerName in this.layers) {

            let layer = this.layers[layerName]

            // loop through perceptrons in the layer

            for (let perceptronName in layer.perceptrons) {

                let perceptron = layer.perceptrons[perceptronName]

                // Run the perceptron

                perceptron.run(findInputs(layerName, perceptron))
            }
        }
    }
    learn() {

        // Loop through layers in network

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            // Loop through perceptrons in the layer

            for (const perceptronName in layer.perceptrons) {

                const perceptron = layer.perceptrons[perceptronName]

                // Mutate perceptron

                perceptron.mutateWeights()
            }

            // Loop through lines in layer

            for (const lineID in layer.lines) {

                const line = layer.lines[lineID]

                this.mutateLine(line)
            }
        }

        return this
    }
    createVisuals(outputs) {

        if (this.visualsParent) return

        // Create visuals parent

        let visualsParent = document.createElement("div")

        visualsParent.classList.add("visualsParent")

        visualsParent.style.width = Object.keys(this.layers).length * 80 + "px"

        document.body.appendChild(visualsParent)
        this.visualsParent = visualsParent

        // Create svg

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.classList.add("lineParent")

        this.visualsParent.appendChild(svg)
        this.svg = svg

        // Loop through each layer

        for (let layerName in this.layers) {

            let layer = this.layers[layerName]

            // make sure there isn't already a visual

            if (layer.visual) continue

            // Create visuals for the layer

            let layerVisual = document.createElement("div")

            layerVisual.classList.add("layerVisual")

            this.visualsParent.appendChild(layerVisual)
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

                } else if (layerName == Object.keys(this.layers).length - 1) {

                    perceptronVisual.classList.add("outputPerceptron")
                }

                //

                layer.visual.appendChild(perceptronVisual)
                perceptron1.visual = perceptronVisual
            }
        }

        this.createLineVisuals()
        this.createTextVisuals(outputs)
    }
    createLineVisuals() {

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            // loop through perceptrons in the layer

            for (const perceptron1Name in layer.perceptrons) {

                const perceptron1 = layer.perceptrons[perceptron1Name]

                // Find layer after this one

                const proceedingLayer = this.layers[parseInt(layerName) + 1]

                if (!proceedingLayer) continue

                // Loop through each perceptron in the next layer and draw a line

                for (const perceptron2Name in proceedingLayer.perceptrons) {

                    const perceptron2 = proceedingLayer.perceptrons[perceptron2Name]

                    const lineID = newID()

                    const line = layer.lines[lineID] = new Line({
                        network: this,
                        perceptron1: perceptron1,
                        perceptron2: perceptron2,
                        id: lineID
                    })

                    this.mutateLine(line)
                }
            }
        }
    }
    createTextVisuals(outputs) {

        let i = 0

        for (const perceptronName in this.layers[0].perceptrons) {

            const perceptron = this.layers[0].perceptrons[perceptronName]

            const textVisual = document.createElement('h3')

            textVisual.innerText = inputs[i].name

            textVisual.classList.add('textVisual')

            textVisual.style.top = perceptron.visual.getBoundingClientRect().top + perceptron.visual.offsetHeight / 4 - this.visualsParent.getBoundingClientRect().top + 'px'
            textVisual.style.right = perceptron.visual.getBoundingClientRect().left - this.visualsParent.getBoundingClientRect().left + Object.keys(this.layers).length * 80 - 20 + 'px'

            textVisual.style.textAlign = 'right'

            this.visualsParent.appendChild(textVisual)

            i++
        }

        i = 0

        const layerCount = Object.keys(this.layers).length

        for (const perceptronName in this.layers[layerCount - 1].perceptrons) {

            const perceptron = this.layers[layerCount - 1].perceptrons[perceptronName]

            const textVisual = document.createElement('h3')

            textVisual.innerText = outputs[i].name

            textVisual.classList.add('textVisual')

            textVisual.style.top = perceptron.visual.getBoundingClientRect().top + perceptron.visual.offsetHeight / 4 - this.visualsParent.getBoundingClientRect().top + 'px'
            textVisual.style.left = perceptron.visual.getBoundingClientRect().left + perceptron.visual.offsetWidth - this.visualsParent.getBoundingClientRect().left + 10 + 'px'

            textVisual.style.textAlign = 'left'

            this.visualsParent.appendChild(textVisual)

            i++
        }
    }
    mutateLine(line) {

        // Stop if line mutation is disabled

        if (!this.lineMutation) return

        // Get random value influenced by learning rate

        let value = Math.random() * 5 / this.learningRate

        // Stop if value is more than 1

        if (value > 1) return

        // Decide if to subract or add

        let boolean = Math.floor(Math.random() * 2)

        // Enable line if 0

        if (boolean == 0) {
            
            // Stop if line is already connected

            if (line.connected) return

            // Show line element

            line.el.classList.remove('lineDisconnected')

            // Record that the line is connected

            line.connected = true
            return
        }

        // Disable line if 1

        if (boolean == 1) {

            // Stop if line is already not connected

            if (!line.connected) return

            // Hide line element

            line.el.classList.add('lineDisconnected')

            // Record that the line is disconnected

            line.connected = false
            return
        }
    }
    updateLine(line) {

        let el = line.el

        if (line.connected && line.perceptron1.activateValue > 0) {

            el.classList.add("lineActive")
        } else el.classList.remove("lineActive")
    }
    updateVisuals() {

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            // Loop through perceptrons in the layer

            for (const perceptronName in layer.perceptrons) {

                const perceptron = layer.perceptrons[perceptronName]

                // If perceptron's activateValue is 0

                if (perceptron.activateValue == 0) {

                    // Display 0 and iterate
                    perceptron.visual.innerText = 0
                    continue
                }

                // Show perceptrons activateValue

                perceptron.visual.innerText = (perceptron.activateValue).toFixed(2)
            }

            // Loop through lines in layer

            for (const lineID in layer.lines) {

                const line = layer.lines[lineID]

                this.updateLine(line)
            }
        }
    }
    init(inputs, outputs) {

        this.createVisuals(outputs)

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            // Loop through perceptrons in the layer

            for (const perceptronName in layer.perceptrons) {

                const perceptron = layer.perceptrons[perceptronName]

                // Find layer after this one

                if (layerName == 0) {

                    perceptron.createWeights(inputs)
                    continue
                }

                const preceedingLayer = this.layers[parseInt(layerName) - 1]

                const inputCount = Object.keys(preceedingLayer.lines).length / Object.keys(layer.perceptrons).length

                let fakeInputs = []

                for (let i = 0; i < inputCount; i++) fakeInputs.push(0)

                perceptron.createWeights(fakeInputs)
            }
        }
    }
    clone(inputs) {

        // Create new neural net

        const newNetwork = new NeuralNetwork()

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            // Create layer for newNetwork

            newNetwork.addLayer({})

            const newLayer = newNetwork.layers[layerName]

            // Loop through perceptrons in layer

            for (const perceptronName in layer.perceptrons) {

                const perceptron = layer.perceptrons[perceptronName]
                
                newLayer.addPerceptron()
                const newPerceptron = newLayer.perceptrons[perceptronName]
                
                newPerceptron.weights = perceptron.weights
            }
        }

        // Initialize newNetwork

        newNetwork.init(inputs)

        // Assign line properties to newNetwork

        for (const layerName in this.layers) {

            const layer = this.layers[layerName]

            const newLayer = newNetwork.layers[layerName]

            // Count iterations

            let i = 0

            for (const lineID in layer.lines) {

                const line = layer.lines[lineID]

                const newLayerLineID = Object.keys(newLayer.lines)[i]

                // Assign line property to newNetwork's adjacent line
                
                newLayer.lines[newLayerLineID].connected = line.connected

                //

                newLayer.lines[newLayerLineID].el.classList = line.el.classList

                // Record iteration

                i++
            }
        }

        return newNetwork
    }
}
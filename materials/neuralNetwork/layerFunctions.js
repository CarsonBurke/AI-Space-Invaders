Layer.prototype.addPerceptron = function() {

    const layer = this

    // Find number of perceptrons in this layer

    let perceptronCount = Object.keys(layer.perceptrons).length

    // Create and add new perceptron to the layer
    
    layer.perceptrons[perceptronCount] = new Perceptron({
        networkID: layer.networkID,
        layerName: layer.name,
    })
}
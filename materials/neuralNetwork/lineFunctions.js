Line.prototype.createEl = function() {

    const line = this
    const network = networks[line.networkID]

    // Create line el

    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line')

    // Get rect of perceptronVisuals

    const perceptron1VisualRect = this.perceptron1.visual.getBoundingClientRect()

    // Construct line positions

    const x1 = Math.floor(perceptron1VisualRect.left)
    const y1 = Math.floor(perceptron1VisualRect.top)

    // Get rect of perceptronVisuals

    const perceptron2VisualRect = this.perceptron2.visual.getBoundingClientRect()

    // Construct line positions

    const x2 = Math.floor(perceptron2VisualRect.left)
    const y2 = Math.floor(perceptron2VisualRect.top)

    // Get rect of visualsParent

    const visualsParentRect = network.visualsParent.getBoundingClientRect()

    // Implement line positions into element

    el.setAttribute('x1', x1 + line.perceptron1.visual.offsetWidth / 2 - visualsParentRect.left)
    el.setAttribute('y1', y1 + line.perceptron1.visual.offsetHeight / 2 - visualsParentRect.top)
    el.setAttribute('x2', x2 + line.perceptron2.visual.offsetWidth / 2 - visualsParentRect.left)
    el.setAttribute('y2', y2 + line.perceptron2.visual.offsetHeight / 2 - visualsParentRect.top)

    // Give line class

    el.classList.add("line")

    // Add line to line visuals element

    network.svg.appendChild(el)
    line.el = el
}

Line.prototype.updateVisual = function() {

    const line = this
    const network = networks[line.networkID]
    const el = line.el

    if (line.connected && line.perceptron1.activateValue > 0) {

        el.style.stroke = network.activeColor
        return
    }
    
    el.style.stroke = network.inactiveColor
}
function init() {

    map.cr = map.el.getContext("2d")

    // Style map width and height

    map.el.width = mapDimensions
    map.el.height = mapDimensions

    // Dimensions / number of tiles will give size

    globalThis.gridSize = mapDimensions / gridPartSize

    // Generate sprites

    createPlayer({})

    createEnemy()
}
function init() {

    map.cr = map.el.getContext("2d")

    // Style map width and height

    map.el.width = mapDimensions
    map.el.height = mapDimensions

    // Disable anti aliasing

    map.cr.imageSmoothingEnabled = false

    // Dimensions / number of tiles will give size

    globalThis.gridSize = mapDimensions / gridPartSize

    // Generate sprites

    for (let i = 0; i < requiredPlayers; i++) createPlayer({})

    //

    objects.laser = {}
}
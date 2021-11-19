function init() {

    map.cr = map.el.getContext("2d")

    // Style map width and height

    map.el.width = mapWidth
    map.el.height = mapHeight

    // Disable anti aliasing

    map.cr.imageSmoothingEnabled = false

    // Generate sprites

    for (let i = 0; i < gamesAmount; i++) {

        const game = new Game()

        for (let i = 0; i < requiredPlayers; i++) {

            game.createPlayer({})
        }
    }
}
Sprite.prototype.delete = function() {

    const sprite = this
    const game = games[sprite.gameID]

    // Remove object from game objects

    delete game.objects[sprite.type][sprite.id]
}

Sprite.prototype.exists = function() {

    const sprite = this
    const game = games[sprite.gameID]

    // If sprite exists in game inform true, otherwise inform false

    if (game.objects[sprite.type][sprite.id]) return true
    return false
}
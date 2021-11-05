Fireball.prototype.moveDown = function() {

    const fireball = this

    fireball.move({
        y: fireball.y + fireball.speed
    })
}

Fireball.prototype.delete = function() {

    const fireball = this

    delete games[fireball.gameID].objects[fireball.type][fireball.id]
}
Fireball.prototype.moveUp = function() {

    const fireball = this

    fireball.move({
        y: fireball.y += fireball.speed
    })
}

Fireball.prototype.delete = function() {

    const fireball = this

    delete objects[fireball.type][fireball.id]
}
Fireball.prototype.moveDown = function() {

    const fireball = this

    fireball.move({
        top: fireball.top + fireball.speed
    })
}
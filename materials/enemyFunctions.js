Enemy.prototype.moveDown = function() {

    const enemy = this

    enemy.move({
        y: enemy.y + enemy.speed * speedMultiplier
    })
}

Enemy.prototype.kill = function() {

    const enemy = this

    delete objects[enemy.type][enemy.id]
}
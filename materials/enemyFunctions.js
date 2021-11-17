Enemy.prototype.moveDown = function() {

    const enemy = this

    // Move down

    enemy.move({
        y: enemy.y + enemy.speed
    })
}

Enemy.prototype.shoot = function(tick) {

    const enemy = this

    // Stop if shooting is on cooldown

    if (enemy.lastShot - tick + enemy.shootDelay >= 0) return

    // Create fireball

    games[enemy.gameID].createFireball(enemy)

    // Record that there was recently a shot

    enemy.lastShot = tick
}

Enemy.prototype.kill = function() {

    const enemy = this

    delete games[enemy.gameID].objects[enemy.type][enemy.id]
}
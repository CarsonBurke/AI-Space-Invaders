Enemy.prototype.moveDown = function() {

    const enemy = this

    // Move down

    enemy.move({
        top: enemy.top + enemy.speed
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
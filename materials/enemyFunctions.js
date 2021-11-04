Enemy.prototype.moveDown = function() {

    const enemy = this

    enemy.move({
        y: enemy.y + enemy.speed * speedMultiplier
    })
}

Enemy.prototype.shoot = function() {

    const enemy = this

    // Stop if shooting is on cooldown

    if (enemy.lastShot - tick + enemy.shootDelay >= 0) return

    // Create fireball

    const width = 15
    const height = 19

    new Fireball({
        type: 'fireball',
        x: enemy.left + enemy.width * 0.5 - width / 2,
        y: enemy.top - height + 15,
        width: width,
        height: height,
        image: document.getElementById('fireball'),
        speed: 1 * speedMultiplier,
    }).draw()

    // Record that there was recently a shot

    enemy.lastShot = tick
}

Enemy.prototype.kill = function() {

    const enemy = this

    delete objects[enemy.type][enemy.id]
}
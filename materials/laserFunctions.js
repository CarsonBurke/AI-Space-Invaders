Laser.prototype.moveUp = function() {

    const laser = this

    laser.move({
        y: laser.y -= laser.speed * speedMultiplier
    })
}

Laser.prototype.delete = function() {

    const laser = this

    delete objects[laser.type][laser.id]
}

Laser.prototype.canKillEnemy = function() {

    const laser = this

    for (const enemy of Object.values(objects.enemy)) {

        // If laser is inside enemy

        if (laser.top <= enemy.bottom &&
            laser.right >= enemy.left &&
            laser.left <= enemy.right) {

            // Add to laser's player's score

            laser.player.score += 1

            // Kill enemy

            enemy.kill()

            // Delete laser

            laser.delete()

            break
        }
    }
}
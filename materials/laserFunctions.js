Laser.prototype.moveUp = function() {

    const laser = this

    laser.move({
        y: laser.y -= laser.speed,
    })
}

Laser.prototype.delete = function() {

    const laser = this

    delete objects[laser.type][laser.id]
}

Laser.prototype.canKillEnemy = function() {

    for (const enemy of Object.values(objects.enemy)) {

        // If laser is inside enemy

        if (laser.bottom <= enemy.top &&
            laser.top >= enemy.bottom &&
            laser.right >= enemy.left &&
            laser.left <= enemy.right) {

            // Kill enemy

            enemy.kill()

            // Delete laser

            laser.delete()

            // Add to laser's player's score

            const player = objects.player[laser.playerID]
            player.score += 1

            break
        }
    }
}
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

    const laser = this

    for (const enemy of Object.values(objects.enemy)) {

        // If laser is inside enemy

        if (laser.top <= enemy.bottom &&
            laser.top >= enemy.top &&
            laser.left <= enemy.right &&
            laser.left >= enemy.left) {

            console.log('kill')

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
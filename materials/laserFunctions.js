Laser.prototype.moveUp = function() {

    const laser = this

    laser.move({
        top: laser.top - laser.speed
    })
}

Laser.prototype.canKillEnemy = function(enemies, fireballs) {

    const laser = this
    const game = games[laser.gameID]
    const player = game.objects.player[laser.playerID]

    for (const enemy of enemies) {

        // Iterate if the enemy doesn't exist

        if (!enemy.exists()) continue

        // If laser is inside enemy

        if (laser.top <= enemy.bottom &&
            laser.right >= enemy.left &&
            laser.left <= enemy.right) {

            // Add to laser's player's score

            player.score += 1

            // Kill enemy

            enemy.delete()

            // Delete laser

            laser.delete()

            break
        }
    }

    // 

    for (const fireball of fireballs) {

        // If laser is inside fireball

        if (laser.top <= fireball.bottom &&
            laser.right >= fireball.left &&
            laser.left <= fireball.right) {

            // Kill fireball

            fireball.delete()

            // Delete laser

            laser.delete()
            break
        }
    }
}
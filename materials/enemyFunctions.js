Enemy.prototype.moveDown = function() {

    const enemy = this

    if (enemy.moveType == 'left') {

        // Move left

        enemy.move({
            x: enemy.x - enemy.speed
        })

        //

        if (enemy.left <= 0) {

            // Move down

            enemy.move({
                y: enemy.y + enemy.height
            })

            //

            enemy.moveType = 'right'
        }

        return
    }
    if (enemy.moveType == 'right') {

        // Move right

        enemy.move({
            x: enemy.x + enemy.speed
        })

        if (enemy.right >= map.el.width) {

            // Move down

            enemy.move({
                y: enemy.y + enemy.height
            })

            //

            enemy.moveType = 'left'
        }

        return
    }
}

Enemy.prototype.shoot = function(tick) {

    const enemy = this

    // Stop if shooting is on cooldown

    if (enemy.lastShot - tick + enemy.shootDelay >= 0) return

    // Create fireball

    games[enemy.gameID].createFireball()

    // Record that there was recently a shot

    enemy.lastShot = tick
}

Enemy.prototype.kill = function() {

    const enemy = this

    delete games[enemy.gameID].objects[enemy.type][enemy.id]
}
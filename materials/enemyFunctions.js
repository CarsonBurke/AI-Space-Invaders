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
    }
    else if (enemy.moveType == 'right') {

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
    }
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
        speed: 1,
    }).draw()

    // Record that there was recently a shot

    enemy.lastShot = tick
}

Enemy.prototype.kill = function() {

    const enemy = this

    delete objects[enemy.type][enemy.id]
}
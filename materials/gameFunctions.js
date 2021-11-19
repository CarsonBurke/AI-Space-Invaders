Game.prototype.createPlayer = function(opts) {

    const game = this

    // opts for player

    const width = 45
    const height = 50

    // Create player

    const player = new Player({
        type: "player",
        left: map.el.width * 0.5 - width * 0.5,
        top: map.el.height - 55,
        width: width,
        height: height,
        imageID: 'player',
        score: 0,
        shootDelay: 200,
        lastShot: 100,
        network: opts.network || undefined,
        alive: true,
        gameID: game.id,
    })
    player.draw()

    // Assign player to game
    
    game.objects.player[player.id] = player
}

Game.prototype.createLaser = function(player) {

    const game = this

    // opts for laser

    const width = 6
    const height = 30

    // Create laser

    const laser = new Laser({
        type: 'laser',
        left: player.left + player.width * 0.5 - width / 2,
        top: player.top - height + 15,
        width: width,
        height: height,
        imageID: 'laser',
        playerID: player.id,
        speed: 6,
        gameID: game.id,
    })
    laser.draw()

    // Assign laser to game

    game.objects.laser[laser.id] = laser
}

Game.prototype.createEnemy = function() {

    const game = this

    // opts for enemy

    const width = 36
    const height = 27

    let x = Math.random() * map.el.width

    x = Math.max(width * 4, x)
    x = Math.min(x - width * 2, x)

    // Create enemy

    const enemy = new Enemy({
        type: "enemy",
        left: x,
        top: 0,
        width: width,
        height: height,
        imageID: 'enemy',
        speed: Math.max(Math.random(), 0.06) * 0.15,
        shootDelay: Math.max(2000, Math.random() * 6000),
        lastShot: 2000,
        moveType: 'left',
        gameID: game.id,
    })
    enemy.draw()

    // Assign enemy to game

    game.objects.enemy[enemy.id] = enemy
}

Game.prototype.createFireball = function(enemy) {

    const game = this

    // opts for fireball

    const width = 15
    const height = 19

    // Create fireball

    const fireball = new Fireball({
        type: 'fireball',
        left: enemy.left + enemy.width * 0.5 - width / 2,
        top: enemy.top - height + 15,
        width: width,
        height: height,
        imageID: 'fireball',
        speed: 1,
        gameID: game.id,
    })
    fireball.draw()

    // Assign fireball to game

    game.objects.fireball[fireball.id] = fireball
}
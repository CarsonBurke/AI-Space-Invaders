Game.prototype.createPlayer = function(opts) {

    const game = this

    // opts for player

    const width = 45
    const height = 50

    // Create player

    const player = new Player({
        type: "player",
        x: map.el.width * 0.5 - width * 0.5,
        y: map.el.height - 55,
        width: width,
        height: height,
        image: document.getElementById("player"),
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
        x: player.left + player.width * 0.5 - width / 2,
        y: player.top - height + 15,
        width: width,
        height: height,
        image: document.getElementById('laser'),
        player: player,
        speed: 2,
        gameID: game.id,
    })
    laser.draw()

    // Assign laser to game

    game.objects.laser[laser.id] = laser
}

Game.prototype.createEnemy = function(opts) {

    const game = this

    // opts for enemy

    const width = 36
    const height = 27

    let x = Math.random() * map.el.width

    x = Math.max(width, x)
    x = Math.min(x - width, x)

    // Create enemy

    const enemy = new Enemy({
        type: "enemy",
        x: x,
        y: 0,
        width: width,
        height: height,
        image: document.getElementById("enemy"),
        speed: Math.max(Math.random(), 0.2) * 0.8,
        shootDelay: Math.max(2000, Math.random() * 6000),
        lastShot: 2000,
        moveType: 'left',
        gameID: game.id,
    })
    enemy.draw()

    // Assign enemy to game

    game.objects.enemy[enemy.id] = enemy
}

Game.prototype.createFireball = function() {

    const game = this

    // opts for fireball

    const width = 15
    const height = 19

    // Create fireball

    const fireball = new Fireball({
        type: 'fireball',
        x: enemy.left + enemy.width * 0.5 - width / 2,
        y: enemy.top - height + 15,
        width: width,
        height: height,
        image: document.getElementById('fireball'),
        speed: 1,
        gameI: game.id,
    })
    fireball.draw()

    // Assign fireball to game

    game.objects.fireball[fireball.id] = fireball
}
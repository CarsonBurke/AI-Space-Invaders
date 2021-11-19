class Game {
    constructor() {

        //

        this.id = newID()

        //

        this.active = true
        this.spawnedEnemies = 0
        this.spawning = true
        this.objects = {
            player: {},
            laser: {},
            enemy: {},
            fireball: {},
        }

        //

        games[this.id] = this
    }
    stop(players) {

        const game = this

        game.active = false
        
        for (const player of players) player.alive = false
    }
}

class Sprite {
    constructor(opts) {

        //

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        //

        this.id = newId()

        // Designate right and bottom

        this.bottom = this.top + this.height
        this.right = this.left + this.width

        //

        games[this.gameID].objects[this.type][this.id] = this
    }
    draw() {

        // Find image el

        const imageEl = document.getElementById(this.imageID)

        // Draw image

        map.cr.drawImage(imageEl, this.left, this.top, this.width, this.height)
    }
    move(opts) {

        // Assign opts

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        // Designate hitboxes

        this.top = this.top
        this.left = this.left
        this.bottom = this.top + this.height
        this.right = this.left + this.width
    }
}

class Player extends Sprite {
    constructor(opts) {

        super(opts)
    }
}

class Laser extends Sprite {
    constructor(opts) {

        super(opts)
    }
}

class Enemy extends Sprite {
    constructor(opts) {

        super(opts)
    }
}

class Fireball extends Sprite {
    constructor(opts) {

        super(opts)
    }
}
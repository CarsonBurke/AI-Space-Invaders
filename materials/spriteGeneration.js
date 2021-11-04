class Sprite {
    constructor(opts) {

        //

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        //

        this.id = newId()

        // Designate hitboxes

        this.top = this.y
        this.left = this.x
        this.bottom = this.y + this.height
        this.right = this.x + this.width

        //

        if (!objects[this.type]) objects[this.type] = {}

        //

        objects[this.type][this.id] = this
    }
    draw() {

        map.cr.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    move(opts) {

        // Assign opts

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        // Designate hitboxes

        this.top = this.y
        this.left = this.x
        this.bottom = this.y + this.height
        this.right = this.x + this.width
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

function createPlayer(opts) {

    const width = 45
    const height = 50

    new Player({
        type: "player",
        x: map.el.width * 0.5 - width * 0.5,
        y: map.el.height - 55,
        width: width,
        height: height,
        image: document.getElementById("player"),
        score: 0,
        shootDelay: 300 / speedMultiplier,
        lastShot: 100,
        network: opts.network || undefined
    }).draw()
}

function createEnemy() {

    const width = 36
    const height = 27

    let x = Math.random() * map.el.width

    x = Math.max(width, x)
    x = Math.min(x - width, x)

    new Enemy({
        type: "enemy",
        x: x,
        y: 0,
        width: width,
        height: height,
        image: document.getElementById("enemy"),
        speed: Math.max(Math.random(), 0.01) * 0.05,
        shootDelay: Math.max(5000, Math.random() * 12500) / speedMultiplier,
        lastShot: 100,
    }).draw()
}
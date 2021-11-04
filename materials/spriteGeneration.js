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

class Enemy extends Sprite {
    constructor(opts) {

        super(opts)
    }
}

class Laser extends Sprite {
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
        shootDelay: 100,
        lastShot: 0,
        network: opts.network || undefined
    }).draw()
}

function createEnemy() {

    let value

    // While value isn't defined

    while (!value) {

        // Assign value a random number

        value = Math.random()

        // If number is not ideal, try again

        if (value > 0.9 || value < 0.1) value = undefined
    }

    const width = 36
    const height = 27

    new Enemy({
        type: "enemy",
        x: map.el.width * value - width * 0.5,
        y: 20,
        width: width,
        height: height,
        image: document.getElementById("enemy"),
        speed: Math.max(Math.random(), 0.05) * 0.3,
    }).draw()
}
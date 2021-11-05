const gameObjectTypes = {
    player: {},
    laser: {},
    enemy: {},
    fireball: {},
}

class Game {
    constructor() {

        //

        this.id = newID()

        //

        this.active = true
        this.objects = gameObjectTypes

        //

        games[this.id] = this
    }
    stop() {

        this.active = false
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
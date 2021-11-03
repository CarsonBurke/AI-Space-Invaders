class Sprite {
    constructor(opts) {

        //

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        //

        this.id = newId()

        //

        if (!objects[this.type]) objects[this.type] = {}

        //

        objects[this.type][this.id] = this
    }
    draw() {
        
        map.cr.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    move(opts) {

        //

        for (let propertyName in opts) {

            this[propertyName] = opts[propertyName]
        }

        //
    }
}

function createPlayer(opts) {

    new Sprite({
        type: "player",
        x: map.el.width * 0.5,
        y: map.el.height - 55,
        width: 45,
        height: 50,
        image: document.getElementById("player"),
        outOfBoundsAction: 'stop',
        score: 0,
        network: opts.network || undefined
    }).draw()
}

function createEnemy() {

    new Sprite({
        type: "enemy",
        x: map.el.width * 0.5,
        y: 20,
        width: 36,
        height: 27,
        image: document.getElementById("enemy"),
        outOfBoundsAction: 'reproduce',
    }).draw()
}
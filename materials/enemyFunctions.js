Enemy.prototype.moveDown = function() {

    const enemy = this

    enemy.move({
        y: enemy.y += 1  
    })
}
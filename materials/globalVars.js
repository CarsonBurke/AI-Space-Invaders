// Assign variables

let properties = {
    mapDimensions: 700,
    gridPartSize: 25,
    gamesAmount: 1,
    requiredPlayers: 100,
    maxEnemies: Infinity,
    nextId: 0,
    speedMultiplier: 10000,
    map: {
        el: document.getElementById("map"),
    },
    games: {},
    colors: {
        red: "#b51818",
        blue: "#3718b5",
        green: "#18b543",
        yellow: "#a0a620",
        purple: "#c700c2",
    },
    findById(id) {

        return objects[id]
    },
    newId() {

        nextId++
        return nextId - 1
    }
}

// Assign variables to globalThis

for (let propertyName in properties) {

    let property = properties[propertyName]

    globalThis[propertyName] = property
}
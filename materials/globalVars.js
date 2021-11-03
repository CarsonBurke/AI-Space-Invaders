// Assign variables

let properties = {
    mapDimensions: 700,
    gridPartSize: 25,
    flapDelay: 80,
    nextId: 0,
    gapHeight: 130,
    map: {
        el: document.getElementById("map"),
        positions: [],
    },
    colors: {
        red: "#b51818",
        blue: "#3718b5",
        green: "#18b543",
        yellow: "#a0a620",
        purple: "#c700c2",
    },
    objects: {

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
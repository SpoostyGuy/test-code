var { UIElementGroup, BaseUIElement, Property, generateAnimation, addNewElementWithName } = require('./ui')

function addAnimation(name, duration) {
    return [
        new Property('animation-name', name),
        new Property('animation-duration', duration),
        new Property('animation-fill-mode', 'forwards')
    ]
}

module.exports = {
    addAnimation,
}
var { Button } = require('../editor/viewerElements')
var { UIElementGroup, BaseUIElement, Property, generateAnimation, addNewElementWithName } = require('../shared/ui')

class RobloxButton {
    constructor(props) {
        props.push(new Property('width', '205px'))
        props.push(new Property('padding-left', '40px'))
        props.push(new Property('line-height', '40px'))
        props.push(new Property('color', 'rgb(var(--text-color))'))
        props.push(new Property('font-size', '20px'))
        this.button = new Button(props)
        var svgText = `<div class="innerElements" style="transition: 0.3s"><svg class="svgThing" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="25" height="25" viewBox="0 0 267 267" xml:space="preserve"><g xmlns="http://www.w3.org/2000/svg" transform="matrix(4.39 0 0 4.39 133.58 133.61)"><path style="stroke: none;stroke-width: 1;fill: rgb(var(--text-color));fill-rule: nonzero;opacity: 1;" transform=" translate(-73.13, -26.88)" d="M 57.6 0 L 46.26 42.4 l 42.4 11.35 L 100 11.35 Z m 11.2 19.47 l 11.83 3.17 l -3.17 11.83 l -11.84 -3.17 z" stroke-linecap="round"/></g></svg>Continue with Roblox</div>`
        this.button.element.innerHTML = svgText
        this.button.element.getElementsByClassName('svgThing')[0].style.position = 'absolute'
        this.button.element.getElementsByClassName('svgThing')[0].style.left = '10px'
        this.button.element.getElementsByClassName('svgThing')[0].style.top = '7.5px'
        return this.button
    }
}

class BaseHolder extends BaseUIElement {
    baseProperties() {
        return [
            new Property('padding: 27.5px'),
            new Property('width: 245px'),
            new Property('background-color: rgb(var(--accented-color))'),
            new Property('border-radius: var(--spacing)'),
            new Property('animation: baseTransitionIn 0.8s forwards'),
            new Property('position: absolute'),
            new Property('transform: translate(-50%, -50%)'),
            new Property('top: 50%'),
            new Property('left: 50%')
        ]
    }
    animateInTransition() {
        generateAnimation('transitionUpIn', [
            {
                percent: 0,
                props: [
                    new Property('transform: translate(-50%, -50%) scale(0.8)'),
                    new Property('top: 55%'),
                    new Property('opacity: 0'),
                ]
            },
            {
                percent: 100,
                props: [
                    new Property('transform: translate(-50%, -50%) scale(1)'),
                    new Property('top: 50%'),
                    new Property('opacity: 1'),
                ]
            }
        ])
        this.element.style.animation = 'transitionUpIn 0.8s forwards'
    }
    async animateOut() {
        generateAnimation('transitionUpOut', [
            {
                percent: 0,
                props: [
                    new Property('transform: translate(-50%, -50%) scale(1)'),
                    new Property('top: 50%'),
                    new Property('opacity: 1'),
                ]
            },
            {
                percent: 100,
                props: [
                    new Property('transform: translate(-50%, -50%) scale(0.8)'),
                    new Property('top: 45%'),
                    new Property('opacity: 0'),
                ]
            }
        ])
        this.element.style.animation = 'transitionUpOut 0.8s forwards'
        await new Promise(resolve => setTimeout(resolve, 800));
        this.element.remove()
    }
}


class MainText extends BaseUIElement {
    baseProperties() {
        return [
            new Property('text-align: center'),
            new Property('font-family: "Quicksand"'),
            new Property('font-weight: bold'),
            new Property('font-size: 30px'),
            new Property('color', 'rgb(var(--text-color))')
        ]
    }
}

function switchToRegularText(text) {
    return "<div style='font-weight: normal; font-size: 20px'>" + text + "</div>"
}

module.exports = {
    RobloxButton,
    BaseHolder,
    switchToRegularText,
    MainText
}
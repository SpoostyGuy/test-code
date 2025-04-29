
var { BaseUIElement, generateAnimation, Property } = require('./ui')

function prepareSvgFilter() {
    if (document.querySelector('[typeElement="svgFilter"]') == null) {
        document.head.insertAdjacentHTML('afterbegin', `<svg style="visibility: hidden; position: absolute;" width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
        <filter id="roundedPath"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />    
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="roundedPath" />
            <feComposite in="SourceGraphic" in2="roundedPath" operator="atop"/>
        </filter>
    </defs>
</svg>`)
    }
}

class LoadingSpinner extends BaseUIElement {
    baseProperties() {
        prepareSvgFilter()
        generateAnimation('loadingAnimMain', [
            {
                percent: 0,
                props: [
                    new Property('clip-path: polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)')
                ]
            },
            {
                percent: 25,
                props: [
                    new Property('clip-path: polygon(50% 0%, 50% 0%, 100% 100%, 0% 100%)')
                ]
            },
            {
                percent: 50,
                props: [
                    new Property('clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)')
                ]
            },
            {
                percent: 75,
                props: [
                    new Property('clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%)')
                ]
            },
            {
                percent: 100,
                props: [
                    new Property('clip-path: polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)')
                ]
            }
        ])
        generateAnimation('loadingAnimHolder', [
            {
                percent: 0,
                props: [
                    new Property('opacity: 0')
                ]
            },
            {
                percent: 25,
                props: [
                    new Property('opacity: 1')
                ]
            },
            {
                percent: 75,
                props: [
                    new Property('opacity: 1')
                ]
            },
            {
                percent: 100,
                props: [
                    new Property('opacity: 0')
                ]
            }
        ])

        this.primaryLoader = new BaseUIElement([
            new Property('animation: loadingAnimMain 1s infinite linear'),
            new Property('width: 100%'),
            new Property('height: 100%'),
            new Property('background-color: rgb(var(--lighter-color))'),
        ])
            .appendTo(this.element)

        return [
            new Property('animation: loadingAnimHolder 1s infinite linear'),
            new Property('filter: url(#roundedPath)')
        ]
    }
}

module.exports =  {
    LoadingSpinner
}
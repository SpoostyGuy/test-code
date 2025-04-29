var uiElements = require('./uiElements')
var viewerElements = require('../editor/viewerElements')
var { beginObserving, handleColor } = require('../editor/colorEngine');
const { Property, generateAnimation, BaseUIElement } = require('../shared/ui');

function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

class ProfilePicture extends BaseUIElement {
    baseProperties() {
        return [
            new Property('width: 80px'),
            new Property('height: 80px'),
            new Property('transform: translateX(-50%)'),
            new Property('position: relative'),
            new Property('left: 50%'),
            new Property('margin-bottom: 5px'),
            new Property('border-radius: 50%')
        ]
    }
}
class IntroductionPanel {
    constructor(userName, profileImage) {
        this.mainElement = new uiElements.BaseHolder()
        var text = new uiElements.MainText()
        text.setInnerHTML("Welcome, " + userName + "!<br>" + uiElements.switchToRegularText("Let's finish setting up RoEditor and customizing your experience."))
        console.log((text.element.style.fontWeight || 'normal') + ' ' + (text.element.style.fontSize || '16px') + ' ' + (text.element.style.fontFamily || 'Times New Roman'))
        var totalMiddle = getTextWidth("Welcome, " + userName + "!", (text.element.style.fontWeight || 'normal') + ' ' + (text.element.style.fontSize || '16px') + ' ' + (text.element.style.fontFamily || 'Times New Roman') )
        totalMiddle += (27.5) * 2
        this.mainElement.element.style.width = totalMiddle + 'px'
        this.mainElement.mainButton = new viewerElements.Button([
            new Property('width', '85px'),
            new Property('text-align', 'center'),
            new Property('line-height', '40px'),
            new Property('position: relative'),
            new Property('margin-top: 20px'),
            new Property('transform: translateX(-50%)'),
            new Property('left: 50%'),
            new Property('top: calc(100% - 40px)'),
            new Property('color', 'rgb(var(--text-color))'),
            new Property('font-size', '20px')
        ])
            .setInnerHTML("Next")
        this.mainElement.appendList([
            new ProfilePicture([], 'img').setImgSrc(profileImage),
            text,
            this.mainElement.mainButton,
        ])
        return this.mainElement
    }
}

class FinishedPanel {
    constructor() {
        this.mainElement = new uiElements.BaseHolder()
        var text = new uiElements.MainText()
        text.setInnerHTML("Finished<br>" + uiElements.switchToRegularText("You're done with the setup, now it's time to edit your experiences."))
        this.mainElement.element.style.width = '350px'
        this.mainElement.mainButton = new viewerElements.Button([
            new Property('width', '85px'),
            new Property('text-align', 'center'),
            new Property('line-height', '40px'),
            new Property('position: relative'),
            new Property('margin-top: 20px'),
            new Property('transform: translateX(-50%)'),
            new Property('left: 50%'),
            new Property('top: calc(100% - 40px)'),
            new Property('color', 'rgb(var(--text-color))'),
            new Property('font-size', '20px')
        ])
            .setInnerHTML("Next")
        this.mainElement.appendList([
            text,
            this.mainElement.mainButton
        ])
        return this.mainElement
    }
}


class GuestAccountPanel {
    constructor() {
        this.mainElement = new uiElements.BaseHolder()
        var text = new uiElements.MainText()
        text.setInnerHTML("Guest Account<br>" + uiElements.switchToRegularText("Would you like to setup a alternate account for services like team create and game testing?" + `<br><div style="font-size: 15px; font-style: italic;">This doesn't require a password but requires you to solve a captcha in order to create a new account</div>`))
        this.mainElement.element.style.width = '350px'
        this.mainElement.yesButton = new viewerElements.Button([
            new Property('width', '85px'),
            new Property('text-align', 'center'),
            new Property('line-height', '40px'),
            new Property('position: absolute'),
            new Property('transform: translateX(-50%)'),
            new Property('background-color: rgb(var(--lighter-color))'),
            new Property('left: calc(50% + 47.5px)'),
            new Property('color', 'rgb(var(--text-color))'),
            new Property('font-size', '20px')
        ])
            .setInnerHTML("Yes")
        this.mainElement.noButton = new viewerElements.Button([
            new Property('width', '85px'),
            new Property('text-align', 'center'),
            new Property('line-height', '40px'),
            new Property('position: absolute'),
            new Property('transform: translateX(-50%)'),
            new Property('left: calc(50% - 47.5px)'),
            new Property('color', 'rgb(var(--text-color))'),
            new Property('font-size', '20px')
        ])
            .setInnerHTML("No")
        this.mainElement.noButton.element.style.backgroundColor = 'rgba(var(--shadow-color), 0.3)'
        this.mainElement.appendList([
            text,
            new BaseUIElement([
                new Property('margin-top: 20px'),
                new Property('height: 40px'),
                new Property('width: 100%')
            ])
                .appendList([
                    this.mainElement.noButton,
                    this.mainElement.yesButton
                ])
        ])
        return this.mainElement
    }
}


function nameToRgba(name) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = name;
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data;
}

function getBackgroundColorAsHSV() {
    var color = nameToRgba(document.body.style.backgroundColor)

    var r = color[0]
    var g = color[1]
    var b = color[2]
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
  
    var d = max - min;
    s = max == 0 ? 0 : d / max;
  
    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, v ];
}

function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    let [r1, g1, b1] = [0, 0, 0];
  
    if      (hh >= 0 && hh < 1) [r1,g1,b1] = [c, x, 0];
    else if (hh >= 1 && hh < 2) [r1,g1,b1] = [x, c, 0];
    else if (hh >= 2 && hh < 3) [r1,g1,b1] = [0, c, x];
    else if (hh >= 3 && hh < 4) [r1,g1,b1] = [0, x, c];
    else if (hh >= 4 && hh < 5) [r1,g1,b1] = [x, 0, c];
    else if (hh >= 5 && hh < 6) [r1,g1,b1] = [c, 0, x];
  
    const m = v - c;
    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255)
    };
  }
  
class ThemePanel {
    constructor(onUpdate) {
        this.mainElement = new uiElements.BaseHolder()
        var text = new uiElements.MainText()
        text.setInnerHTML("Theme<br>" + uiElements.switchToRegularText("You are able to customize the theme of RoEditor."))
        this.mainElement.element.style.width = '350px'

        var hsv =  getBackgroundColorAsHSV()
        var hue = hsv[0]*360
        var sat = hsv[1]*100
        var val = hsv[2]*100

        this.mainElement.svCanvas = new BaseUIElement([
            new Property("background-color: rgb(var(--lighter-color))"),
            new Property("height: 100%"),
            new Property("width: 100%"),
            new Property("border-radius: var(--spacing)")
        ], 'canvas')
        this.mainElement.hueCursor = new BaseUIElement([
            new Property("height: 30px"),
            new Property("position: absolute"),
            new Property("margin-top: -2.5px"),
            new Property("width: 5px"),
            new Property("filter: drop-shadow(2px 4px 6px black)"),
            new Property("border-radius: var(--spacing)"),
            new Property("background-color: white")
        ])
        this.mainElement.cursor = new BaseUIElement([
            new Property("width: 20px"),
            new Property("height: 20px"),
            new Property("z-index: 10"),
            new Property("position: absolute"),
            new Property("border-radius: 50%"),
            new Property("transform: translate(-50%, -50%)"),
            new Property("border: 2px white solid"),
            new Property("filter: drop-shadow(0px 0px 4px black)")
        ])
        var svCtx = this.mainElement.svCanvas.element.getContext('2d')
        this.updateSvCursorPos = function() {
            var rect = this.mainElement.svCanvas.element.getBoundingClientRect()
            var sx = sat / 100 * rect.width;
            var sy = (1 - val/100) * rect.height;
            this.mainElement.cursor.element.style.marginLeft = sx + 'px'
            this.mainElement.cursor.element.style.marginTop = sy + 'px'
            this.mainElement.hueCursor.element.style.marginLeft = (hue / 360 * rect.width) + 'px'
        }
        this.drawSV = function() {
            svCtx.fillStyle = `hsl(${hue}, 100%, 50%)`
            svCtx.fillRect(0, 0, this.mainElement.svCanvas.element.width, this.mainElement.svCanvas.element.height);
      
            let whiteGrad = svCtx.createLinearGradient(0,0,this.mainElement.svCanvas.element.width,0);
            whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
            whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
            svCtx.fillStyle = whiteGrad;
            svCtx.fillRect(0,0,this.mainElement.svCanvas.element.width,this.mainElement.svCanvas.element.height);
      
            let blackGrad = svCtx.createLinearGradient(0,0,0,this.mainElement.svCanvas.element.height);
            blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
            blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
            svCtx.fillStyle = blackGrad;
            svCtx.fillRect(0,0,this.mainElement.svCanvas.element.width,this.mainElement.svCanvas.element.height);      
        }
        this.mainElement.hueCanvas = new BaseUIElement([
            new Property("background-color: rgb(var(--lighter-color))"),
            new Property("height: 100%"),
            new Property("width: 100%"),
            new Property("border-radius: var(--spacing)")
        ], 'canvas')
        var hueCtx = this.mainElement.hueCanvas.element.getContext('2d')
        var isMove = false
        this.mainElement.hueCanvas.bind('mousedown', (e) => {
            console.log('work')
            var rect = this.mainElement.hueCanvas.element.getBoundingClientRect()
            var x = (e.clientX - rect.left)/rect.width
            if (x > 1) { x = 1 } else { if (x < 0) { x = 0 } }
            hue = Math.round(x * 360)
            this.drawSV()
            this.updateSvCursorPos()
            onUpdate(
                'rgb(' + hsvToRgb(hue, sat, val).r + ', ' + hsvToRgb(hue, sat, val).g + ', ' + hsvToRgb(hue, sat, val).b + ')'
            )
            isMove = true
        })
        var isMoveSV = false
        this.mainElement.svCanvas.bind('mousedown', (e) => {
            var rect = this.mainElement.svCanvas.element.getBoundingClientRect()
            var x = (e.clientX - rect.left)/rect.width
            var y = (e.clientY - rect.top)/rect.height

            x = Math.min(1, Math.max(0,x))
            y = Math.min(1, Math.max(0,y))

            sat = Math.round(x * 100);
            val = Math.round((1 - y) * 100);

            this.updateSvCursorPos()
            
            onUpdate(
                'rgb(' + hsvToRgb(hue, sat, val).r + ', ' + hsvToRgb(hue, sat, val).g + ', ' + hsvToRgb(hue, sat, val).b + ')'
            )
            isMoveSV = true
        })
        window.addEventListener('mousemove', (e) => {
            if (isMoveSV == true) {
                var rect = this.mainElement.svCanvas.element.getBoundingClientRect()
                var x = (e.clientX - rect.left)/rect.width
                var y = (e.clientY - rect.top)/rect.height

                if (x > 1) { x = 1 } else { if (x < 0) { x = 0 } }
                if (y > 1) { y = 1 } else { if (y < 0) { y = 0 } }

                sat = Math.round(x * 100);
                val = Math.round((1 - y) * 100);

                this.updateSvCursorPos()

                onUpdate(
                    'rgb(' + hsvToRgb(hue, sat, val).r + ', ' + hsvToRgb(hue, sat, val).g + ', ' + hsvToRgb(hue, sat, val).b + ')'
                )
            } else {
                if (isMove == true) {
                    var rect = this.mainElement.hueCanvas.element.getBoundingClientRect()
                    var x = (e.clientX - rect.left)/rect.width
                    if (x > 1) { x = 1 } else { if (x < 0) { x = 0 } }
                    hue = Math.round(x * 360)
                    this.drawSV()
                    this.updateSvCursorPos()
                    onUpdate(
                        'rgb(' + hsvToRgb(hue, sat, val).r + ', ' + hsvToRgb(hue, sat, val).g + ', ' + hsvToRgb(hue, sat, val).b + ')'
                    )
                }
            }
        })
        window.addEventListener('mouseup', () => {
            isMove = false
            isMoveSV = false
        })
        this.mainElement.mainButton = new viewerElements.Button([
            new Property('width', '85px'),
            new Property('text-align', 'center'),
            new Property('line-height', '40px'),
            new Property('position: relative'),
            new Property('margin-top: 20px'),
            new Property('transform: translateX(-50%)'),
            new Property('left: 50%'),
            new Property('top: calc(100% - 40px)'),
            new Property('color', 'rgb(var(--text-color))'),
            new Property('font-size', '20px')
        ])
            .setInnerHTML("Next")
        this.mainElement.appendList([
            text,
            new BaseUIElement([
                new Property('margin-top: 20px'),
                new Property('height: 120px'),
                new Property('width: 100%'),
            ]).appendList([this.mainElement.cursor, this.mainElement.svCanvas]),
            new BaseUIElement([
                new Property('margin-top: 5px'),
                new Property('height: 25px'),
                new Property('width: 100%'),
            ]).appendList([this.mainElement.hueCursor, this.mainElement.hueCanvas]),

            this.mainElement.mainButton,
        ])
        var rect = this.mainElement.hueCanvas.element
        console.log(rect)
        const gradient = hueCtx.createLinearGradient(0,0,rect.width,0);
        for(let i=0; i<=360; i+=60){
          gradient.addColorStop(i/360, `hsl(${i}, 100%, 50%)`);
        }
        hueCtx.fillStyle = gradient;
        hueCtx.fillRect(0, 0, rect.width, rect.height);

        this.mainElement.appendTo(document.body)
        this.drawSV()
        this.updateSvCursorPos()
      
        return this.mainElement
    }
}


module.exports = {
    IntroductionPanel,
    GuestAccountPanel,
    ThemePanel,
    FinishedPanel
}
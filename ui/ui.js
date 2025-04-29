
/*
    Dynamically generates CSS Animations
    Useful for on the fly create animations for specific or multiple animations

    Name: <animation-name>
    Format: 
    [
        {
            percent: <percentage of animation>
            props: {
                'filter': 'blur(100px)'
            }
        }
    ]
*/
function generateAnimation(name, format) {
    var style = document.querySelector("[library='ui']")
    if (style == null) {
        style = document.createElement('style')
        style.type = 'text/css';
        style.setAttribute('library', 'ui')
        var textAdd = ''
        textAdd += '@keyframes ' + name + ' { '
        format.forEach(function(data) {
            textAdd += data.percent + '% { '
            for (var property in data.props) {
                textAdd += data.props[property].property + '; '
            }
            textAdd += '} '
        })
        textAdd += '} '
        style.innerHTML = textAdd
        document.getElementsByTagName('head')[0].appendChild(style)
    } else {
        if (!style.innerHTML.includes('@keyframes ' + name)) {
            var textAdd = ''
            textAdd += '@keyframes ' + name + ' { '
            format.forEach(function(data) {
                textAdd += data.percent + '% { '
                for (var property in data.props) {
                    textAdd += data.props[property].property + '; '
                }
                textAdd += '} '
            }), 
            textAdd += '} '
            style.innerHTML += textAdd    
        }
    }
}

function addNewElementWithName(name, format) {
    var style = document.querySelector("[library='ui']")
    if (style == null) {
        style = document.createElement('style')
        style.type = 'text/css';
        style.setAttribute('library', 'ui')
        var textAdd = ''
        textAdd += name + ' { '
        format.forEach(function(data) {
            textAdd += data.property + '; '
        }), 
        textAdd += '} '
        style.innerHTML += textAdd
        document.getElementsByTagName('head')[0].appendChild(style)
    } else {
        var textAdd = ''
        textAdd += name + ' { '
        format.forEach(function(data) {
            textAdd += data.property + '; '
        }), 
        textAdd += '} '
        style.innerHTML += textAdd
    }
}

function parseAndAddElementData(cssData) {
    var curProps = []
    var curElementName = ""
    console.log(cssData)
    cssData.split('\n').forEach(function(line) {
        if (line.includes('{')) {
            var chars = line.split('')
            var firstSpace = false
            var previousSpaces = ''
            for (var char in chars) {
                char = chars[char]
                if (char == '{') {
                    break
                } else {
                    if (char == ' ') {
                        if (firstSpace == true) {
                            previousSpaces += ' '
                        }
                    } else {
                        curElementName = curElementName + previousSpaces + char
                        firstSpace = true
                        previousSpaces = ''
    
                    }
                }
            }
        } else {
            if (line.includes(';')) {
                var chars = line.split('')
                var currentProp = ''
                var indexData = 0
                for (var char in chars) {
                    char = chars[char]
                    if (char != ' ') {
                        currentProp = chars.slice(indexData).join('')
                        break
                    }
                    indexData += 1
                }
                curProps.push(new Property(currentProp.split(';')[0]))
            } else {
                if (line.includes('}')) {
                    console.log(curElementName)
                    console.log(curProps)
                    addNewElementWithName(curElementName, curProps)
                    curProps = []
                    curElementName = ""
                }
            }
        }
    })
}

class BaseUIElement {
    constructor(propertyList, type) {
        if (propertyList == undefined) {
            propertyList = []
        }
        if (type == undefined) {
            type = 'div'
        }
        this.element = document.createElement(type)
        if (typeof(this.baseProperties) == 'function') {
            propertyList = propertyList.concat(this.baseProperties())
        }
        this.children = []
        this.id = 0
        propertyList.forEach((val) => {
            this.element.style.setProperty(val.name, val.value)
        })
        return this
    }
    setId(id) {
        this.element.id = id
        return this
    }
    bind(type, callback) {
        this.element.addEventListener(type, callback)
        return this
    }
    appendList(list) {
        list.forEach((child) => {
            this.children.push(child)
            this.element.appendChild(child.element)
        })
        return this
    }
    appendTo(element) {
        if (element.element != undefined) {
            element.element.appendChild(this.element)
        } else {
            element.appendChild(this.element)
        }
        return this
    } 
    setInnerHTML(text) {
        this.element.innerHTML = text
        return this
    }
    updateProperties(props) {
        props.forEach((val) => {
            this.element.style.setProperty(val.name, val.value)
        })
        return this
    }
    setImgSrc(src) {
        this.element.src = src
        return this
    }
    updateProperty(prop) {
        this.element.style.setProperty(prop.name, prop.value)
        return this
    }
    setClass(className) {
        this.element.className = className
        return this
    }
}

class UIElementGroup {
    constructor(list) {
        this.mainList = list
    }
    appendTo(element) {
        this.mainList.forEach(function(item) {
            item.appendTo(element)
        })
    }
    getItemById(id) {
        var finalReturn = undefined
        function findItem(children) {
            children.forEach(function(child) {
                if (child.id == id) {
                    finalReturn = child
                } else {
                    if (child.children.length > 0) {
                        findItem(child.children)
                    }
                }
            })
        }
        this.mainList.forEach(function(item) {
            if (item.children.length > 0) {
                findItem(item.children)
            }
        })
        return finalReturn
    }
}


class Property {
    constructor(property, value) {
        if (property.includes(': ') || value == undefined) {
            this.property = property
            this.name = property.split(': ')[0]
            this.value = property.split(': ')[1]
        } else {
            this.property = property + ': ' + value
            this.name = property
            this.value = value
        }
    }
}

module.exports = {
    generateAnimation,
    UIElementGroup,
    addNewElementWithName,
    parseAndAddElementData,
    BaseUIElement,
    Property
}
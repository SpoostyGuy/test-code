var { UIElementGroup, BaseUIElement, Property, generateAnimation, addNewElementWithName } = require('../shared/ui')
var { addAnimation } = require('../shared/baseElements')
var { onDrag } = require('./draggableUI')
var { LoadingSpinner } = require('../shared/uiComponents')

class Ripple extends BaseUIElement {
    baseProperties() {
        return [
            new Property('background-color: white'),
            new Property('border-radius: 50%'),
            new Property('position: absolute'),
            new Property('left: 0px;'),
            new Property('width: 200%'),
            new Property('transition: 0.5s'),
            new Property('transform: translate(-50%, -50%) scale(0.1)'),
            new Property('aspect-ratio: 1 / 1'),
            new Property('filter: blur(50px) opacity(0.2)'),
            ...addAnimation('rippleEffect', '0.5s')
        ]
    }
}

class Button extends BaseUIElement {
    baseProperties() {
        this.bindEvents()
        return [
            new Property('border-radius: var(--spacing)'),
            new Property('overflow: hidden'),
            new Property('font-family: "Quicksand"'),
            new Property('transition: 0.25s'),
            new Property('background-color: rgb(var(--lighter-color))'),
            new Property('filter: drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0))'),
            new Property('border-radius: var(--spacing)'),
        ]
    }

    bindEvents() {
        this.bind('mousedown', (e) => {
            this.element.style.filter = 'drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0))'
            if (this.ripple != undefined) {
                this.ripple.element.remove()
                this.ripple = undefined    
            }
            var bounding = this.element.getBoundingClientRect()
            this.ripple = new Ripple([
                new Property('left: ' + (e.clientX - bounding.x) + 'px'),
                new Property('top: ' + (e.clientY - bounding.y) + 'px')
            ])
            this.element.appendChild(this.ripple.element)
        })
        this.bind('mouseup', async () => {
            this.element.style.filter = 'drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0.6))'
            var rippleElement = this.ripple
            rippleElement.element.style.filter = 'blur(50px) opacity(0)'
            this.ripple = undefined
            await new Promise(resolve => setTimeout(resolve, 500));
            rippleElement.element.remove()
        })
        this.bind('mouseover', async () => {
            if (this.ripple == undefined) {
                this.element.style.filter = 'drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0.6))'
            }
        })
        this.bind('mouseleave', async () => {
            this.element.style.filter = 'drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0))'
            if (this.ripple != undefined) {
                var rippleElement = this.ripple
                rippleElement.element.style.filter = 'blur(50px) opacity(0)'
                this.ripple = undefined
                await new Promise(resolve => setTimeout(resolve, 500));
                rippleElement.element.remove()    
            }
        })
    }
}

class WindowTitle extends BaseUIElement {
    baseProperties() {
    }
}
class BaseImageLoader extends BaseUIElement {
    baseProperties() {
        return [
            new Property('border-radius: var(--spacing)'),
            new Property('background-repeat: no-repeat'),
            new Property('background-size: contain'),
            new Property('transform: translateX(-50%)'),
            new Property('position: absolute'),
            new Property('left: 50%'),
            new Property('top: 0px')
        ]
    }
}

function showLoader(image, height) {
    if (image != undefined) {
        var totalHeight = '(' + height + 'px + (2 * var(--spacing)) + ' + (height/4) + 'px)'
        var loaderHolder = new BaseUIElement([
            new Property('width: ' + height + 'px'),
            new Property('height: calc' + totalHeight),
            new Property('position: absolute'),
            new Property('transform: translate(-50%, -50%)'),
            new Property('left: 50%'),
            new Property('top: 50%'),
            ...addAnimation('baseTransitionIn', '0.6s')
        ])
        var image = new BaseImageLoader([
            new Property('background-image: url("' + image + '")'),
            new Property('width: ' + height + 'px'),
            new Property('height: ' + height + 'px'),
        ])
        var spin = new LoadingSpinner([
            new Property('width: ' + (height/4) + 'px'),
            new Property('height: ' + (height/4) + 'px'),
            new Property('position: absolute'),
            new Property('transform: translateX(-50%)'),
            new Property('left: 50%'),
            new Property('top: calc(100% - ' + (height/4) + 'px)'),
        ])
        loaderHolder.appendList([
            image,
            spin
        ])
        loaderHolder.transitionOut = function() {
            loaderHolder.element.style.animation = 'baseTransitionOut 0.6s forwards'
        }
        return loaderHolder    
    } else {
        var loaderHolder = new BaseUIElement([
            new Property('width: ' + (height/4) + 'px'),
            new Property('height: ' + (height/4) + 'px'),
            new Property('position: absolute'),
            new Property('transform: translate(-50%, -50%)'),
            new Property('left: 50%'),
            new Property('top: 50%'),
            ...addAnimation('baseTransitionIn', '0.6s')
        ])
        var spin = new LoadingSpinner([
            new Property('width: ' + (height/4) + 'px'),
            new Property('height: ' + (height/4) + 'px'),
            new Property('position: absolute'),
            new Property('transform: translateX(-50%)'),
            new Property('left: 50%'),
            new Property('top: 0px'),
        ])
        loaderHolder.appendList([
            spin
        ])
        loaderHolder.transitionOut = function() {
            loaderHolder.element.style.animation = 'baseTransitionOut 0.6s forwards'
        }
        return loaderHolder    
    }
}

class TopUI extends BaseUIElement {
    baseProperties() {
        return [
            new Property('position: absolute'),
            new Property('background-color: rgb(var(--accented-color))'),
            new Property('width: calc(100% - (2 * var(--spacing)))'),
            new Property('--top-before: -100px'),   
            new Property('--top-after: 0px'),   
            new Property('--left-before: var(--spacing)'),   
            new Property('--left-after: var(--spacing)'),   
            new Property('height: 100px'),
            new Property('border-bottom-left-radius: var(--spacing)'),   
            new Property('border-bottom-right-radius: var(--spacing)'),   
            ...addAnimation('flyIn', '0.4s')
        ]
    }
}

class RightUI extends BaseUIElement {
    baseProperties() {
        return [
            new Property('position: absolute'),
            new Property('background-color: rgb(var(--accented-color))'),
            new Property('width: 200px'),
            new Property('--top-before: calc(100px + var(--spacing))'),   
            new Property('--top-after: calc(100px + var(--spacing))'),   
            new Property('--right-before: -200px'),   
            new Property('--right-after: 0px'),   
            new Property('height: calc(100% - (100px + (2 * var(--spacing))))'),
            new Property('border-top-left-radius: var(--spacing)'),   
            new Property('border-bottom-left-radius: var(--spacing)'),   
            ...addAnimation('flyIn', '0.4s')
        ]
    }
}

class LeftUI extends BaseUIElement {
    baseProperties() {
        return [
            new Property('position: absolute'),
            new Property('background-color: rgb(var(--accented-color))'),
            new Property('width: 200px'),
            new Property('--top-before: calc(100px + var(--spacing))'),   
            new Property('--top-after: calc(100px + var(--spacing))'),   
            new Property('--left-before: -200px'),   
            new Property('--left-after: 0px'),   
            new Property('height: calc(100% - (100px + (2 * var(--spacing))))'),
            new Property('border-top-right-radius: var(--spacing)'),   
            new Property('border-bottom-right-radius: var(--spacing)'),   
            ...addAnimation('flyIn', '0.4s')
        ]
    }
}

class MiddleUI extends BaseUIElement {
    baseProperties() {
        return [
            new Property('position: absolute'),
            new Property('background-color: rgb(var(--lighter-color))'),
            new Property('width: calc(100% - ((2 * 200px) + (2 * var(--spacing))))'),
            new Property('--top-before: calc(100px + var(--spacing))'),   
            new Property('--top-after: calc(100px + var(--spacing))'),   
            new Property('--scale-before: 80%'),   
            new Property('--scale-after: 100%'),   
            new Property('--left-before: calc(200px + var(--spacing))'),   
            new Property('--left-after: calc(200px + var(--spacing))'),   
            new Property('height: calc(100% - (100px + (2 * var(--spacing))))'),
            new Property('border-radius: var(--spacing)'),   
            ...addAnimation('flyIn', '0.4s')
        ]
    }
}

async function prepareSettings(settings) {
    for (var key in settings) {
        document.body.style.setProperty('--' + key, settings[key])
    }
}

function intialAnimation() {
    generateAnimation('baseTransitionIn', [
        {
            percent: 0,
            props: [
                new Property('transform: translate(-50%, -50%) scale(0.8)'),
                new Property('top: 50%'),
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
    generateAnimation('baseTransitionOut', [
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
                new Property('top: 50%'),
                new Property('opacity: 0'),
            ]
        }
    ])
    generateAnimation('rippleEffect', [
        {
            percent: 0,
            props: [
                new Property('transform: translate(-50%, -50%) scale(0.1)'),
            ]
        },
        {
            percent: 100,
            props: [
                new Property('transform: translate(-50%, -50%) scale(1)'),
            ]
        }
    ])
    generateAnimation('flyIn', [
        {
            percent: 0,
            props: [
                new Property('top: var(--top-before)'),
                new Property('left: var(--left-before)'),
                new Property('right: var(--right-before)'),
                new Property('transform: scale(var(--scale-before))'),
                new Property('opacity: 0')
            ]
        },
        {
            percent: 100,
            props: [
                new Property('top: var(--top-after)'),
                new Property('left: var(--left-after)'),
                new Property('right: var(--right-after)'),
                new Property('transform: scale(var(--scale-after))'),
                new Property('opacity: 1')
            ]
        }
    ])
    generateAnimation('scaleIn', [
        {
            percent: 0,
            props: [
                new Property('top: var(--top-after)'),
                new Property('left: var(--left-after)'),
                new Property('right: var(--right-after)'),
                new Property('transform: scale(0.7)'),
                new Property('opacity: 0')
            ]
        },
        {
            percent: 100,
            props: [
                new Property('top: var(--top-after)'),
                new Property('left: var(--left-after)'),
                new Property('right: var(--right-after)'),
                new Property('transform: scale(1)'),
                new Property('opacity: 0.6')
            ]
        }
    ])
}

class TitleBar extends BaseUIElement {
    baseProperties() {
        return [
            new Property("height: 30px"),
            new Property("background-color: rgb(var(--lighter-color))"),
            new Property("filter: drop-shadow(2px 4px 6px rgba(var(--shadow-color), 0.6))"),
            new Property('font-family: "Quicksand"'),
            new Property("line-height: 30px"),
            new Property("color: rgb(176 176 176)"),
            new Property("font-size: 20px"),
            new Property("padding-left: 10px"),
        ]
    }
    setTitle(title, isCentered) {
        if (isCentered == true) {
            this.setInnerHTML(title)
            this.element.style.setProperty("transform", 'translate(-50%, -50%)')
            this.element.style.setProperty("text-align", 'center')
            this.element.style.setProperty("width", '85%')
            this.element.style.setProperty("padding-left", '0px')
            this.element.style.setProperty("position", 'absolute')
            this.element.style.setProperty("left", '50%')
            this.element.style.setProperty("top", '50%')
            this.element.style.setProperty("border-radius", 'var(--spacing)')
            return this    
        } else {
            this.setInnerHTML(title)
            this.close = new BaseUIElement([
                new Property("position: relative"),
                new Property("float: right"),
                new Property("width: 30px"),
                new Property("text-align: center"),
                new Property("cursor: pointer"),
                new Property("height: 30px"),
                new Property("background-color: rgba(var(--shadow-color), 0.4)"),
                new Property("border-top-left-radius: var(--spacing)") 
            ])
                .setInnerHTML("X")
            this.appendList([
                this.close
            ])
            return this    
        }
    }
}

class Windows {
    generateProps(left, isLeftOrRight, height, top)  {
        if (left == 0) {
            if (isLeftOrRight == true) {
                return [
                    new Property('position: absolute'),
                    new Property('overflow: hidden'),
                    new Property('background-color: rgb(var(--accented-color))'),
                    new Property('width: 100%'),
                    new Property('--top-before: ' + top),   
                    new Property('--top-after: ' + top),   
                    new Property('--left-before: -100%'),   
                    new Property('--left-after: 0px'),   
                    new Property('height: ' + height + 'px'),
                    new Property('border-top-right-radius: var(--spacing)'),   
                    new Property('border-bottom-right-radius: var(--spacing)'),   
                    ...addAnimation('flyIn', '0.4s')        
                ]
            } else {
                return [
                    new Property('position: absolute'),
                    new Property('background-color: rgb(var(--accented-color))'),
                    new Property('width: 100%'),
                    new Property('overflow: hidden'),
                    new Property('--top-before: ' + top),   
                    new Property('--top-after: ' + top),   
                    new Property('--right-before: -100%'),   
                    new Property('--right-after: 0px'),   
                    new Property('height: ' + height + 'px'),
                    new Property('border-top-left-radius: var(--spacing)'),   
                    new Property('border-bottom-left-radius: var(--spacing)'),   
                    ...addAnimation('flyIn', '0.4s')
                ]        
            }
        } else {
            return [
                new Property('position: absolute'),
                new Property('background-color: rgb(var(--lighter-color))'),
                new Property('width: 100%'),
                new Property('overflow: hidden'),
                new Property('--top-before: ' + top),   
                new Property('--top-after: ' + top),   
                new Property('--scale-before: 80%'),   
                new Property('--scale-after: 100%'),   
                new Property('--left-before: 0px'),   
                new Property('--left-after: 0px'),   
                new Property('height: ' + height + 'px'),
                new Property('border-radius: var(--spacing)'),   
                ...addAnimation('flyIn', '0.4s')
            ]
        }
    }

    constructor(rows) {
        this.baseUI = rows
        this.holder = new BaseUIElement([
            new Property('position: absolute'),
            new Property('top: calc(100px + var(--spacing))'),
            new Property('height: calc(100% - (100px + (2 * var(--spacing))))'),
            new Property('left: 0px'),
            new Property('width: 100%'),
        ])
        this.holder.setId('default-window-holder')
        this.holder.appendTo(document.body)
        rows.forEach((row, index) => {
            if (row.isMiddle == true) {
                this.middleWindow = row
            }
        })
        var isLeft = true
        var curSpacing = 0
        this.totalRowList = []
        this.totalItemList = []
        var spacingTimes = 0
        var totalSize = 0
        var totalSpacing = 0
        rows.forEach((row, index) => {
            var curList = []
            var rowItem = {}
            rowItem.items = []
            if (row != this.middleWindow) {
                if (isLeft == true) {
                    var otherHolder = new BaseUIElement([
                        new Property('position: absolute'),
                        new Property('top: 0px'),
                        new Property('height: 100%'),
                        new Property('left: calc(' + curSpacing + 'px + ( ' + spacingTimes + ' * var(--spacing)))'),
                        new Property('width: ' + row.width + 'px'),
                    ])
                    rowItem.holder = otherHolder
                    rowItem.isLeft = isLeft
                    var totalUp = 0
                    var totalSpacingThing = 0
                    var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                    var heightTotal = (this.holder.element.getBoundingClientRect().height) - ((row.items.length-1) * spacingTotal)
                    row.items.forEach((item) => {
                        var baseElement = new BaseUIElement(
                            this.generateProps(curSpacing, isLeft, (heightTotal*item.height), 'calc(' + totalUp + 'px + ( ' + totalSpacingThing + ' * ' + 'var(--spacing)))')
                        )
                        baseElement.originalParent = otherHolder
                        baseElement.title = new TitleBar()
                            .setTitle(item.title)
                        baseElement.rowIndex = index
                        baseElement.uniqueId = item.uniqueId
                        baseElement.title.appendTo(baseElement.element)

                        curList.push(baseElement)
                        rowItem.items.push(baseElement)
                        otherHolder.appendList([
                            baseElement
                        ])
                        totalUp += (heightTotal*item.height)
                        totalSpacingThing += 1
                    })
                    curSpacing += row.width
                    totalSize += row.width
                    spacingTimes += 1    
                    totalSpacing += 1
                    this.holder.appendList([
                        otherHolder
                    ])
                } else {
                    var otherHolder = new BaseUIElement([
                        new Property('position: absolute'),
                        new Property('top: 0px'),
                        new Property('height: 100%'),
                        new Property('right: calc(' + curSpacing + 'px + ( ' + spacingTimes + ' * var(--spacing)))'),
                        new Property('width: ' + row.width + 'px'),
                    ])
                    rowItem.holder = otherHolder
                    rowItem.isLeft = isLeft
                    var totalUp = 0
                    var totalSpacingThing = 0
                    var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                    var heightTotal = (this.holder.element.getBoundingClientRect().height) - ((row.items.length-1) * spacingTotal)
                    row.items.forEach((item) => {
                        var baseElement = new BaseUIElement(
                            this.generateProps(curSpacing, isLeft, (heightTotal*item.height), 'calc(' + totalUp + 'px + ( ' + totalSpacingThing + ' * ' + 'var(--spacing)))')
                        )
                        baseElement.originalParent = otherHolder
                        baseElement.title = new TitleBar()
                            .setTitle(item.title)
                        baseElement.rowIndex = index
                        baseElement.uniqueId = item.uniqueId    
                        baseElement.title.appendTo(baseElement.element)
                        curList.push(baseElement)
                        rowItem.items.push(baseElement)
                        otherHolder.appendList([
                            baseElement
                        ])
                        totalUp += (heightTotal*item.height)
                        totalSpacingThing += 1
                    })
                    curSpacing += row.width
                    totalSize += row.width
                    spacingTimes += 1
                    totalSpacing += 1
                    this.holder.appendList([
                        otherHolder
                    ])
                }
            } else {
                isLeft = false
                curSpacing = 0
                spacingTimes = 0 
                rowItem.isMiddle = true
            }
            this.totalRowList.push(curList)
            this.totalItemList.push(rowItem)
        })
        var middleHolder = new BaseUIElement([
            new Property('position: absolute'),
            new Property('top: 0px'),
            new Property('height: 100%'),
            new Property('right: calc(' + curSpacing + 'px + ( ' + spacingTimes + ' * var(--spacing)))'),
            new Property('width: ' + 'calc(100% - (' + totalSize + 'px + (' + totalSpacing + ' * var(--spacing))))'),
        ])

        this.totalItemList.find(function(item) {
            return (item.isMiddle == true)
        }).holder = middleHolder

        middleHolder.appendList([
            new BaseUIElement(
                this.generateProps(50, true, this.holder.element.getBoundingClientRect().height, '0px')
            )
        ])

        this.holder.appendList([
            middleHolder
        ])
    }
    reorganize(totalObjs) {
        console.log(totalObjs)
        console.log(this.totalItemList)
        totalObjs.forEach((obj, index) => {
            if (obj.items != undefined) {
                obj.items.forEach((item, itemIndex) => {
                    var itemList = this.totalItemList.find(
                        function(val) {
                            var isFound = false
                            val.items.forEach(function(itemOther) {
                                if (itemOther.uniqueId == item.uniqueId) {
                                    isFound = true
                                }
                            })
                            return isFound
                        }
                    )
                    var baseItem = itemList.items.find(
                        function(val) {
                            if (val.uniqueId == item.uniqueId) {
                                return true
                            }
                        }
                    )
                    if (this.totalItemList.indexOf(itemList) == totalObjs.indexOf(obj)) {
                        var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                        var heightTotal = (itemList.holder.element.getBoundingClientRect().height) - ((obj.items.length-1) * spacingTotal)    
                        baseItem.element.style.height = (heightTotal*item.height) + 'px'
                        var heightHandler = 0
                        for (var itemOther in obj.items) {
                            itemOther = obj.items[itemOther]
                            if (item.uniqueId == itemOther.uniqueId) {
                                break
                            } else {
                                heightHandler = heightHandler + (heightTotal * itemOther.height) + spacingTotal
                            }
                        }
                        baseItem.element.style.setProperty('--top-before', heightHandler + 'px')
                        baseItem.element.style.setProperty('--top-after', heightHandler + 'px')
                    } else {
                        itemList.items.splice(itemList.items.indexOf(baseItem), 1)
                        this.totalItemList[index].items.splice(itemIndex, 0, baseItem)
                        var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                        var heightTotal = (itemList.holder.element.getBoundingClientRect().height) - ((obj.items.length-1) * spacingTotal)    
                        baseItem.element.style.height = (heightTotal*item.height) + 'px'
                        baseItem.element.remove()
                        var heightHandler = 0
                        for (var itemOther in obj.items) {
                            itemOther = obj.items[itemOther]
                            if (item.uniqueId == itemOther.uniqueId) {
                                break
                            } else {
                                heightHandler = heightHandler + (heightTotal * itemOther.height) + spacingTotal
                            }
                        }
                        baseItem.element.style.setProperty('--top-before', heightHandler + 'px')
                        baseItem.element.style.setProperty('--top-after', heightHandler + 'px')
                        if (this.totalItemList[index].isLeft == true) {
                            baseItem.element.style.setProperty('--left-before', '-100%')
                            baseItem.element.style.setProperty('--left-after', '0px')
                            baseItem.element.style.setProperty('--right-before', 'none')
                            baseItem.element.style.setProperty('--right-after', 'none')

                            baseItem.element.style.setProperty('border-top-right-radius', 'var(--spacing)')
                            baseItem.element.style.setProperty('border-bottom-right-radius', 'var(--spacing)')
                            baseItem.element.style.setProperty('border-top-left-radius', '0px')
                            baseItem.element.style.setProperty('border-bottom-left-radius', '0px')
                        } else {
                            baseItem.element.style.setProperty('--right-before', '-100%')
                            baseItem.element.style.setProperty('--right-after', '0px')
                            baseItem.element.style.setProperty('--left-before', 'none')
                            baseItem.element.style.setProperty('--left-after', 'none')
                            baseItem.element.style.setProperty('border-top-right-radius', '0px')
                            baseItem.element.style.setProperty('border-bottom-right-radius', '0px')
                            baseItem.element.style.setProperty('border-top-left-radius', 'var(--spacing)')
                            baseItem.element.style.setProperty('border-bottom-left-radius', 'var(--spacing)')
                        }
                        this.totalItemList[index].holder.element.appendChild(baseItem.element)
                        baseItem.originalParent = this.totalItemList[index].holder
                        baseItem.rowIndex = index
                        this.totalItemList[index].destroyed = undefined
                    }
                })
                if (obj.isMiddle != true && obj.items.length == 0) {
                    this.totalItemList[index].destroyed = true
                }
                var middle = this.totalItemList.find(function(val)  { return (val.isMiddle == true) })
                var totalSpacing = 0
                var rightWidth = 0
                var rightSpacing = 0
                var totalWidth = 0
                this.totalItemList.forEach(function(item) {
                    if (item.isMiddle != true) {
                        if (item.destroyed != true) {
                            totalWidth += Number(item.holder.element.style.width.split('px')[0])
                            totalSpacing += 1
                        }
                        if (item.isLeft == false && item.destroyed != true) {
                            rightSpacing += 1
                            rightWidth += Number(item.holder.element.style.width.split('px')[0])
                        }
                    }
                })
                if (totalSpacing == 1) {
                    totalSpacing = 2
                }
                if (rightSpacing == 0) {
                    rightSpacing = 1
                }
                middle.holder.element.style.right = 'calc(' + rightWidth + 'px + ( ' + rightSpacing + ' * var(--spacing)))'
                middle.holder.element.style.width = 'calc(100% - (' + totalWidth + 'px + (' + totalSpacing + ' * var(--spacing))))'
            }
        })
    }
    handleDragFunctionality() {
        this.totalRowList.forEach((rows) => {
            rows.forEach((row) => {
                row.title.element.onmousedown = async (e) => {
                    var otherDat = await onDrag({x: e.clientX, y: e.clientY}, row, this.baseUI)
                    this.baseUI = otherDat
                    this.reorganize(otherDat)
                }
            })
        })
    }
}
module.exports = {
    TopUI,
    MiddleUI,
    Windows,
    prepareSettings,
    LeftUI,
    RightUI,
    TitleBar,
    Button,
    intialAnimation,
    showLoader
}


var { UIElementGroup, BaseUIElement, Property, generateAnimation, addNewElementWithName } = require('../shared/ui')
var { addAnimation } = require('../shared/baseElements')

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


class DraggableWindows {
    generateProps(left, isLeftOrRight, height, top, useScale)  {
        if (left == 0) {
            if (isLeftOrRight == true) {
                return [
                    new Property('position: absolute'),
                    new Property('overflow: hidden'),
                    new Property('background-color: rgb(var(--accented-color))'),
                    new Property('width: 100%'),
                    new Property('transition: box-shadow 0.2s, opacity 0.2s'),   
                    new Property('--top-before: ' + top),   
                    new Property('--top-after: ' + top),   
                    new Property('--left-before: -100%'),   
                    new Property('--left-after: 0px'),   
                    new Property('height: ' + height + 'px'),
                    new Property('border-top-right-radius: var(--spacing)'),   
                    new Property('border-bottom-right-radius: var(--spacing)'),   
                    ...addAnimation((useScale == true) ? 'scaleIn' : 'flyIn', '0.4s')        
                ]
            } else {
                return [
                    new Property('position: absolute'),
                    new Property('background-color: rgb(var(--accented-color))'),
                    new Property('width: 100%'),
                    new Property('overflow: hidden'),
                    new Property('--top-before: ' + top),   
                    new Property('transition: box-shadow 0.2s, opacity 0.2s'),   
                    new Property('--top-after: ' + top),   
                    new Property('--right-before: -100%'),   
                    new Property('--right-after: 0px'),   
                    new Property('height: ' + height + 'px'),
                    new Property('border-top-left-radius: var(--spacing)'),   
                    new Property('border-bottom-left-radius: var(--spacing)'),   
                    ...addAnimation((useScale == true) ? 'scaleIn' : 'flyIn', '0.4s')
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
                new Property('transition: box-shadow 0.2s, opacity 0.2s'),   
                new Property('--scale-after: 100%'),   
                new Property('--left-before: 0px'),   
                new Property('--left-after: 0px'),   
                new Property('height: ' + height + 'px'),
                new Property('border-radius: var(--spacing)'),   
                ...addAnimation((useScale == true) ? 'scaleIn' : 'flyIn', '0.4s')
            ]
        }
    }

    constructor(rows) {
        this.holder = new BaseUIElement([
            new Property('position: absolute'),
            new Property('top: calc(100px + var(--spacing))'),
            new Property('height: calc(100% - (100px + (2 * var(--spacing))))'),
            new Property('left: 0px'),
            new Property('width: 100%'),
        ])
        this.holder.appendTo(document.body)
        rows.forEach((row, index) => {
            if (row.isMiddle == true) {
                this.middleWindow = row
            }
        })
        this.totalRowList = []
        var isLeft = true
        var curSpacing = 0
        var spacingTimes = 0
        var totalSize = 0
        var totalSpacing = 0
        rows.forEach((row, index) => {
            var curList = []
            if (row != this.middleWindow) {
                if (isLeft == true) {
                    var otherHolder = new BaseUIElement([
                        new Property('position: absolute'),
                        new Property('top: 0px'),
                        new Property('height: 100%'),
                        new Property('left: calc(' + curSpacing + 'px + ( ' + spacingTimes + ' * var(--spacing)))'),
                        new Property('width: ' + row.width + 'px'),
                    ])
                    var totalUp = 0
                    var totalSpacingThing = 0
                    var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                    var heightTotal = (this.holder.element.getBoundingClientRect().height) - ((row.items.length-1) * spacingTotal)
                    row.items.forEach((item) => {
                        var addElement =  new BaseUIElement(
                            this.generateProps(curSpacing, isLeft, (heightTotal*item.height), 'calc(' + totalUp + 'px + ( ' + totalSpacingThing + ' * ' + 'var(--spacing)))', true)
                        )
                        if (item.title != undefined) {
                            addElement.appendList([
                                new TitleBar()
                                    .setTitle(item.title, true)
                            ])
                        }
                        addElement.rowIndex = index
                        addElement.isBlank = item.isBlank
                        addElement.uniqueId = item.uniqueId
                        addElement.beforeTop = addElement.element.style.getPropertyValue('--top-after')
                        addElement.baseHeight = item.height
                        curList.push(addElement)
                        otherHolder.appendList([
                           addElement
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
                    var totalUp = 0
                    var totalSpacingThing = 0
                    var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                    var heightTotal = (this.holder.element.getBoundingClientRect().height) - ((row.items.length-1) * spacingTotal)
                    row.items.forEach((item) => {
                        var addElement =  new BaseUIElement(
                            this.generateProps(curSpacing, isLeft, (heightTotal*item.height), 'calc(' + totalUp + 'px + ( ' + totalSpacingThing + ' * ' + 'var(--spacing)))', true)
                        )
                        if (item.title != undefined) {
                            addElement.appendList([
                                new TitleBar()
                                    .setTitle(item.title, true)
                            ])
                        }
                        addElement.rowIndex = index
                        addElement.isBlank = item.isBlank
                        addElement.uniqueId = item.uniqueId
                        addElement.beforeTop = addElement.element.style.getPropertyValue('--top-after')
                        addElement.baseHeight = item.height
                        curList.push(addElement)
                        otherHolder.appendList([
                           addElement
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
            }
            this.totalRowList.push(curList)
        })
        var middleHolder = new BaseUIElement([
            new Property('position: absolute'),
            new Property('top: 0px'),
            new Property('height: 100%'),
            new Property('right: calc(' + curSpacing + 'px + ( ' + spacingTimes + ' * var(--spacing)))'),
            new Property('width: ' + 'calc(100% - (' + totalSize + 'px + (' + totalSpacing + ' * var(--spacing))))'),
        ])

        middleHolder.appendList([
            new BaseUIElement(
                this.generateProps(50, true, this.holder.element.getBoundingClientRect().height, '0px', true)
            )
        ])

        this.holder.appendList([
            middleHolder
        ])
    }
    onDrag(element, mousePosition, originPos) {
        var xVal = mousePosition.clientX
        var yVal = mousePosition.clientY
        var doesWork = false
        var updateElemPos = true
        this.totalRowList.forEach((items) => {
            items.forEach((item) => {
                var boundingBox = item.element.getBoundingClientRect()
                var spacingTotal = Number(document.body.style.getPropertyValue('--spacing').split('px')[0])
                var heightTotal = ((this.holder.element.getBoundingClientRect().height) - ((items.length-1) * spacingTotal)) * item.baseHeight
                boundingBox.y = boundingBox.y - item.heightRemoval
                var doesFallWithin = (xVal >= boundingBox.x && yVal >= boundingBox.y && xVal <= (boundingBox.x + boundingBox.width) && yVal <= (boundingBox.y + heightTotal))
                if (doesFallWithin && (item.uniqueId != element.uniqueId)) {

                    // check top third
                    var fallsWithinTopThird = (xVal >= boundingBox.x && yVal >= boundingBox.y && xVal <= (boundingBox.x + boundingBox.width) && yVal <= (boundingBox.y + (0.33 * heightTotal)))
                    var fallsWithinBottomThird = (xVal >= boundingBox.x && yVal >= (boundingBox.y + (0.66 * heightTotal)) && xVal <= (boundingBox.x + boundingBox.width) && yVal <= (boundingBox.y + heightTotal))

                    if (item.isBlank == true) {
                        fallsWithinTopThird = false
                        fallsWithinBottomThird = false
                    }
                    if (fallsWithinTopThird == true) {
                        updateElemPos = false
                        this.itemReplacing = undefined
                        this.topOf = item
                        this.bottomOf = undefined                    
                        item.element.style.animation = 'none'
                        element.element.style.opacity = '1'
                        item.element.style.boxShadow = '0px 0px 0px 0px white inset'
                        item.element.style.height = 'calc(' + (heightTotal * 0.5) + 'px - (0.5 * var(--spacing)))'
                        element.element.style.left = boundingBox.x + 'px'
                        element.element.style.top = (boundingBox.y - (spacingTotal*0.5)) + 'px'    
                        element.element.style.height = 'calc(' + (heightTotal * 0.5) + 'px - (0.5 * var(--spacing)))'            
                        item.element.style.top = item.beforeTop.split('var(--spacing)))')[0] + 'var(--spacing)) + ' + (heightTotal * 0.5) + 'px + (0.5 * var(--spacing)))'
                        item.heightRemoval = (heightTotal * 0.5)
                    } else {
                        if (fallsWithinBottomThird == true) {
                            updateElemPos = false
                            this.itemReplacing = undefined
                            this.topOf = undefined
                            this.bottomOf = item
                            item.element.style.boxShadow = '0px 0px 0px 0px white inset'
                            element.element.style.left = boundingBox.x + 'px'
                            element.element.style.top = 'calc(' + (boundingBox.y + (heightTotal * 0.5)) + 'px)'
                            item.element.style.top = item.beforeTop
                            item.heightRemoval = 0
                            element.element.style.opacity = '1'
                            element.element.style.height = 'calc(' + (heightTotal * 0.5) + 'px)'
                            item.element.style.height = 'calc(' + (heightTotal * 0.5) + 'px - var(--spacing))'
                        } else {
                            item.heightRemoval = 0
                            item.element.style.height = heightTotal + 'px'
                            item.element.style.top = item.beforeTop
                            element.element.style.opacity = '0.3'
                            item.element.style.boxShadow = '0px 0px 0px 2px white inset'
                            this.itemReplacing = item
                            this.topOf = undefined
                            this.bottomOf = undefined        
                        }
                    }
                    item.element.style.opacity = '1'
                    doesWork = true
                } else {
                    item.element.style.boxShadow = '0px 0px 0px 0px white inset'
                    item.element.style.height = heightTotal + 'px'
                    item.element.style.top = item.beforeTop
                    item.element.style.opacity = '0.5'
                    item.heightRemoval = 0
                }
            })
        })
        if (doesWork == false) {
            element.element.style.opacity = '1'
            element.element.style.width = element.beforeWidth + 'px'
            element.element.style.height = element.beforeHeight + 'px'
            this.itemReplacing = undefined
            this.topOf = undefined
            this.bottomOf = undefined
        }
        if (updateElemPos == true) {
            element.element.style.left = (mousePosition.clientX - originPos.x) + 'px'
            element.element.style.top = (mousePosition.clientY - originPos.y) + 'px'    
        }
    }
}

var isVisible = false

async function onDrag(mousePos, draggingElement, rowList) {
    rowList.forEach(function(item) {
        if (item.isMiddle != true && item.items.length == 0) {
            var nonUsedUniqueId = 0
            while (true) {
                var isUsed = false
                for (var list in rowList) {
                    if (rowList[list].items != undefined) {
                        for (var itemThing in rowList[list].items) {
                            if (rowList[list].items[itemThing].uniqueId == nonUsedUniqueId) {
                                nonUsedUniqueId += 1
                                isUsed = true
                                break
                            }
                        }
                    }
                }
                if (isUsed == false) {
                    break
                }
            }
            item.items.push({
                height: 1,
                uniqueId: nonUsedUniqueId,
                isBlank: true
            })
        }
    })
    return new Promise((resolve, reject) => {
        var boundingBox = draggingElement.element.getBoundingClientRect()
        var originPos = {
            x: (mousePos.x - boundingBox.x),
            y: (mousePos.y - boundingBox.y)
        }
        draggingElement.element.style.width = boundingBox.width + 'px'
        draggingElement.element.style.animation = 'none'
        draggingElement.element.style.transition = 'opacity 0.2s'
        draggingElement.element.style.left = (mousePos.x - originPos.x) + 'px'
        draggingElement.element.style.top = (mousePos.y - originPos.y) + 'px'
        draggingElement.element.style.zIndex = 10
        draggingElement.beforeHeight = boundingBox.height
        draggingElement.beforeWidth = boundingBox.width

        draggingElement.element.remove()
        document.body.appendChild(draggingElement.element)
        document.getElementById('default-window-holder').style.display = 'none'
        if (isVisible == false) {
            isVisible = true
            console.log(rowList)
            var windows = new DraggableWindows(rowList)
            window.onmousemove = async function(e2) {
                e2.preventDefault()
                windows.onDrag(draggingElement, e2, originPos)
            }
            window.onmouseup = async function () {
                window.onmousemove = function() {}
                windows.holder.element.remove()
                if (windows.topOf != undefined || windows.itemReplacing != undefined || windows.bottomOf != undefined) {
                    console.log(rowList)
                    var baseElem = rowList[draggingElement.rowIndex].items.find((item) => {
                        if (item.uniqueId == draggingElement.uniqueId) {
                            return item
                        }
                    })
                    
                    rowList[draggingElement.rowIndex].items.splice(rowList[draggingElement.rowIndex].items.indexOf(baseElem), 1)
                    var totalHeightAdded = (baseElem.height/rowList[draggingElement.rowIndex].items.length)
                    rowList[draggingElement.rowIndex].items.forEach(function(item) {
                        item.height += totalHeightAdded
                    })
                    

                    if (windows.itemReplacing != undefined) {
                        console.log(windows.itemReplacing)
                        var replacingElement = rowList[windows.itemReplacing.rowIndex].items.find((item) => {
                            if (item.uniqueId == windows.itemReplacing.uniqueId) {
                                return item
                            }
                        })
                        console.log(replacingElement)

                        var originIndex = rowList[windows.itemReplacing.rowIndex].items.indexOf(replacingElement)
                        rowList[windows.itemReplacing.rowIndex].items.splice(rowList[windows.itemReplacing.rowIndex].items.indexOf(replacingElement), 1)
                        baseElem.height = replacingElement.height

                        rowList[windows.itemReplacing.rowIndex].items.splice(originIndex, 0, baseElem)
                    } else {
                        if (windows.topOf != undefined) {
                            var belowElement = rowList[windows.topOf.rowIndex].items.find((item) => {
                                if (item.uniqueId == windows.topOf.uniqueId) {
                                    return item
                                }
                            })

                            baseElem.height = (belowElement.height * 0.5)

                            rowList[windows.topOf.rowIndex].items[rowList[windows.topOf.rowIndex].items.indexOf(belowElement)].height = (belowElement.height * 0.5)
                            rowList[windows.topOf.rowIndex].items.splice(
                                (rowList[windows.topOf.rowIndex].items.indexOf(belowElement) - 1),
                                0,
                                baseElem
                            )

                        } else {
                            if (windows.bottomOf != undefined) {
                                var aboveElement = rowList[windows.bottomOf.rowIndex].items.find((item) => {
                                    if (item.uniqueId == windows.bottomOf.uniqueId) {
                                        return item
                                    }
                                })
        
                                baseElem.height = (aboveElement.height * 0.5)
        
                                rowList[windows.bottomOf.rowIndex].items[rowList[windows.bottomOf.rowIndex].items.indexOf(aboveElement)].height = (aboveElement.height * 0.5)
                                rowList[windows.bottomOf.rowIndex].items.splice(
                                    (rowList[windows.bottomOf.rowIndex].items.indexOf(aboveElement) + 1),
                                    0,
                                    baseElem
                                )

        
                            }
        
                        }
                    }
                }
                draggingElement.element.style.width = '100%'
                draggingElement.element.style.animation = 'none'
                draggingElement.element.style.transition = 'none'
                draggingElement.element.style.top = '0px'
                draggingElement.element.style.width = '100%'
                draggingElement.element.style.height = draggingElement.beforeHeight + 'px'
                draggingElement.element.style.left = '0px'
                draggingElement.element.style.animationName = 'flyIn'
                draggingElement.element.style.animationDuration = '0.4s'
                draggingElement.element.style.animationFillMode = 'forwards'
                draggingElement.element.style.zIndex = 1
                draggingElement.element.remove()
                draggingElement.originalParent.element.appendChild(draggingElement.element)
                rowList.forEach(function(itemList) {
                    if (itemList.items != undefined) {
                        if (itemList.items[0] != undefined) {
                            if (itemList.items[0].isBlank == true) {
                                itemList.items = []
                            }
                        }
                    }
                })
                document.getElementById('default-window-holder').style.display = 'block'
                isVisible = false
                resolve(rowList)
            }
        }
    })
}

module.exports = {
    onDrag
}
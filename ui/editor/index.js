var viewerElements = require('./viewerElements')
var { beginObserving, handleColor } = require('./colorEngine');
const { Property } = require('../shared/ui');
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


ready(async function() {
    viewerElements.intialAnimation()
    viewerElements.prepareSettings({
        'spacing': '7.5px',
        'accented-color': 'red'
    })
    if (window.localStorage.getItem('color-theme') == null) {
        window.localStorage.setItem('color-theme', '#222222')
    }
    document.body.style.setProperty('background-color', window.localStorage.getItem('color-theme'))
    handleColor(window.localStorage.getItem('color-theme'))
    var loaderHolder = viewerElements.showLoader(
        'https://tr.rbxcdn.com/180DAY-044b2d85c605d39a0cf1fa3d1575a347/256/256/Image/Webp/noFilter',
        200
    )
        .appendTo(document.body)
    await new Promise(resolve => setTimeout(resolve, 1000));
    loaderHolder.transitionOut()
    await new Promise(resolve => setTimeout(resolve, 100));
    var top = new viewerElements.TopUI([])
        .appendTo(document.body)
        .appendList([
            
        ])
    var width = window.innerWidth*0.15
    var baseWindowConfig = [
        {
            width: width,
            items: [
                {
                    height: 0.5,
                    title: "Properties",
                    uniqueId: 0
                },
                {
                    height: 0.5,
                    title: "Toolbox",
                    uniqueId: 1
                },
            ]

        },
        {
            isMiddle: true,
            uniqueId: 2
        },
        {
            width: width,
            items: [
                {
                    height: 1,
                    title: "Explorer",
                    uniqueId: 3
                },
            ]
        }
    ]
    var windows = new viewerElements.Windows(baseWindowConfig)
    windows.handleDragFunctionality()
        /*
    var left = new viewerElements.LeftUI([])
        .appendTo(document.body)
    var right = new viewerElements.RightUI([])
        .appendTo(document.body)
    var middle = new viewerElements.MiddleUI([])
        .appendTo(document.body)
        */
    beginObserving()
})
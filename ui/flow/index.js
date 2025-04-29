var uiElements = require('./uiElements')
var viewerElements = require('../editor/viewerElements')
var { beginObserving, handleColor } = require('../editor/colorEngine');
const { Property, generateAnimation } = require('../shared/ui');
var { handleColor } = require('../editor/colorEngine')
var { IntroductionPanel, ThemePanel, GuestAccountPanel, FinishedPanel } = require('./introFlow')
var { LoadingSpinner } = require('../shared/uiComponents')

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
    var cookie = new URLSearchParams(document.cookie.replaceAll('; ', '&'))
    console.log(cookie.get('state'))
    if (cookie.get('state') == null) {
        var mainBtn = new uiElements.RobloxButton([
            new Property('margin-top: 27.5px')
        ])
            .bind('click', function() {
                mainBtn.element.getElementsByClassName("innerElements")[0].style.opacity = '0'
                generateAnimation('fadeSpinner', [
                    {
                        percent: 0,
                        props: [
                            new Property('opacity: 0')
                        ]
                    },
                    {
                        percent: 100,
                        props: [
                            new Property('opacity: 1')
                        ]
                    }
                ])
                var loader = new LoadingSpinner([
                    new Property('width: 30px'),
                    new Property('height: 30px'),
                    new Property('position: absolute'),
                    new Property('transform: translate(-50%, -50%)'),
                    new Property('left: 50%'),
                    new Property('opacity: 0'),
                    new Property('animation: fadeSpinner 0.3s forwards'),
                    new Property('top: 50%'),
                ])
                loader.primaryLoader.element.style.backgroundColor = "rgb(var(--text-color))"
                loader.appendTo(mainBtn.element)
                window.location.href = '/flow/continue/'
            })
        var holder = new uiElements.BaseHolder([
        ])
            .appendTo(document.body)
            .appendList([
                new uiElements.MainText()
                    .setInnerHTML("Welcome<br>" + uiElements.switchToRegularText('Sign in with your Roblox account to continue')),
                mainBtn
            ])    
    } else {
        var finalResponse = await fetch('/api/retrieve-info', {
            credentials: 'include',
            method: "GET"
        })
            .then(res => res.json())
        console.log(finalResponse)
        var panel = new IntroductionPanel(finalResponse.name, finalResponse.picture)
            .appendTo(document.body)
        panel.mainButton.bind('click', function() {
            panel.mainButton.element.pointerEvents = 'none'
            panel.animateOut()
            var theme = new ThemePanel(
                function(color) {
                    document.body.style.backgroundColor = color
                    handleColor(color)
                }
            )
            theme.animateInTransition()
            theme.mainButton.bind('click', function() {
                theme.mainButton.element.pointerEvents = 'none'
                theme.animateOut()
                var guest = new GuestAccountPanel()
                    .appendTo(document.body)
                guest.animateInTransition()
                guest.noButton.bind('click', function() {
                    guest.noButton.element.pointerEvents = 'none'
                    guest.animateOut()
                    var finished = new FinishedPanel()
                        .appendTo(document.body)
                    finished.animateInTransition()
                    finished.mainButton.bind('click', function() {
                        finished.mainButton.element.style.height = '40px'
                        finished.mainButton.element.style.pointerEvents = 'none'
                        finished.mainButton.element.innerHTML = ""
                        generateAnimation('fadeSpinner', [
                            {
                                percent: 0,
                                props: [
                                    new Property('opacity: 0')
                                ]
                            },
                            {
                                percent: 100,
                                props: [
                                    new Property('opacity: 1')
                                ]
                            }
                        ])
                        var loader = new LoadingSpinner([
                            new Property('width: 30px'),
                            new Property('height: 30px'),
                            new Property('position: absolute'),
                            new Property('transform: translate(-50%, -50%)'),
                            new Property('left: 50%'),
                            new Property('opacity: 0'),
                            new Property('animation: fadeSpinner 0.3s forwards'),
                            new Property('top: 50%'),
                        ])
                        loader.primaryLoader.element.style.backgroundColor = "rgb(var(--text-color))"
                        loader.appendTo(finished.mainButton.element)
                        window.location.href = '/'      
                    })
                })
            })
        })
    }
})
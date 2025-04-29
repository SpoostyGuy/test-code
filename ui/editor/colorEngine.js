function nameToRgba(name) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = name;
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data;
}

function handleColor(colorThing) {
    var color = nameToRgba(colorThing)
    color = [color[0], color[1], color[2]]
    var darkerColors = []
    var lighterColors = []
    var shadowColors = []
    var textColors = []
    var darkenAmount = (Number(color[0]) + Number(color[1]) + Number(color[2])) / 3
    if (darkenAmount < 70) {
        textColors = [(255-darkenAmount), (255-darkenAmount), (255-darkenAmount)]
        darkenAmount = ((255-darkenAmount) / 255) * 50
        color.forEach(function(newColor) {
            shadowColors.push(Number(newColor)+(darkenAmount*0.3))
            darkerColors.push(Number(newColor)+(darkenAmount*0.6))
            lighterColors.push(Number(newColor)+darkenAmount)
        })
    } else {
        if (darkenAmount < 160) {
            textColors = [darkenAmount+((255-darkenAmount)*0.6), darkenAmount+((255-darkenAmount)*0.6), darkenAmount+((255-darkenAmount)*0.6)]
            darkenAmount = (darkenAmount / 255) * 200
            color.forEach(function(newColor) {
                shadowColors.push(Number(newColor)-Math.floor((Number(newColor)/255)*(darkenAmount)*1.5))
                darkerColors.push(Number(newColor)-Math.floor((Number(newColor)/255)*(darkenAmount)))
                lighterColors.push(Number(newColor)-(Math.floor((Number(newColor)/255)*(darkenAmount))*0.6))
            })
        } else {
            if (darkenAmount > 230) {
                textColors = [darkenAmount-((darkenAmount-150)*2.0), darkenAmount-((darkenAmount-150)*2.0), darkenAmount-((darkenAmount-150)*2.0)]
            } else {
                textColors = [darkenAmount+((255-darkenAmount)*0.6), darkenAmount+((255-darkenAmount)*0.6), darkenAmount+((255-darkenAmount)*0.6)]
            }
            darkenAmount = (darkenAmount / 255) * 100
            color.forEach(function(newColor) {
                shadowColors.push(Number(newColor)-Math.floor((Number(newColor)/255)*(darkenAmount)*1.5))
                darkerColors.push(Number(newColor)-Math.floor((Number(newColor)/255)*(darkenAmount)))
                lighterColors.push(Number(newColor)-(Math.floor((Number(newColor)/255)*(darkenAmount))*0.8))
            })
        }
    }
    document.body.style.setProperty('--shadow-color', shadowColors.join(", "))
    document.body.style.setProperty('--accented-color', darkerColors.join(", "))
    document.body.style.setProperty('--lighter-color', lighterColors.join(", "))
    document.body.style.setProperty('--text-color', textColors.join(", "))
}

function beginObserving() {
    handleColor(document.body.style.backgroundColor)
    const observer = new MutationObserver(function() {
        window.localStorage.setItem('color-theme', document.body.style.backgroundColor)
        handleColor(document.body.style.backgroundColor)
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      childList: true
    });    
}

module.exports = {
    beginObserving,
    handleColor
}
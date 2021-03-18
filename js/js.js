const longTapSpeed = 0.02
const releaseSpeed = 0.1
const rippleOpacity = 0.3
const rippleHideSpeed = 0.03
const margin = 1.1
const clickable = document.querySelector('.myClickable');

clickable.addEventListener('mousedown', function(e) {
    const foreground = document.createElement('canvas')
    foreground.classList.add('myClickableForeground')
    foreground.width = clickable.clientWidth
    foreground.height = clickable.clientHeight
    foreground.setAttribute('data-mousedown', 'data-mousedown')
    clickable.appendChild(foreground)

    const max = Math.max(foreground.width, foreground.height)
    const ctx = foreground.getContext('2d')

    const createCircle = function (rate) {
        const circle = new Path2D()
        const radius = (max * rate * 0.5) * margin
        circle.arc(
            (foreground.width / 2),
            (foreground.height / 2),
            radius, 2 * Math.PI, false
        )
        return circle
    }

    
    var lastOpacityRate = 0
    const drawHideFrame = function () {
        if (!foreground.hasAttribute('data-mousedown')) {
            ctx.clearRect(0, 0, foreground.width, foreground.height)

            const circle = createCircle(1)
            lastOpacityRate += rippleHideSpeed

            ctx.fillStyle = `rgba(0, 0, 0, ${rippleOpacity * (1-lastOpacityRate)})`
            ctx.fill(circle)
            console.dir(circle)
        }
        if (lastOpacityRate < 1) {
            requestAnimationFrame(drawHideFrame)
        }
    }

    var lastCircleRate = 0
    const drawCircleFrame = function () {
        const rate = lastCircleRate = lastCircleRate + (foreground.hasAttribute('data-mousedown') ? longTapSpeed : releaseSpeed)

        ctx.clearRect(0, 0, foreground.width, foreground.height)
        
        const circle = createCircle(rate)
        ctx.fillStyle = `rgba(0, 0, 0, ${rippleOpacity})`
        ctx.fill(circle)
        console.dir(circle)

        if (rate < 1) {
            requestAnimationFrame(drawCircleFrame)
        } else {
            requestAnimationFrame(drawHideFrame)
        }
    }
    requestAnimationFrame(drawCircleFrame)
    
    clickable.addEventListener('mouseup', function(e) {
        foreground.removeAttribute('data-mousedown')
    }, { once: true, })
})

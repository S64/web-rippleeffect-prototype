const longTapSpeed = 0.03
const releaseSpeed = 0.1
const rippleHideSpeed = 0.03
const rippleOpacity = 0.3

const clickable = document.querySelector('.myClickable');
var canvases = {}

const initCanvas = function (clickable) {
    const c = document.createElement('canvas')
    c.classList.add('myClickableForeground')
    c.width = clickable.clientWidth
    c.height = clickable.clientHeight
    clickable.appendChild(c)
    return c
}

const createCircle = function (posX, posY, canvasMax, rate) {
    const circle = new Path2D()
    const radius = canvasMax * rate
    circle.arc(
        posX,
        posY,
        radius, 2 * Math.PI, false
    )
    return circle
}

const drawCircleFrame = function (identifier) {
    return function () {
        const x = canvases[identifier]
        const rate = x.lastCircleRate + (x.canvas.hasAttribute('data-touch') ? longTapSpeed : releaseSpeed)

        const ctx = x.canvas.getContext('2d')
        ctx.clearRect(0, 0, x.canvas.width, x.canvas.height)
        
        const circle = createCircle(
            x.pos[0], x.pos[1],
            Math.max(x.canvas.width, x.canvas.height),
            rate
        )
        ctx.fillStyle = `rgba(0, 0, 0, ${rippleOpacity})`
        ctx.fill(circle)
        console.dir(circle)

        canvases[identifier] = {
            ...x,
            lastCircleRate: rate,
        }

        if (rate < 1) {
            requestAnimationFrame(drawCircleFrame(identifier))
        } else {
            requestAnimationFrame(drawHideFrame(identifier))
        }
    }
}

const drawHideFrame = function (identifier) {
    return function () {
        const x = canvases[identifier]
        const rate = x.lastOpacityRate + rippleHideSpeed
        const ctx = x.canvas.getContext('2d')

        if (!x.canvas.hasAttribute('data-touch')) {
            ctx.clearRect(0, 0, x.canvas.width, x.canvas.height)
    
            const circle = createCircle(
                x.pos[0], x.pos[1],
                Math.max(x.canvas.width, x.canvas.height),
                1
            )
    
            ctx.fillStyle = `rgba(0, 0, 0, ${rippleOpacity * (1-rate)})`
            ctx.fill(circle)
            console.dir(circle)

            canvases[identifier] = {
                ...x,
                lastOpacityRate: rate,
            }
        }
        if (rate < 1) {
            requestAnimationFrame(drawHideFrame(identifier))
        } else {
            x.canvas.remove()
            canvases[identifier] = undefined
        }
    }
}

clickable.addEventListener('touchstart', function (e) {
    const rect = clickable.getBoundingClientRect()

    for (var itr=0; itr<e.changedTouches.length; itr++) {
        const touch = e.changedTouches[itr]
        const c = initCanvas(clickable)
        
        canvases[touch.identifier] = {
            pos: [
                touch.pageX - rect.left,
                touch.pageY - rect.top,
            ],
            canvas: c,
            lastCircleRate: 0,
            lastOpacityRate: 0,
        }

        c.setAttribute('data-touch', 'data-touch')
        requestAnimationFrame(drawCircleFrame(touch.identifier))
    }
})

const touchEndEvent = function (e) {
    for (var itr=0; itr < e.changedTouches.length; itr++) {
        const touch = e.changedTouches[itr]
        
        if (touch.identifier in canvases) {
            canvases[touch.identifier].canvas.removeAttribute('data-touch')
        }
    }
}

clickable.addEventListener('touchend', touchEndEvent)
clickable.addEventListener('touchcancel', touchEndEvent)

const canvas = document.getElementById('canvas'),
context = canvas.getContext('2d');
let isMouseDown = false
canvas.height = 600
canvas.width = 600
let coords = []


    const userLineWidth = document.getElementById('line-width')
    const userLineColor = document.getElementById('line-color')



    changeWidth = ()=>{
        if(userLineWidth.value<=0){
            alert('Need positive number')
            context.lineWidth   = 1
            userLineWidth.value = 1
        }
        if(userLineWidth.value>0){
            context.lineWidth = userLineWidth.value
        }
        if(userLineWidth.value>canvas.width&&canvas.height){
            alert('are u mad? u havent enought window size')
            context.lineWidth   = 1
            userLineWidth.value = 1
        }
    }
    changeColor = ()=>{
        userLineColor.value === ""? context.strokeStyle = 'black' : context.strokeStyle = userLineColor.value 
        userLineColor.value === ""? context.fillStyle = 'black' :context.fillStyle   = userLineColor.value 
        userLineColor.style.color = userLineColor.value
    }
    canvasClear = ()=>{
        context.beginPath()
        context.clearRect(0,0, canvas.width, canvas.height )

    }
    verticalFlip = ()=>{ 
        context.save()
        context.setTransform(1,0,0,-1,0,canvas.width);
        context.drawImage(canvas,0,0)
        context.restore()

    }
    horizontalFlip = ()=>{
        context.save()
        context.setTransform(-1,0,0,1,canvas.width,0);
        context.drawImage(canvas,0,0)
        context.restore()
    }
    saveF=()=>{
        localStorage.setItem('coords', JSON.stringify(coords))
    }
    replay=()=>{
        canvasClear()
        let timer = setInterval(()=>{
            if(!coords.length){
                clearInterval(timer)
                context.beginPath()
                return
            }
            let crd = coords.pop(),
        e = {
            clientX: crd['0'],
            clientY: crd['1'],
            color: crd['2'],
            width: crd['3']
        }

        context.lineTo(e.clientX, e.clientY)
        context.strokeStyle = e.color
        context.lineWidth = e.width
        context.stroke()
        context.beginPath()
        context.arc(e.clientX, e.clientY, e.width / 2 ,0 , Math.PI*2)
        context.fillStyle = e.color
        context.fill()
        context.beginPath()
        context.moveTo(e.clientX, e.clientY)
        context.strokeStyle = userLineColor.value
        context.fillStyle = userLineColor.value
        }, 1)
        
    }
    undo =()=>{
            coords = JSON.parse(localStorage.getItem('coords'))
            replay()
        
    }
whenMouseMove =(e)=>{
    coords.push([e.clientX, e.clientY, userLineColor.value, userLineWidth.value])
    context.lineTo(e.clientX, e.clientY)
    context.stroke()
    context.beginPath()
    context.arc(e.clientX, e.clientY, userLineWidth.value / 2 ,0 , Math.PI*2)
    context.fill()
    context.beginPath()
    context.moveTo(e.clientX, e.clientY)
}
canvas.addEventListener('contextmenu', (e)=>{if(e.which==3){e.preventDefault()}})
canvas.addEventListener('mousedown', ()=>{isMouseDown = true; saveF()})
canvas.addEventListener('mouseup', ()=>{isMouseDown = false; context.beginPath(); coords.push('mouseup')})
canvas.addEventListener('mousemove', (e)=>{
    if(e.which==1){
      whenMouseMove(e)
      
    }
    if(e.which==3){
        context.fillStyle = 'white'
        context.strokeStyle = 'white'
        whenMouseMove(e)
       changeColor()
    }
    })

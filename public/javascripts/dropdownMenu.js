const roomMenu = document.getElementById('rooms-button')
const rooms = document.getElementById('rooms')
roomMenu.onclick = ()=>{
    console.log(rooms.style.display)
    switch (rooms.style.display){
        case 'none':
            rooms.style.display = 'flex'
            break
        case 'flex':
            rooms.style.display = 'none'
            break
        default:
            rooms.style.display = 'flex'
            break
    }
}

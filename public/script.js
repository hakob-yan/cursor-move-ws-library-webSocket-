function moveCursor(x, y) {
    const cursor = document.getElementById('cursor');
    cursor.style.top = y+10+'px';
    cursor.style.left = x+10+'px';
}



const socket = new WebSocket('ws://localhost:8080');
socket.onopen = function (e) {
    btn.onclick = function () {
        const val = userText.value || '';
        if (val) {
            socket.send(val)
            userText.value = "";
            userText.focus()
        }
    }

    window.onmousemove = function (e) {
        const { clientX, clientY } = e;
        const sendData = JSON.stringify({ mouseMove: { clientX, clientY } })
        socket.send(sendData)
    }
};

socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.time) {
        title.innerHTML = data.time
    }
    if (data.mouseMove) {
        const XY = data.mouseMove;
        moveCursor(XY.clientX, XY.clientY)
    }


};

socket.onerror = function (e) {
    console.log(e);
}
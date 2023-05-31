const socket = io()

const lista = document.getElementById("producto");

socket.on('prueba' , data => {
    lista.innerHTML = data.title
})
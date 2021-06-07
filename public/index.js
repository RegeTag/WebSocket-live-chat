const socket = io("http://localhost:3000")

function addMessage(message){
    const messageBox = document.getElementById("chatbox")

    const newMessage = document.createElement("div")
    newMessage.classList.add("message")

    newMessage.innerHTML = `
    <strong>${message.user}</strong>
    <p>${message.message}</p>`

    messageBox.appendChild(newMessage)
}

document.getElementById("button").addEventListener("click", () => {
    const messageInput = document.getElementById("message")

    if(messageInput.value == ""){}
    else{
        socket.emit("newMessage", messageInput.value)
    
        messageInput.value = ""
    }
})

socket.on("pastMessages", messages => {
    
    messages.forEach( message => {
        addMessage(message)
    })
})

socket.on("message", message => {
    addMessage(message)
})
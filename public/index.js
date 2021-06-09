const socket = io("http://localhost:3000")


// ================== Functions ======================
const Messages = {
    userMessage(message){
        const nickInput = document.getElementById("nick")
        const messageBox = document.getElementById("chatbox")
        const newMessage = document.createElement("div")
    
        newMessage.classList.add("message")
    
        if(nickInput.value === message.user){
            newMessage.classList.add("mine")
        }
    
        newMessage.innerHTML = `
        <strong>${message.user}</strong>
        <p>${message.message}</p>
        `
    
        messageBox.appendChild(newMessage)
    },
    
    nickChangeMessage(object){
        const messageBox = document.getElementById("chatbox")
        const newMessage = document.createElement("div")

        newMessage.classList.add("message")
        newMessage.classList.add("system")
        newMessage.classList.add("nick")

        newMessage.innerHTML = `<strong>"${object.old}"</strong>` + " changed nickname to " + `<strong>"${object.new}"</strong>`

        messageBox.appendChild(newMessage)
    },

    userLeaveMessage(user){
        const messageBox = document.getElementById("chatbox")
        const newMessage = document.createElement("div")

        newMessage.classList.add("message")
        newMessage.classList.add("system")
        newMessage.classList.add("leave")

        newMessage.innerHTML = `<strong>"${user}"</strong>` + "left the chat!"

        messageBox.appendChild(newMessage)
    }

}

function sendMessageSocket(){
    const nickInput = document.getElementById("nick")
    const messageInput = document.getElementById("message")

    if(nickInput.value == ""){
        throw new Error("No nickname set!")
    }

    if(messageInput.value != ""){
        socket.emit("newMessage", {"message": messageInput.value, "user": nickInput.value})
    
        messageInput.value = ""
    }
}

// ================== Event Listeners ================

document.getElementById("button").addEventListener("click", () => {
    try{
        sendMessageSocket()
    }
    catch(error){
        alert(error)
    }
    
})

document.getElementById("message").addEventListener("keypress" , e => {
    if(e.key === "Enter"){
        try {
            sendMessageSocket()
        } catch (error) {
            alert(error)
        }
    }
})

document.getElementById("nick").addEventListener("change", () => {
    const nickInput = document.getElementById("nick")

    socket.emit("nickChange", nickInput.value )
})

//===================== Sockets ======================

socket.on("pastMessages", messages => {
    
    messages.forEach( message => {
        Messages.userMessage(message)
    })
})

socket.on("message", message => {
    Messages.userMessage(message)
})

socket.on("userNumber", number => {
    const userCounter = document.getElementById("user-counter")

    userCounter.innerHTML = `Users connected: ${number}`
})

socket.on("nickChange", message => {
    Messages.nickChangeMessage(message)
})

socket.on("userDisconnect", user => {
    Messages.userLeaveMessage(user)
})
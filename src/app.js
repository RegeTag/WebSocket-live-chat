const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

var messages = []
var connectedUsers = []

io.on("connection", socket => {
    
    connectedUsers.push({id: socket.id, nick: null})
    
    io.emit("userNumber", connectedUsers.length)
    
    socket.emit("pastMessages", messages)

    socket.on("nickChange", nick => {
        const User = connectedUsers.find( user => user.id == socket.id)

        const oldNick = User.nick
        User.nick = nick

        connectedUsers = connectedUsers.map( user => {
            
            if(user.id == socket.id){
                user = User
            }

            return user
        })


        if(oldNick != null){
            io.emit("nickChange", {old:oldNick, new:User.nick})
        }
    })

    socket.on("newMessage", message => {
        const newMessage = {...message}

        messages.push(newMessage)

        io.emit("message", newMessage)
    })

    socket.on("disconnect", () => {
        
        const user = connectedUsers.find( user => user.id == socket.id)
        
        if(user.nick != null){
            io.emit("userDisconnect", user.nick)
        }

        connectedUsers = connectedUsers.filter( user => user.id != socket.id)
        io.emit("userNumber", connectedUsers.length)
    })

})

app.use(express.static(path.join("public")))


module.exports = {app,server}
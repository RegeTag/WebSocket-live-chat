const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

var messages = []

io.on("connection", socket => {
    console.log(`Socket:${socket.id} connected`)

    socket.emit("pastMessages", messages)

    socket.on("newMessage", message => {
        const newMessage = {message: message, user: socket.id}

        messages.push(newMessage)

        io.emit("message", newMessage)
    })
})




app.use(express.static(path.join("public")))


module.exports = {app,server}
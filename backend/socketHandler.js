let io = null

function initSocket(serverIO){
    io = serverIO
}

function notifyStylist(stylistUsername, appointmentData){
    if(io){
        io.to(stylistUsername).emit("AppointmentNotification", appointmentData)
        console.log(`Notified stylist ${stylistUsername} about new appointment`)
    }
    else{
        console.error('Socket.IO not initialised')
    }

}
module.exports ={ notifyStylist, initSocket}
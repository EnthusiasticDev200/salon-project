


// refactoring sockethandler by bringing in socket connection from express.js
let io = null

function initSocket(server){
    const {Server} = require('socket.io')
    const allowedOrigins = ["http://localhost:3100", "http://localhost:5173"];

    io = new Server(server, {
        cors : {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
                } else {
                  callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    })
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
    
        socket.on("joinRoom", (username) => {
          socket.join(username);
          console.log(`Socket ${socket.id} joined room: ${username}`);
        });
    
        socket.on("disconnect", () => {
          console.log(`Socket disconnected: ${socket.id}`);
        });
      });
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
module.exports = { notifyStylist, initSocket }
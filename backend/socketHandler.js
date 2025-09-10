const db = require('./database')

let io = null

function initSocket(server){
    const {Server} = require('socket.io')
    io = new Server(server, {
        cors : {
            origin: [
                "http://localhost:3100",
                "http://localhost:5173", 
                "https://khleancutz-salon.onrender.com",
            ], 
            methods: ["GET", "POST"],
            credentials: true
        }
    })
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinRoom", (stylistUsername) => {
          socket.join(stylistUsername);
          console.log(`Socket ${socket.id} joined room: ${stylistUsername}`);
        });
        socket.on("joinCustomerRoom", (customerUsername)=>{
            socket.join(customerUsername);
            console.log(`Socket ${socket.id} joined customer room: ${customerUsername};` )
        })
        //stylist response to appointment
        socket.on("stylistResponse", async ({ appointmentId, status, customerUsername }) => {
            try{
                console.log("Stylist response received:", { appointmentId, status });
                if (!appointmentId || typeof appointmentId !== 'number') {
                    console.log(" Not appointmentId or appointmentId is not a number:", typeof appointmentId);
                    console.warn(" Not appointmentId or appointmentId is not a number:", typeof appointmentId);
                    return;
                }
                // Update in database
                const [queryAppointment] = await db.query(`
                    SELECT status 
                    FROM appointments
                    WHERE appointment_id = ?
                    `, [appointmentId])
                if(queryAppointment[0].status !== 'pending'){
                    console.log("new appointment status", queryAppointment[0])
                    console.warn("Appointment already handled")
                    return
                }
                await db.query(
                "UPDATE appointments SET status = ? WHERE appointment_id = ?",
                    [status, appointmentId]
                );
                console.log(`Appointment ${appointmentId} updated to status '${status}'`);
                // (Optional) Notify the customer
                console.log(`Emmiting appointment status to ${customerUsername}`);
                io.to(customerUsername).emit("appointmentStatusUpdated", 
                    {
                        appointmentId,
                        status
                    }) 
            }catch (err) {
                console.error("Error updating appointment status:", err.message);
                }
            });
        socket.on("disconnect", () => {
          console.log(`Socket disconnected: ${socket.id}`);
        });
      });
}
function notifyStylist(stylistUsername, appointmentData){
    if(io){
        io.to(stylistUsername).emit("appointmentNotification", appointmentData)
        console.log(`Notified stylist ${stylistUsername} about new appointment`)
    }
    else{
        console.error('Socket.IO not initialised')
    }
}
// notify customer of new appointment
function notifyCustomer(customerUsername, appointmentData){
    if(io){
        //emitting to new appointment to frontend
        io.to(customerUsername).emit("newCustomerAppointment", appointmentData)
        console.log(`${customerUsername}, your new appointment has been booked successfully`)
    }
    else{
        console.error('Socket.IO not initialised')
    }
}
module.exports ={ notifyStylist, notifyCustomer, initSocket,}
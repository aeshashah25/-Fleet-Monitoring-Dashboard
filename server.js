// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Simulated Robot Data
// let robots = Array.from({ length: 10 }, (_, i) => ({
//     id: `robot_${i + 1}`,
//     status: Math.random() > 0.5,
//     battery: Math.floor(Math.random() * 100) + 1,
//     cpu: Math.floor(Math.random() * 90) + 10,
//     ram: Math.floor(Math.random() * 3500) + 500,
//     location: {
//         lat: parseFloat((Math.random() * 180 - 90).toFixed(6)),
//         lng: parseFloat((Math.random() * 360 - 180).toFixed(6)),
//     },
//     last_updated: new Date().toISOString(),
// }));
// const updateRobotData = () => {
//     robots = robots.map((robot) => ({
//         ...robot,
//         status: Math.random() > 0.5,
//         battery: Math.max(0, robot.battery - Math.floor(Math.random() * 10)),
//         cpu: Math.floor(Math.random() * 90) + 10,
//         ram: Math.floor(Math.random() * 3500) + 500,
//         location: {
//             lat: robot.location.lat + parseFloat((Math.random() * 0.1 - 0.05).toFixed(6)),
//             lng: robot.location.lng + parseFloat((Math.random() * 0.1 - 0.05).toFixed(6)),
//         },
//         last_updated: new Date().toISOString(),
//     }));
// };



// // REST API to get robot data
// app.use(cors());
// app.get("/fake_robot_data", (req, res) => {
//     res.json(robots);
// });

// // WebSocket for real-time updates
// io.on("connection", (socket) => {
//     console.log("Client connected");
//     const interval = setInterval(() => {
//         updateRobotData();
//         console.log(robots); // Add this to verify backend data
//         socket.emit("robot_data", robots);
//     }, 5000);

//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//         clearInterval(interval);
//     });
// });


// // Start the server
// const PORT = 5001;
// server.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

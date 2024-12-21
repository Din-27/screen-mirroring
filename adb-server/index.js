const express = require('express');
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: "*"
});

const captureImage = (socket) => {
    let chunks = []; // Array untuk menyimpan potongan buffer
    const adbProcess = spawn("adb", ["exec-out", "screencap", "-p"]);

    // Menangkap data dari stdout
    adbProcess.stdout.on("data", (data) => {
        chunks.push(data); // Tambahkan potongan buffer ke array
    });

    adbProcess.stdout.on("end", () => {
        const completeBuffer = Buffer.concat(chunks); // Gabungkan semua potongan buffer
        socket.emit("buffer", completeBuffer); // Kirim buffer lengkap
        chunks = []; // Bersihkan array buffer
    });

    // Tangani error jika ada
    adbProcess.stderr.on("data", (error) => {
        console.error(`Error: ${error}`);
    });

    adbProcess.on("close", (code) => {
        console.log(`ADB process exited with code ${code}`);
    });
}

io.on('connection', (socket) => {
    console.log('a user connected');
    captureImage(socket)
    socket.on('finish', (value) => {
        if (value) {
            captureImage(socket)
        }
    })
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});
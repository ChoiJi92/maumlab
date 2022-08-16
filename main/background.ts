import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on('join-room',(roomName,user)=>{
    console.log(roomName,user)
    socket.join(roomName)
    socket.emit("welcome", user);
  })
  socket.on('chat_message',(message,user,roomName) =>{
    console.log(message)
    console.log(roomName)
    socket.to(roomName).emit('message',message,user)
  })
  
});

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const subWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
    await subWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await subWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

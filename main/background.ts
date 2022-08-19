import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

import { Server } from "socket.io";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../renderer/firebase";
import moment from "moment";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });
  socket.on("chat_message", async (message, user, roomId) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const data ={
      id:roomId,
      messageChat:message,
      user:user,
      date:date
    }
   await addDoc(collection(db, "chat"), data);
    socket.to(roomId).emit("message", message, user);
  });
});

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();

  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

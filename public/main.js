// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { getData, savingData, deleteuser } = require("./saveData");

require("@electron/remote/main").initialize();

const fs = require("fs");
// const users = require("../src/Data/users.json");
// const posts = require("../src/Data/posts.json");
const axios = require("axios");
var internetAvailable = require("internet-available");

// "electron-react": "concurrently \"cross-env BROWSER=none npm start\" \"wait-on http://localhost:3000 && electron .\""

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            // contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    if (!isDev) {
        mainWindow.setMenuBarVisibility(false);
    }

    // and load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

ipcMain.handle("getAllData", (event, type) => {
    return getData(type);
});

ipcMain.on("addData", (event, data, type) => {
    // var user_name = path.join(__dirname, "../src/Data/users.json");
    // var m = JSON.parse(fs.readFileSync(user_name).toString());
    // var m = args;
    // fs.writeFileSync(user_name, JSON.stringify(m));
    savingData(data, type);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    createWindow();

    // deleteuser("posts");
    // deleteuser("users");
    // console.log(getData("users"));
    // console.log(getData("posts"));

    internetAvailable()
        .then(async function () {
            console.log("Internet available");
            // var user_name = path.join(__dirname, "../src/Data/users.json");
            // var users = [];
            // if (!fs.existsSync(user_name)) {
            //     await fs.writeFileSync(user_name, JSON.stringify([]));
            // } else {
            //     users = JSON.parse(fs.readFileSync(user_name).toString());
            // }
            // if (users.length !== 0) {
            //     await axios
            //         .get("http://localhost:5000/users")
            //         .then((online_users) => {
            //             users.forEach(async function (user) {
            //                 let flag = 0;
            //                 online_users.data.forEach(function (item) {
            //                     if (user.email === item.email) {
            //                         flag = 1;
            //                         return;
            //                     }
            //                 });
            //                 if (flag === 0) {
            //                     await axios.post(
            //                         "http://localhost:5000/users",
            //                         {
            //                             name: user.name,
            //                             email: user.email,
            //                         }
            //                     );
            //                 }
            //             });
            //         });
            // }

            // await axios
            //     .get("http://localhost:5000/users")
            //     .then((online_users) =>
            //         fs.writeFileSync(
            //             user_name,
            //             JSON.stringify(online_users.data)
            //         )
            //     );

            // There is an error in oping the path file so check that out
            // var post_name = path.join(__dirname, "../src/Data/posts.json");
            // var m = [];
            // if (!fs.existsSync(post_name)) {
            //     await fs.writeFileSync(post_name, JSON.stringify([]));
            // } else {
            //     m = JSON.parse(fs.readFileSync(post_name).toString());
            // }
            // await axios
            //     .get("http://localhost:5000/posts")
            //     .then((online_post) =>
            //         fs.writeFileSync(
            //             post_name,
            //             JSON.stringify(online_post.data)
            //         )
            //     );
        })
        .catch(function (err) {
            console.log("No internet");
            console.log(err);
        });

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

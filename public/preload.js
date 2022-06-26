const { ipcRenderer, contextBridge } = require("electron");

const WINDOW_API = {
    getAllData: () => ipcRenderer.invoke("getAllData"),
    addData: (data, type) => ipcRenderer.send("addData", data, type),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
contextBridge.exposeInMainWorld("desktop", true);

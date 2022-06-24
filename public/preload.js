const { ipcRenderer, contextBridge } = require("electron");

const WINDOW_API = {
    postfile: (data) => ipcRenderer.send("postfile", data),
    allpostadd: (data) => ipcRenderer.send("allpostadd", data),
    allusersadd: (data) => ipcRenderer.send("allusersadd", data),
    userfile: (data) => ipcRenderer.send("userfile", data),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
contextBridge.exposeInMainWorld("desktop", true);

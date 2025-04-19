import { ipcRenderer, contextBridge } from "electron";

if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  once(...args: Parameters<typeof ipcRenderer.once>) {
    const [channel, listener] = args;
    return ipcRenderer.once(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  // Secure way to register IPC listeners
  on: (channel: string, func: (event: any, ...args: any[]) => void) => {
    const validChannels = [
      "cloud-ai-stream-chunk",
      "cloud-ai-stream-done",
      "cloud-ai-stream-error",
      "backend-response",
      "auth-response",
      "backend-port",
      "main-process-message",
      // Add other channel names as needed
    ];
    if (validChannels.includes(channel)) {
      // Explicitly pass only the event data to the callback
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      return true;
    }
    return false;
  },
  removeListener: (
    channel: string,
    func: (event: any, ...args: any[]) => void
  ) => {
    const validChannels = [
      "cloud-ai-stream-chunk",
      "cloud-ai-stream-done",
      "cloud-ai-stream-error",
      "backend-response",
      "auth-response",
      "backend-port",
      "main-process-message",
      // Add other channel names as needed
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
      return true;
    }
    return false;
  },
  removeAllListeners: (channel: string) => {
    const validChannels = [
      "cloud-ai-stream-chunk",
      "cloud-ai-stream-done",
      "cloud-ai-stream-error",
      "backend-response",
      "auth-response",
      "backend-port",
      "main-process-message",
      // Add other channel names as needed
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
      return true;
    }
    return false;
  },
});

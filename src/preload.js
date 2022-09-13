/**
 * =======================================================
 * Fauna
 * Di sini menyambung fungsi spawn call_rpa_log dan send_rpa_log
 * Nanti akan dipanggil di renderer dengan:
 *      fauna.call_rpa_log()
 * =======================================================
 */
const { contextBridge , ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('fauna', {
  set_credential: (uname,pass) => ipcRenderer.invoke('set_credential',uname,pass),
  set_unit_list: (units) => ipcRenderer.invoke('set_unit_list',units),
  send_screenscanner: () => ipcRenderer.invoke('send_screenscanner'),
  kill_screenscanner: () => ipcRenderer.invoke('kill_screenscanner'),
  call_screenscanner: () => ipcRenderer.invoke('call_screenscanner'),
  get_unit_list: () => ipcRenderer.invoke('get_unit_list'),
})
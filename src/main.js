const { app, BrowserWindow, dialog } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
const { send, mainModule } = require('process')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    //== ipcMain:
    //== menyambungkan antara main.js dengan renderer.js
    //== di sisi main, pakai method handle
    //== arg nya string (identitas) dan fungsi yang akan dipanggil dari sebelah
    //== Untuk mempermudah, identitas disamakan dengan nama fungsi
    ipcMain.handle('set_credential', set_credential)
    ipcMain.handle('set_unit_list', set_unit_list)
    ipcMain.handle('get_unit_list', get_unit_list)
    ipcMain.handle('call_screenscanner', call_screenscanner)
    ipcMain.handle('send_screenscanner', send_screenscanner)
    ipcMain.handle('kill_screenscanner', kill_screenscanner)
    win.loadFile(path.join(__dirname, 'index.html'))
    // win.webContents.openDevTools()
  }


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    win = BrowserWindow.getAllWindows().length;
    console.log(win)
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    //== ipcMain juga bisa ditaro disini
  })

/**
 * ===================================================
 * Fauna
 * Di sini menggunakan child process spawn bawaan
 * node js. Log akan dikirim pakai fungsi send_rpa_log
 * ===================================================
 */
//== Spawn subproses(child), disini kita akan membuat pemanggil rpa-log

let spawn = require("child_process").spawn;
let screenscanner_data=""; //log disimpan di sini
let screenscanner_pid=0;
let SSH_USERNAME, SSH_PASSWORD;
let UNIT_LIST="";

/**
 * 
 * SSH_USERNAME = "chip01"
 * SSH_PASSWORD = "P@ssw0rd"
 * Arg pertama isinya resp, why? wallahualam
 */
const set_credential =  (resp,uname,pass) => {
  SSH_USERNAME = uname;
  SSH_PASSWORD = pass;
  console.log(SSH_USERNAME);
  return("Sukses Memperbarui Kredensial")
}

const set_unit_list =  (resp,units) => {
  UNIT_LIST = units.replace(/ /g, "").split(',');
  console.log(UNIT_LIST)
  return("Unit verified")
}

const call_screenscanner = () => {
  win = BrowserWindow.getFocusedWindow();

  const scriptPath = path.join(__dirname, 'automation-script');

  let bat = spawn(
    scriptPath,
    ['-s', 'lamp'],
    { cwd: path.join(__dirname, '..') }
  );

  bat.stdout.on("data", (data) => {
    console.log(data.toString());
    screenscanner_data=""
    screenscanner_data=screenscanner_data.concat(data.toString())
    //bagian ini akan menyuruh browser menjalankan script
    win.webContents.executeJavaScript('get_screenscanner()')
  });

  bat.stderr.on("data", (err) => {
    console.error(err.toString());
  });

  bat.on("exit", (code) => {
    console.log(`Screenscanner exited with code ${code}`);
  });

  screenscanner_pid=bat.pid
}

const kill_screenscanner = async () => {
  u = await process.kill(screenscanner_pid)
  if(u){
    console.log("Sukses Mematikan Screenscanner")
    screenscanner_data="RPA is stopped"
    win.webContents.executeJavaScript('get_screenscanner()')
    return u
  } 
}

//perlu satu fungsi untuk send2 log data ke render side
const send_screenscanner = () =>{
  return screenscanner_data
}

const get_unit_list = () =>{
  return UNIT_LIST
}
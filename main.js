// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
let sqlite3 = require('sqlite3').verbose()
let DJF_database = new sqlite3.Database('./djf_database.sqlite3')
//Sqlite staff
let dbExists = fs.existsSync('./djf_database.sqlite3')

if (!dbExists) {
    fs.openSync('./djf_database.sqlite3', 'w');
}

if (!dbExists) {
    DJF_database.serialize(function() {
        //Creating djf_client registration table
        DJF_database.run("CREATE TABLE djf_client (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, dater TEXT, profilePic BLOB, nameOfCaller TEXT, callerContact TEXT, nameOfPatient TEXT, patientContact TEXT, location TEXT, occupation TEXT, age INTEGER, sex TEXT, maritalStatus TEXT, nameOfCondition TEXT, purposeOfContact TEXT, conditionSeverity TEXT, languageSpoken TEXT, religion TEXT, medicalHistory TEXT, hearingMedium TEXT)")

        //Creating djf_case_status table
        DJF_database.run("CREATE TABLE djf_case_status (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, status TEXT)")

        //Creating interview table
        DJF_database.run("CREATE TABLE interview_assign (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, dater TEXT, interviewStatus)")


        //Creating conditionUpdate table
        DJF_database.run("CREATE TABLE conditionUpdate (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, condition TEXT, dater TEXT)")

        //Creating of imageOfCondition table
        DJF_database.run("CREATE TABLE imageOfCondition (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, image BLOB)")


        //Creating Of additional Image
        DJF_database.run("CREATE TABLE additionalImages (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, images BLOB, dater TEXT)")

        //Creating of support table
        DJF_database.run("CREATE TABLE support (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, supportId TEXT, support TEXT, purposeOfSupport TEXT, amountDonated FLOAT, dateOfSupport TEXT)")

        //Creating of Support Receipt Image table
        DJF_database.run("CREATE TABLE supportReceipt (id INTEGER PRIMARY KEY AUTOINCREMENT, supportId TEXT, receipt BLOB)")

    })
}



function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}


ipcMain.handle('submit_helper_info', async (event, Argument) => {
    let result = Argument
    const base64 = fs.readFileSync(result.patientPic, "base64")
    result.patientPic = Buffer.from(base64, "base64")
    console.log(result)
    //Insert into some argument fields
    DJF_database.run('INSERT INTO djf_client(caseId, dater, profilePic, nameOfCaller, callerContact, nameOfPatient, patientContact, location, occupation, age, sex, maritalStatus, nameOfCondition, purposeOfContact, conditionSeverity, languageSpoken, religion, medicalHistory, hearingMedium) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [result.caseId, result.dater, result.patientPic, result.nameOfCaller, result.callerContact, result.nameOfPatient, result.patientContact, result.location, result.occupation, result.age, result.sex, result.maritalStatus, result.nameOfCondition, result.purposeOfContact, result.conditionSeverity, result.languageSpoken, result.religion, result.medicalHistory, result.hearOfDjf],
        (err) => console.log(err))
})

ipcMain.on('get_data_on_client', (event, arg) => {
    console.log(arg)
    let profileInfo = {}
    DJF_database.get("SELECT profilePic, nameOfPatient, nameOfCondition,purposeOfContact FROM djf_client WHERE caseId = ?",
	[arg], (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
                profileInfo.nameOfPatient = row.nameOfPatient
                profileInfo.patientPic =  row.profilePic
                profileInfo.nameOfCondition = row.nameOfCondition
                profileInfo.purposeOfContact = row.purposeOfContact
                event.sender.send('reply_info', profileInfo)
                }
            })
            //console.log(profileInfo)
            //Event emitter
		})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
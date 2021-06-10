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
        DJF_database.run("CREATE TABLE djf_client (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, dater TEXT, profilePic BLOB, nameOfCaller TEXT, callerContact TEXT, nameOfPatient TEXT, patientContact TEXT, location TEXT, occupation TEXT, age INTEGER, sex TEXT, maritalStatus TEXT, nameOfCondition TEXT, purposeOfContact TEXT, conditionSeverity TEXT, languageSpoken TEXT, religion TEXT, medicalHistory TEXT, hearingMedium TEXT, caseStatus TEXT, benefit INTEGER)")

        //Creating djf_case_status table
        DJF_database.run("CREATE TABLE djf_case_status (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, status TEXT)")

        //Creating interview table
        DJF_database.run("CREATE TABLE interview (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, interviewDate TEXT, description TEXT, status TEXT)")

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
        width: 1100,
        height: 750,
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



//Insert User data into database
ipcMain.handle('submit_helper_info', async (event, Argument) => {
    let result = Argument
	//Check if Argument caseId already exist
	let sql = `SELECT EXISTS(SELECT caseId FROM djf_client WHERE caseId = ?) AS present`;
	 DJF_database.all(sql, [result.caseId], (err, rows) => {
    if (err) {
    throw err
    }
    if(rows){
    if(rows[0].present > 0){
	event.sender.send('reply_result_of_submit', "failed")
	} else {
	if(result.patientPic == ""){
	result.patientPic = "NoImage"
	} else {	
	const base64 = fs.readFileSync(result.patientPic, "base64")
    result.patientPic = Buffer.from(base64, "base64")
	}
    //Insert into some argument fields
    DJF_database.run('INSERT INTO djf_client(caseId, dater, profilePic, nameOfCaller, callerContact, nameOfPatient, patientContact, location, occupation, age, sex, maritalStatus, nameOfCondition, purposeOfContact, conditionSeverity, languageSpoken, religion, medicalHistory, hearingMedium, caseStatus, benefit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [result.caseId, result.dater, result.patientPic, result.nameOfCaller, result.callerContact, result.nameOfPatient, result.patientContact, result.location, result.occupation, result.age, result.sex, result.maritalStatus, result.nameOfCondition, result.purposeOfContact, result.conditionSeverity, result.languageSpoken, result.religion, result.medicalHistory, result.hearOfDjf, result.caseStatus, result.benefit],
        (err) => console.log(err)) 
    //Appending Rows to table body
	event.sender.send('reply_result_of_submit', "success")
        }
	 }})
})


//Search Query 
ipcMain.on('get_result_from_search', (event, arg) => {
	console.log(arg)
	let sql = `SELECT id, caseId, nameOfPatient, patientContact, nameOfCondition, purposeOfContact, conditionSeverity, benefit FROM djf_client WHERE nameOfPatient LIKE ?`;
	 DJF_database.all(sql, [arg], (err, rows) => {
    if (err) {
    throw err
    }
    if(rows){
    console.log(rows);
    //Appending Rows to table body
	event.sender.send('reply_result_from_search', rows[0])
        }
    })
})





//Select user from database
ipcMain.on('get_data_on_client', (event, arg) => {
    console.log(arg)
    let profileInfo = {}
	let donorAmt = {}
    DJF_database.get("SELECT * FROM djf_client WHERE caseId = ?",
	[arg], (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				profileInfo.caseId = row.caseId
                profileInfo.nameOfPatient = row.nameOfPatient
                profileInfo.patientPic =  row.profilePic
				profileInfo.patientContact = row.patientContact
				profileInfo.nameOfCaller = row.nameOfCaller
				profileInfo.callerContact = row.callerContact
                profileInfo.nameOfCondition = row.nameOfCondition
                profileInfo.purposeOfContact = row.purposeOfContact
				profileInfo.occupation = row.occupation
				profileInfo.language = row.languageSpoken
				profileInfo.location = row.location
				profileInfo.religion = row.religion
				profileInfo.age = row.age
				profileInfo.sex = row.sex
				profileInfo.maritalStatus = row.maritalStatus
				profileInfo.conditionSeverity = row.conditionSeverity
				profileInfo.medicalHistory = row.medicalHistory
				profileInfo.hearingMedium = row.hearingMedium
				profileInfo.caseStatus = row.caseStatus
                }
				console.log(profileInfo)
               // event.sender.send('reply_info', profileInfo)
				DJF_database.get("SELECT SUM(amountDonated) AS amt FROM support WHERE caseId = ?",[arg],
				(err, row) => {
				if(err){
					return console.error(err.message)
					}
				if(row){
					if(row.amt){
					profileInfo.amountDonated = row.amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
					console.log(donorAmt)
					//profileInfo.amountDonated = row.amountDonated
					} else {
						profileInfo.amountDonated = 0.00
					}
				  }
				event.sender.send('reply_info', profileInfo)
				})
            })
		
            //console.log(profileInfo)
            //Event emitter
		})

//Select All Data for records
ipcMain.on('get_data_on_records', (event, arg) => {
	let sql = `SELECT id, caseId, nameOfPatient, patientContact, nameOfCondition, purposeOfContact, conditionSeverity, benefit FROM djf_client ORDER BY id DESC`;
	 DJF_database.all(sql, [], (err, rows) => {
    if (err) {
    throw err
    }
    rows.forEach((row) => {
    //console.log(row.nameOfPatient);
    //Appending Rows to table body
	event.sender.send('reply_get_records', row)
        })
    })
	
	//Get number of people
	let sql2 = `SELECT COUNT(*) AS countId FROM djf_client`;
	DJF_database.all(sql2, [], (err, rows) => {
    if (err) {
    throw err
    }
    if(rows){
    console.log(rows[0]);
    //Appending Rows to table body
	event.sender.send('reply_count_records', rows[0])
        }
    }) 
	
	//Get number of people
	let sql3 = `SELECT COUNT(*) AS countBenefits FROM djf_client WHERE benefit = ?`;
	DJF_database.all(sql3, [2], (err, rows) => {
    if (err) {
    throw err
    }
    if(rows){
    console.log(rows[0]);
    //Appending Rows to table body
	event.sender.send('reply_count_beneficials', rows[0])
        }
    })
	
	//Get number of closed case
	let sql4 = `SELECT COUNT(*) AS countCaseClose FROM djf_client WHERE caseStatus = ?`;
	DJF_database.all(sql4, ["close"], (err, rows) => {
    if (err) {
    throw err
    }
    if(rows){
    console.log(rows[0]);
    //Appending Rows to table body
	event.sender.send('reply_count_caseClose', rows[0])
        }
    })
	
})




//Select All Data from condition
ipcMain.on('get_data_on_condition', (event, arg)=>{
	let sql = `SELECT * FROM conditionUpdate WHERE caseId = ?`
	DJF_database.all(sql, [arg], (err, rows) => {
		if (err) {
			throw err
		}
		rows.forEach((row) => {
			event.sender.send('reply_to_conditionUpdate', row)
		})
	})
})


//Select All Data from Donation
ipcMain.on('get_data_on_donationUpdate', (event, arg)=>{
	let sql = `SELECT * FROM support WHERE caseId = ?`
	DJF_database.all(sql, [arg], (err, rows) => {
		if (err) {
			throw err
		}
		rows.forEach((row) => {
			event.sender.send('reply_to_donationUpdate', row)
		})
	})
})


//Get Top date from Interview
ipcMain.on('get_top_interview_date', (event, arg) => {
	let sql = `SELECT interviewDate FROM interview WHERE caseId = ? ORDER BY id DESC LIMIT 1`
	DJF_database.all(sql, [arg], (err, rows) => {
		if (err) {
			throw err
		}
		rows.forEach((row) => {
			event.sender.send('reply_top_interview_date', row)
		})
	})
})



//Select All Data from Interview
ipcMain.on('get_data_on_interviewUpdate', (event, arg)=>{
	let sql = `SELECT * FROM interview WHERE caseId = ?`
	DJF_database.all(sql, [arg], (err, rows) => {
		if (err) {
			throw err
		}
		rows.forEach((row) => {
			event.sender.send('reply_to_interviewUpdate', row)
		})
	})
})



//Select Data From a condition Table
ipcMain.on('get_data_for_condition', (event, arg) => {
    console.log(arg)
    let conditionInfo = {}
    DJF_database.get("SELECT * FROM conditionUpdate WHERE id = ?",
	[arg], (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				conditionInfo.dater = row.dater
                conditionInfo.condition = row.condition
                }
				console.log(conditionInfo)
			 event.sender.send('reply_data_for_condition', conditionInfo)
            })
			
		})
		

//Select Data From a donation Table
ipcMain.on('get_data_for_donation', (event, arg) => {
    console.log(arg)
    let donationInfo = {}
    DJF_database.get("SELECT * FROM support WHERE id = ?",
	[arg], (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				donationInfo.dater = row.dateOfSupport
                donationInfo.items = row.support
				donationInfo.amountDonated = row.amountDonated
				donationInfo.purposeOfSupport = row.purposeOfSupport
                }
				console.log(donationInfo)
			 event.sender.send('reply_data_for_donation', donationInfo)
            })
		})

//Select All Data from Image


//Edit Data In database
ipcMain.handle('submit_edit', async (event, Argument) => {
	let data = [Argument.callerName, Argument.callerContact, Argument.clientName, Argument.clientContact, Argument.Location, Argument.occupation, Argument.Age, Argument.sex, Argument.maritalStatus, Argument.Condition, Argument.purposeOfContact, Argument.conditionSeverity, Argument.languageSpoken, Argument.Religion, Argument.medicalHistory, Argument.hearingMedium, Argument.clientId]
	console.log(Argument)
	let sql = `UPDATE djf_client SET nameOfCaller = ?, callerContact = ?, nameOfPatient = ?, patientContact = ?, location = ?, occupation = ?, age = ?, sex = ?, maritalStatus = ?, nameOfCondition = ?, purposeOfContact = ?, conditionSeverity = ?, languageSpoken = ?, religion = ?, medicalHistory = ?, hearingMedium = ? WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})

//Add Condition
ipcMain.handle('submit_add_Condition', async (event, Argument) => {
	console.log(Argument)
    //Insert into some argument fields
    DJF_database.run('INSERT INTO conditionUpdate(caseId, condition, dater) VALUES (?,?,?)',
        [Argument.caseId, Argument.condText, Argument.conDate],
        (err) => console.log(err))
})


//Edit Condition Update
ipcMain.handle('submit_update_Condition', async (event, Argument) => {
	let data = [Argument.conditionText, Argument.dater, Argument.id]
	console.log(data)
	let sql = `UPDATE conditionUpdate SET condition = ?, dater = ? WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Edit Donate Update
ipcMain.handle('submit_update_Donation', async (event, Argument) => {
	let data = [Argument.donateItem, Argument.donatePurpose, Argument.donateAmt, Argument.donateDate, Argument.id]
	console.log(data)
	let sql = `UPDATE support SET support = ?, purposeOfSupport = ?, amountDonated = ?, dateOfSupport = ? WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})

//Edit Interview Update
ipcMain.handle('update_Interview', async (event, Argument) => {
	let data = [Argument.InStatus, Argument.id]
	console.log(data)
	let sql = `UPDATE interview SET status = ? WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Delete Condition
ipcMain.handle('delete_Condition', async (event, Argument) => {
	let data = [Argument]
	console.log(data)
	let sql = `DELETE FROM conditionUpdate WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})

//Delete Donation
ipcMain.handle('delete_Donation', async (event, Argument) => {
	let data = [Argument]
	console.log(data)
	let sql = `DELETE FROM support WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Delete Interview
ipcMain.handle('delete_Interview', async (event, Argument) => {
	let data = [Argument]
	console.log(data)
	let sql = `DELETE FROM interview WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Delete Record
ipcMain.handle('delete_Record', async (event, Argument) => {
	let data = [Argument]
	console.log(data)
	let sql = `DELETE FROM djf_client WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
	})
	let sql2 = `DELETE FROM conditionUpdate WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql2, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
	})
	let sql3 = `DELETE FROM support WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql3, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
	})
	let sql4 = `DELETE FROM interview WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql4, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
	})
	let sql5 = `DELETE FROM interview WHERE caseId = ?`;
    //Insert into some argument fields
    DJF_database.run(sql5, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
	})
       
})



//Add Donation
ipcMain.handle('submit_add_Donation', async (event, Argument) => {
	console.log(Argument)
    //Insert into some argument fields
    DJF_database.run('INSERT INTO support(caseId, supportId, support, purposeOfSupport, amountDonated, dateOfSupport) VALUES (?,?,?,?,?,?)',
        [Argument.caseId, Argument.donationId, Argument.donationItems, Argument.donationPurpose, Argument.donationAmt, Argument.donationDate],
        (err) => console.log(err))
})

//Add Interview
ipcMain.handle('submit_add_Interview', async (event, Argument) => {
	console.log(Argument)
	//Insert into some argument fields
    DJF_database.run('INSERT INTO interview(caseId, interviewDate, description, status) VALUES (?,?,?,?)',
        [Argument.caseId, Argument.interviewDate, Argument.interviewDescription, Argument.interviewStatus],
        (err) => console.log(err))
})


//Get Case Images One
ipcMain.on('get_case_Img_One', (event, arg) => {
	let data = [arg.clientId, arg.type]
    console.log(arg)
    let caseImgInfo = {}
    DJF_database.get("SELECT * FROM additionalImages WHERE caseId = ? AND type = ?",
	data, (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				caseImgInfo.id = row.id
				caseImgInfo.caseId = row.caseId
                caseImgInfo.imagePro = row.images
				caseImgInfo.title = row.title
				caseImgInfo.type = row.type
				caseImgInfo.description = row.description
                }
				//console.log(caseImgInfo)
			 event.sender.send('reply_data_case_one', caseImgInfo)
            })
		})
		
//Get Case Images Two
ipcMain.on('get_case_Img_Two', (event, arg) => {
	let data = [arg.clientId, arg.type]
    console.log(arg)
    let caseImgInfo = {}
    DJF_database.get("SELECT * FROM additionalImages WHERE caseId = ? AND type = ?",
	data, (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				caseImgInfo.id = row.id
				caseImgInfo.caseId = row.caseId
                caseImgInfo.imagePro = row.images
				caseImgInfo.title = row.title
				caseImgInfo.type = row.type
				caseImgInfo.description = row.description
                }
				//console.log(caseImgInfo)
			 event.sender.send('reply_data_case_two', caseImgInfo)
            })
		})
		
//Select Individual Images
ipcMain.on('get_unique_case_Img', (event, arg) => {
    console.log(arg)
    let caseImgInfo = {}
    DJF_database.get("SELECT * FROM additionalImages WHERE id = ?",
	[arg], (err, row) => {
		if(err){
			return console.error(err.message)
			}
			if(row){
				caseImgInfo.caseId = row.caseId
                caseImgInfo.imagePro = row.images
				caseImgInfo.title = row.title
				caseImgInfo.type = row.type
				caseImgInfo.description = row.description
                }
				//console.log(caseImgInfo)
			 event.sender.send('reply_unique_case_Img', caseImgInfo)
            })
		})
		


//Add Images
ipcMain.handle('submit_caseImg_Info', async (event, Argument) => {
	//console.log(Argument)
	//let result = Argument
    const base64 = fs.readFileSync( Argument.imagePro, "base64")
    Argument.imagePro = Buffer.from(base64, "base64")
    //console.log(result)
	//Insert into some argument fields
    DJF_database.run('INSERT INTO additionalImages(caseId, images, title, type, description) VALUES (?,?,?,?,?)',
        [Argument.caseId, Argument.imagePro, Argument.imageTitle, Argument.imageType, Argument.imageDesc],
        (err) => console.log(err))
})


//Edit Images Update with image
ipcMain.handle('update_case_with_image', async (event, Argument) => {
	const base64 = fs.readFileSync( Argument.imagePro, "base64")
    Argument.imagePro = Buffer.from(base64, "base64")
	let data = [Argument.imagePro, Argument.title, Argument.desc, Argument.id]
	console.log(data)
	let sql = `UPDATE additionalImages SET images = ?, title = ?, description = ? WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Edit Images Update with image
ipcMain.handle('update_case_without_image', async (event, Argument) => {
	let data = [Argument.title, Argument.desc, Argument.id]
	console.log(data)
	let sql = `UPDATE additionalImages SET title = ?, description = ? WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
})


//Delete Interview
ipcMain.handle('delete_Images', async (event, Argument) => {
	let data = [Argument]
	console.log(data)
	let sql = `DELETE FROM additionalImages WHERE id = ?`;
    //Insert into some argument fields
    DJF_database.run(sql, data, (err)=>{
		if(err){
			return console.error(err.message)
		}
		console.log("Successful")
	})
        //(err) => console.log(err))
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
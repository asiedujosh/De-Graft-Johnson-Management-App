const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
let clientId = localStorage.getItem("caseId")

//Window close Minimize and Maximize function
const minimize_button = document.getElementById("minimize_button")
const maximize_button = document.getElementById("maximize_button")
const close_button = document.getElementById("close_button")

minimize_button.addEventListener("click",()=>{
	remote.getCurrentWindow().minimize()
})

maximize_button.addEventListener("click",()=>{
	const currentWindow = remote.getCurrentWindow()
	if(currentWindow.isMaximized()){
		currentWindow.unmaximize()
	} else {
		currentWindow.maximize()
	}
})

close_button.addEventListener("click",()=>{
	remote.app.quit()
})



let frame = document.getElementById("picContainer")
let caseId = document.getElementById("caseId")
let nameOfPatient = document.getElementById("nameOfPatient")
let patientContact = document.getElementById("patientContact")
let nameOfCaller = document.getElementById("nameOfCaller")
let callerContact = document.getElementById("callerContact")
let clientLocation = document.getElementById("clientLocation")
let occupation = document.getElementById("occupation")
let language = document.getElementById("language")
let religion = document.getElementById("religion")
let nameTitle = document.getElementById("nameTitle")
let condition = document.getElementById("condition")
let purposeOfDon = document.getElementById("purposeOfDon")
let nameRecord = document.getElementById("nameRecord")
let amtDonated = document.getElementById("amtDonated")
let prof_title_img = document.getElementById("prof_title_img")

//Printing to statement
let statement_id = document.getElementById("statement_id")
let statement_patientName = document.getElementById("statement_patientName")
let statement_patientCon = document.getElementById("statement_patientCon")
let statement_age = document.getElementById("statement_age")
let statement_sex = document.getElementById("statement_sex")
let statement_location = document.getElementById("statement_location")
let statement_occupation = document.getElementById("statement_occupation")
let statement_callerName = document.getElementById("statement_callerName")
let statement_callerContact = document.getElementById("statement_callerContact")
let statement_maritalStatus = document.getElementById("statement_maritalStatus")
let statement_language = document.getElementById("statement_language")
let statement_religion = document.getElementById("statement_religion")
let statement_conditionSeverity = document.getElementById("statement_conditionSeverity")
let statement_caseStatus = document.getElementById("statement_caseStatus")
let statement_condition = document.getElementById("statement_condition")
let statement_purpose = document.getElementById("statement_purpose")
let statement_medicalHistory = document.getElementById("statement_medicalHistory")
let statementInterviewRecord = document.getElementById("statementInterviewRecord")
let statementDonationRecord = document.getElementById("statementDonationRecord")
let amtDonationTotal = document.getElementById("amtDonationTotal")
let statementConditionRecord = document.getElementById("statementConditionRecord")
let statementImageCase = document.getElementById("statementImageCase")
let statementReceiptCase = document.getElementById("statementReceiptCase")


let mainInterview = document.getElementById("mainInterview")
	ipcRenderer.send('get_top_interview_date', clientId)
	ipcRenderer.on('reply_top_interview_date', (event, arg) => {
		let convertDate = arg.interviewDate
		let interviewDate = convertDate.split("-")
		//console.log(interviewDate)
		let mainDate = new Date(interviewDate[0], interviewDate[1], interviewDate[2]);
		//console.log(mainDate)
		let g = mainDate.toString()
		//let secondPhase = mainDate.split(" ")
		//let secondDate = secondPhase[0]+" "+secondPhase[1]+" "+secondPhase[2]
		let v = g.split(" ")
		let currentDate = v[0]+" "+v[1]+", "+v[2]+" "+v[3]
		mainInterview.innerHTML = currentDate
		})



ipcRenderer.send('get_data_on_client', clientId)
ipcRenderer.on('reply_info', (event, arg) => {
		let buf = new Buffer(arg.patientPic)
		let image = buf.toString('base64')
        //console.log(image)
		prof_title_img.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
		caseId.innerHTML += `${clientId}`
		nameOfPatient.innerHTML = `${arg.nameOfPatient}`
		patientContact.innerHTML = `${arg.patientContact}`
		nameOfCaller.innerHTML = `${arg.nameOfCaller}`
		callerContact.innerHTML = `${arg.callerContact}`
		clientLocation.innerHTML = `${arg.location}`
		occupation.innerHTML = `${arg.occupation}`
		language.innerHTML = `${arg.language}`
		religion.innerHTML = `${arg.religion}`
		nameTitle.innerHTML = `${arg.nameOfPatient}`
		condition.innerHTML = `${arg.nameOfCondition}`
		purposeOfDon.innerHTML = `${arg.purposeOfContact}`
		amtDonated.innerHTML += `${arg.amountDonated}`
		amtDonationTotal.innerHTML += `${arg.amountDonated}`
		
		
		//Adding To Statement Personal Information
		statement_id.innerHTML += ` ${clientId}`
		statement_patientName.innerHTML += ` ${arg.nameOfPatient}`
		statement_patientCon.innerHTML += ` ${arg.patientContact}`
		statement_age.innerHTML += ` ${arg.age}`
		statement_sex.innerHTML += ` ${arg.sex}`
		statement_location.innerHTML += ` ${arg.location}`
		statement_occupation.innerHTML += ` ${arg.occupation}`
		statement_callerName.innerHTML += ` ${arg.nameOfCaller}`
		statement_callerContact.innerHTML += ` ${arg.callerContact}`
		statement_maritalStatus.innerHTML += ` ${arg.maritalStatus}`
		statement_language.innerHTML += ` ${arg.language}`
		statement_religion.innerHTML += ` ${arg.religion}`
		statement_conditionSeverity.innerHTML += ` ${arg.conditionSeverity}`
		statement_caseStatus.innerHTML += ` ${arg.caseStatus}`
		statement_condition.innerHTML += `${arg.nameOfCondition}`
		statement_purpose.innerHTML += `${arg.purposeOfContact}`
		statement_medicalHistory.innerHTML += `${arg.medicalHistory}`
    })

// Load Interview Info
ipcRenderer.send('get_data_on_interviewUpdate', clientId)
ipcRenderer.on('reply_to_interviewUpdate', (event, arg) => {
	statementInterviewRecord.innerHTML += `<tr>
		<td style = "text-align: center;">${arg.id}</td>
		<td style = "text-align: center;">${arg.interviewDate}</td>
		<td style = "text-align: center;">${arg.description}</td>
		<td style = "text-align: center;">${arg.status}</td>
		</tr>`
	})
	

//Loading donation Info
ipcRenderer.send('get_data_on_donationUpdate', clientId)
ipcRenderer.on('reply_to_donationUpdate', (event, arg) => {
	statementDonationRecord.innerHTML += `<tr>
		<td style = "text-align: center;">${arg.dateOfSupport}</td>
		<td style = "text-align: center;">${arg.purposeOfSupport}</td>
		<td style = "text-align: center;">${arg.support}</td>
		<td style = "text-align: center;">${arg.amountDonated}</td>
		</tr>`
	})
	
//Loading Sum of Donation
//Render Records 
ipcRenderer.send('get_data_on_condition', clientId)
ipcRenderer.on('reply_to_conditionUpdate', (event, arg) => {
	statementConditionRecord.innerHTML += `<tr>
		<td style = "text-align: center;">${arg.id}</td>
		<td style = "text-align: center;">${arg.dater}</td>
		<td style = "text-align: center;">${arg.condition}</td>
		</tr>`
	})
	
	
//Rendering Images Of Case 
let imageInfo = {
	clientId : clientId,
	type: "images"
}
ipcRenderer.send('get_case_Img_One', imageInfo)
ipcRenderer.on('reply_data_case_one', (event, arg) => {
	console.log(imageInfo)
	if(arg.title){
		let buf = new Buffer(arg.imagePro)
		let image = buf.toString('base64')
	 statementImageCase.innerHTML += `
		<div class = "col-md-4">
			<div class = "card" style = "overflow: hidden;">
			<span>
			<img src = "data:image/png;base64,${image}" alt = "profile picture" style = "height: 250px; width: 250px;"/>
			</span>
			<span>${arg.title}</span>
			<span>${arg.description}</span>
			</div>
		</div>`
	} else {
		console.log("No Arg")
	}
	/*
	if(arg){
	
	} else {
		loadCaseImage.innerHTML += `
		<div> No Data </div>
		`
	} */
	})


//Rendering Receipt Of Case 
imageInfo.type = "receipt"
ipcRenderer.send('get_case_Img_Two', imageInfo)
ipcRenderer.on('reply_data_case_two', (event, arg) => {
	console.log(imageInfo)
	if(arg.title){
		let buf = new Buffer(arg.imagePro)
		let image = buf.toString('base64')
	statementReceiptCase.innerHTML += `
		<div class = "col-md-4">
			<div class = "card" style = "overflow: hidden;">
			<span>
			<img src = "data:image/png;base64,${image}" alt = "profile picture" style = "height: 250px; width: 250px;"/>
			</span>
			<span>${arg.title}</span>
			<span>${arg.description}</span>
			</div>
		</div>`
	} else {
	loadReceiptImage.innerHTML += `<div> No Data </div>`
	}
	})




//For personal detail page
let firstButton = document.getElementById("printReceiptBtn")


document.getElementById("receipt").style.display = "block"
//Opencity function




//For personal detail page
let receiptBtn = document.getElementById("receiptBtn")
let statementBtn = document.getElementById("statementBtn")

document.getElementById("receipt").style.display = "block"
//Opencity function
function displayTabBlock(tabName){
	let i
	let tabcontent
	
	tabcontent = document.getElementsByClassName("tabcontent")
	console.log(tabcontent)

	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none"
	}
	
	document.getElementById(tabName).style.display = "block"
}


receiptBtn.addEventListener("click",()=>{
	displayTabBlock("receipt")
})

statementBtn.addEventListener("click",()=>{
	displayTabBlock("statement")
})

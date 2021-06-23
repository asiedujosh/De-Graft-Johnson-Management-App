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
let amtDonated = document.getElementById("amtDonated")
let nameRecord = document.getElementById("nameRecord")
let submitDonationBtn = document.getElementById("submitDonationBtn")
let loadingDonationRecord = document.getElementById("loadingDonationRecord")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")


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


//Adding Donation
let donationDate = document.getElementById("donationDate")
let donationPurpose = document.getElementById("donationPurpose")
let donationItems = document.getElementById("donationItems")
let donationAmt = document.getElementById("donationAmt")

//Loading donation records
ipcRenderer.send('get_data_on_donationUpdate', clientId)
ipcRenderer.on('reply_to_donationUpdate', (event, arg) => {
	loadingDonationRecord.innerHTML += `<tr>
		<td style = "padding-left: 3%;">${arg.id}</td>
		<td style = "padding-left: 3%;">${arg.dateOfSupport}</td>
		<td style = "padding-left: 3%;">${arg.purposeOfSupport}</td>
		<td style = "padding-left: 3%;">${arg.support}</td>
		<td style = "padding-left: 3%;">${arg.amountDonated}</td>
		</tr>`
	})



ipcRenderer.send('get_data_on_client', clientId)
ipcRenderer.on('reply_info', (event, arg) => {
		let buf = new Buffer(arg.patientPic)
		let image = buf.toString('base64')
        //console.log(image)
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
    })


let Validation_errors = []
//Validation
let validation = () => {
	if(!donationDate.value) return Validation_errors.push("No Date Available")
	if(!donationPurpose.value) return Validation_errors.push("Purpose Of Donation Not Available")
	if(!donationItems.value) return Validation_errors.push("If No items Please Indicate")
	if(!donationAmt.value) return Validation_errors.push("No Amount Indicated")
	if(isNaN(donationAmt.value)) return Validation_errors.push("Amount Cannot Be A Text")
	}

let clearInfo = () => {
	donationDate.value = ""
	donationPurpose.value = ""
	donationItems.value = ""
	donationAmt.value = ""
}

//Add Donation
let addDonation = () => {
	
	validation()
//console.log(Validation_errors)	

	if(Validation_errors.length){
		console.log(Validation_errors)
		styleErrorCard.style.display = "block"
		logoutErrors.innerHTML += Validation_errors.map((val)=>{
			return(
				`<ul style = "display: block; width: 100%; text-align: center;">
				<li style = "display: block; width: 100%;">${val}</li>
				</ul>`
				)
			})
		} else {
	//create Random donation Id
	let donationInfo = {
		caseId : clientId,
		donationId : "Don_122",
		donationDate : donationDate.value,
		donationPurpose : donationPurpose.value,
		donationItems : donationItems.value,
		donationAmt : donationAmt.value
	}

//Function to add Condition to database
ipcRenderer.invoke('submit_add_Donation', donationInfo)
	.then((result) => {
        console.log("Sent Message")
		profileInsert.style.display = "block"
    }) 
	}
}


ok.addEventListener("click",()=>{
		profileInsert.style.display = "none"
		clearInfo()
	})

ok3.addEventListener("click",()=>{
		styleErrorCard.style.display = "none" 
		logoutErrors.innerHTML = ""
		Validation_errors = []
		clearInfo()
	})

//Click event that calls adding addition
submitDonationBtn.addEventListener("click",()=>{
	addDonation()
})

//For personal detail page
let firstButton = document.getElementById("printDonationBtn")
let secondButton = document.getElementById("addDonationBtn")

document.getElementById("donationTable").style.display = "block"
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


firstButton.addEventListener("click",()=>{
	displayTabBlock("donationTable")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("AddDonation")
})




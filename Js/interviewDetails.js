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
let amtDonated = document.getElementById("amtDonated")
let purposeOfDon = document.getElementById("purposeOfDon")
let nameRecord = document.getElementById("nameRecord")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")

//Rendering to table
let loadingInterviewRecord = document.getElementById("loadingInterviewRecord")
let interviewEdit = document.getElementById("interviewEdit")


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



//Adding Interview
let interviewDate = document.getElementById("interviewDate")
let interviewDescription = document.getElementById("interviewDescription")
let submitInterviewBtn = document.getElementById("submitInterviewBtn")


//Render Records 
ipcRenderer.send('get_data_on_interviewUpdate', clientId)
ipcRenderer.on('reply_to_interviewUpdate', (event, arg) => {
	loadingInterviewRecord.innerHTML += `<tr>
		<td style = "text-align: center;">${arg.id}</td>
		<td style = "text-align: center;">${arg.interviewDate}</td>
		<td style = "text-align: center;">${arg.description}</td>
		<td style = "text-align: center;">${arg.status}</td>
		</tr>`
		
	interviewEdit.innerHTML += `<tr>
		 <td style = "text-align: center;">${arg.id}</td>
		<td style = "text-align: center;">${arg.interviewDate}</td>
		<td style = "text-align: center;">${arg.description}</td>
		<td style = "text-align: center;">
		<div class = ${arg.status == "pending" ? "redstat" : "greenstat"}></div>
		${arg.status}
		</td>
		<td>
		<span class = "btn btn-warning" style = "width: 100%;" onclick="location.href = 'editInterview.html?caseId=${arg.id}'">Achieved</span> 
		<span class = "btn btn-danger" style = "width: 100%;" onclick="location.href = 'deleteInterview.html?caseId=${arg.id}'">Delete</span> 
		</td>
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
	if(!interviewDate.value) return Validation_errors.push("No Date Available")
	if(!interviewDescription.value) return Validation_errors.push("Interview Description Not Available")
	}

let clearInfo = () => {
	interviewDate.value = ""
	interviewDescription.value = ""
}

	
//Add Interview
let addInterview = () => {
	//create Random donation Id
	
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
let interviewInfo = {
	caseId : clientId,
	interviewDate : interviewDate.value,
	interviewDescription : interviewDescription.value,
	interviewStatus : "pending",
}
console.log(interviewInfo)
//Function to add Condition to database
ipcRenderer.invoke('submit_add_Interview', interviewInfo)
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
submitInterviewBtn.addEventListener("click",()=>{
	addInterview()
})
	
	
	
	
	
//For personal detail page
let firstButton = document.getElementById("printInterviewBtn")
let secondButton = document.getElementById("editInterviewBtn")
let thirdButton = document.getElementById("addInterviewBtn")

document.getElementById("InterviewTable").style.display = "block"
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
	displayTabBlock("InterviewTable")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("editInterview")
})

thirdButton.addEventListener("click",()=>{
	displayTabBlock("addInterview")
})

/*
function openCity(evt, cityName){
	let i
	let tabcontent
	
	tabcontent = document.getElementsByClassName("tabcontent")
	console.log(tabcontent)
	/*
	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none"
	}
}
*/
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
let submitConditionBtn = document.getElementById("submitConditionBtn")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")

//Rendering to table
let loadingConditionRecord = document.getElementById("loadingConditionRecord")



//Populating condition table
//Render Records 
ipcRenderer.send('get_data_on_condition', clientId)
ipcRenderer.on('reply_to_conditionUpdate', (event, arg) => {
	loadingConditionRecord.innerHTML += `<tr>
		<td style = "text-align: center;">${arg.id}</td>
		<td style = "text-align: center;">${arg.dater}</td>
		<td style = "text-align: center;">${arg.condition}</td>
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


let clearInfo = () =>{
	document.getElementById("conditionDate").value = ""
	document.getElementById("conditionText").value = ""
}



let Validation_errors = []
//Validation
let validation = () => {
	if(!conditionDate.value) return Validation_errors.push("No Date Available")
	if(!conditionText.value) return Validation_errors.push("Condition Not Available")
	}

//Add Condition
let addCondition = () => {
//Adding Conditions
let conditionDate = document.getElementById("conditionDate")
let conditionText = document.getElementById("conditionText")

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
let conditionInfo = {
	caseId : clientId,
	conDate : conditionDate.value,
	condText : conditionText.value
}
console.log(conditionInfo)
//Function to add Condition to database
ipcRenderer.invoke('submit_add_Condition', conditionInfo)
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
submitConditionBtn.addEventListener("click",()=>{
	addCondition()
})

//For personal detail page
let firstButton = document.getElementById("printConditionBtn")
let secondButton = document.getElementById("addConditionBtn")

document.getElementById("conditionTable").style.display = "block"
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
	displayTabBlock("conditionTable")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("AddCondition")
})


const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
let clientId = localStorage.getItem("caseId")

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('Id')
    console.log(urlGet)
let Id = urlGet;


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
let getImageToPrint2 = document.getElementById("getImageToPrint2")
let imageExpandTitle = document.getElementById("imageExpandTitle")
let imageExpandDesc = document.getElementById("imageExpandDesc")

//Get Data to display Profile Details
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



ipcRenderer.send('get_unique_case_Img', Id)
ipcRenderer.on('reply_unique_case_Img', (event, arg) => {
		let buf = new Buffer(arg.imagePro)
		let image = buf.toString('base64')
	getImageToPrint2.innerHTML += `
			<img src = "data:image/png;base64,${image}" alt = "profile picture" style = "width: 70%;"/>
			`
	imageExpandTitle.innerHTML = `${arg.title}`
	imageExpandDesc.innerHTML = `${arg.description}`
	})
	

//For personal detail page
let firstButton = document.getElementById("caseImageBtn")
let secondButton = document.getElementById("receiptImageBtn")
let thirdButton = document.getElementById("addImageBtn")

document.getElementById("caseImages").style.display = "block"
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
	displayTabBlock("caseImages")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("receiptImages")
})

thirdButton.addEventListener("click",()=>{
	displayTabBlock("addImagesView")
})

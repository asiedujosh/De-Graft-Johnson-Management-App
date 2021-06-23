const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
let clientId = localStorage.getItem("caseId")

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
let loadCaseImage = document.getElementById("loadCaseImage")
let loadReceiptImage = document.getElementById("loadReceiptImage")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")


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
	loadCaseImage.innerHTML += `
		<div class = "col-md-4">
			<div class = "card" style = "overflow: hidden;">
			<span onclick="location.href = 'expandImage.html?Id=${arg.id}'">
			<img src = "data:image/png;base64,${image}" alt = "profile picture" style = "height: 250px; width: 250px;"/>
			</span>
			<span>${arg.title}</span>
			<span>${arg.description}</span>
			<span class = "btn btn-warning" style = "display: block;" 
			onclick="location.href = 'editImage.html?Id=${arg.id}'">
				Edit
			</span>
			<span class = "btn btn-danger" style = "display: block; margin-top: 1%;"
			onclick="location.href = 'deleteImages.html?Id=${arg.id}'">
				Delete
			</span>
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
	loadReceiptImage.innerHTML += `
		<div class = "col-md-4">
			<div class = "card" style = "overflow: hidden;">
			<span onclick="location.href = 'expandImage.html?Id=${arg.id}'">
			<img src = "data:image/png;base64,${image}" alt = "profile picture" style = "height: 250px; width: 250px;"/>
			</span>
			<span>${arg.title}</span>
			<span>${arg.description}</span>
			<span class = "btn btn-warning" style = "display: inline-block"
			onclick="location.href = 'editImage.html?Id=${arg.id}'">
				Edit
			</span>
			<span class = "btn btn-danger" style = "display: inline-block"
			onclick="location.href = 'deleteImages.html?Id=${arg.id}'">
				Delete
			</span>
			</div>
		</div>`
	} else {
	loadReceiptImage.innerHTML += `<div> No Data </div>`
	}
	})




//Get Image Data and insert
let getImage = document.getElementById("getImage")
let imgType = document.getElementById("imgType")
let imageTitle = document.getElementById("imageTitle")
let imageDesc = document.getElementById("imageDesc")
let submitImagesBtn = document.getElementById("submitImagesBtn")


let ImageInfoGathered = {}

let gatherImageInfo = () => {
    ImageInfoGathered.caseId = clientId
    ImageInfoGathered.imagePro = getImage.files[0].path
    ImageInfoGathered.imageType = imgType.value
    ImageInfoGathered.imageTitle = imageTitle.value
    ImageInfoGathered.imageDesc = imageDesc.value
	console.log(ImageInfoGathered)
	ipcRenderer.invoke('submit_caseImg_Info', ImageInfoGathered)
	.then((result) => {
        console.log("Sent Message")
		})
	}


let clearInfo = () =>{
	imageTitle.value = ""
	imageDesc.value = ""
}

let Validation_errors = []
//Validation
let validation = () => {
	if(!imageTitle.value) return Validation_errors.push("No Image Title")
	if(!imageDesc.value) return Validation_errors.push("No Image Description")
	}

submitImagesBtn.addEventListener("click", ()=>{
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
		gatherImageInfo()
		profileInsert.style.display = "block"
		}
})

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

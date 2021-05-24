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
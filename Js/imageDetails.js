//For personal detail page
let firstButton = document.getElementById("caseImageBtn")
let secondButton = document.getElementById("receiptImageBtn")

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
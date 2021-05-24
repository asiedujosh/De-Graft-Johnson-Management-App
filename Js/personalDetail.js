//For personal detail page
let firstButton = document.getElementById("printProfileBtn")
let secondButton = document.getElementById("editProfileBtn")
let thirdButton = document.getElementById("closeBtn")


console.log(sessionStorage.getItem("profileInfo"))


document.getElementById("printProfile").style.display = "block"
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
	displayTabBlock("printProfile")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("editProfile")
})

thirdButton.addEventListener("click",()=>{
	displayTabBlock("closeCase")
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
let firstButton = document.getElementById("londonButton")
let secondButton = document.getElementById("parisButton")

document.getElementById("London").style.display = "block"
//Opencity function
function openCity(cityName){
	let i
	let tabcontent
	
	tabcontent = document.getElementsByClassName("tabcontent")
	console.log(tabcontent)

	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none"
	}
	
	document.getElementById(cityName).style.display = "block"
}


firstButton.addEventListener("click",()=>{
	openCity("London")
})

secondButton.addEventListener("click",()=>{
	openCity("Paris")
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
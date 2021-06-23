const {MSICreator} = require('electron-wix-msi')
const path = require('path')

const APP_DIR = path.resolve(__dirname, './DJF_CMP-win32-x64')
const OUT_DIR = path.resolve(__dirname, './windows_installer')

const msiCreator = new MSICreator({
	appDirectory: APP_DIR,
	outputDirectory:OUT_DIR,
	
	//configure metadata
	description: 'De-Graft Johnson Foundation Case Management Portal',
	exe: 'DJF_CMP',
	name: 'DJF Case Management Portal',
	manufacturer: 'Joshua Asiedu',
	version: '1.0.0',
	appIconPath: './icon/logo.ico',
	background: './icon/background.png',
	banner: './icon/banner.png',
	ui: {
		chooseDirectory: true
	},
})

msiCreator.create().then(function(){
	msiCreator.compile()
})
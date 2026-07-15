let modInfo = {
	name: "Operation Insanity",
	id: "test1",
	author: "Azon",
	pointsName: "operations",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "The Testing Branch",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.1</h3><br>
		- Started development <br>
	<br><br><h3>v0.2</h3><br>
		- Added achievements <br>
		- Added the log book`
	

let winText = ` You shouldn't be here yet. `

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (hasUpgrade('t', 11)) gain = gain.add(0.1) // additive
	if (hasUpgrade('t', 31)) gain = gain.add(0.1) // additive
	if (hasUpgrade('t', 12)) gain = gain.mul(2)
	if (hasUpgrade('t', 13)) gain = gain = gain.times(upgradeEffect('t', 13))
	if (hasUpgrade('t', 21)) gain = gain = gain.times(upgradeEffect('t', 21))
	if (hasUpgrade('t', 22)) gain = gain.mul(1.5)

	return gain
	
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
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

	showTicker: true,
    tickerSpeed: 500, // Time in seconds for one scroll loop
    tickerMessages: shuffleArray([
		"Local city council meeting adjourned early due to a malfunctioning thermostat.",
		"Global wheat exports reach a five-year high; bread prices expected to remain stable.",
		"New study suggests that drinking three cups of tea a day may improve general focus.",
		"International space station crew successfully replaces a faulty external light bulb.",
		"Tech giant announces new smartphone with a slightly more rounded corner; critics underwhelmed.",
		"World's oldest tortoise celebrates 191st birthday in a remote island sanctuary.",
		"Archaeologists in Egypt find another set of jars; 'They are definitely just more jars,' says lead researcher.",
		"Stock market remains mostly flat as investors wait for a reason to buy or sell.",
		"Popular streaming service announces plans to crack down on password sharing next fiscal quarter.",
		"Meteorological department warns of a distinctly average rainy season for the tri-state area.",
		"Professional athlete signs a record-breaking contract; fans debate if he is actually worth the money.",
		"Rare bird species spotted in a local backyard for the first time in over thirty years.",
		"Film critics call the latest summer blockbuster 'visually stunning but emotionally hollow.'",
		"Scientists successfully teach a parrot to recognize basic geometric shapes with 60% accuracy.",
		"Local library reports a 2% increase in book checkouts; 'It is a modest victory,'' says head librarian.",
		"Astronomers discover a new exoplanet that almost certainly cannot support life of any kind.",
		"Study finds that 100% of people who drink water eventually develop an opinion on its temperature.",
		"Global coffee reserves reach 'adequate' levels; productivity expected to stay exactly where it is.",
		"Regional highway construction finished three days early; commuters report feeling 'mildly surprised.'",
		"Small town wins world record for the largest collection of vintage ceramic thimbles.",
	])
}


// Set your version in num and name
let VERSION = {
	num: "0.4",
	name: "The Testing Branch",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.1</h3><br>
		- Started development
	<br><br><h3>v0.2</h3><br>
		- Added achievements <br>
		- Added the log book
		<br><br><h3>v0.3</h3><br>
		- Finished row 0 <br>
			- upgrades<br>
			- achievements
		<br><br><h3>v0.4</h3><br>
		- Added the news
		`
	

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
	 row0Modifier = new Decimal(1)
	if (hasAchievement('a', 21)) {
		row0Modifier = new Decimal(1.1)
	}
	if (hasUpgrade('t', 11)) gain = gain.add(0.1).mul(row0Modifier) // additive
	
	if (hasUpgrade('t', 31)) gain = gain.add(0.1).mul(row0Modifier) // additive
	if (hasUpgrade('t', 12)) gain = gain.mul(2).mul(row0Modifier)
	if (hasUpgrade('t', 13)) gain = gain.mul(upgradeEffect('t', 13)).mul(row0Modifier)
	if (hasUpgrade('t', 21)) gain = gain.mul(upgradeEffect('t', 21)).mul(row0Modifier)
	if (hasUpgrade('t', 22)) gain = gain.mul(1.5).mul(row0Modifier)
	if (hasUpgrade('t', 32)) gain = gain.mul(upgradeEffect('t', 32)).mul(row0Modifier)
	if (hasUpgrade('t', 42)) gain = gain.mul(upgradeEffect('t', 42)).mul(row0Modifier)

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

//randomizes arrays
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}


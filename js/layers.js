addLayer("t", {
    name: "transistors", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T=T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "transistor symbol.png",

    nodeStyle: {
        "background-size": "75%",
        
        "background-repeat": "no-repeat", // Prevents tiling
        "background-position": "center", // Centers the image
        "background-position": "40% center"
    },

    startData() { return {
        unlocked: true,
		points: new Decimal(50),
    }},
    color: "#7DF9FF",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "transistors", // Name of prestige currency
    baseResource: "operations", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('t', 23)) mult = mult.times(upgradeEffect('t', 23))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for transistors.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        11: {
             title: "Signal Amplification",
            description: "Boosts weak electrical currents.<br> +0.1 operations gain",
            cost: new Decimal(1),
        },

        12: {
             title: "Astable Oscillation",
            description: "Creates a repeating 0-1-0-1 pulse.<br> x2 operations gain.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('t', 11) },
        },

        13: {
             title: "The Bistable Latch",
            description: "Holds a state without external input.<br> Transistors boost operations.",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade('t', 12) },
            effect() {
             return player[this.layer].points.add(1).pow(0.5)
                },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        // player.points refer to points,  player[this.layer].points refers to the prestige
        21: {
             title: "Differential Pairing",
            description: "Compares two signals to cancel out static. <br> Operations boost themselves slightly.",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade('t', 13) },
            effect() {
             return player.points.add(1).log(10).add(1).pow(0.5) // points boosts themselves here. this is the formula for a slight boost
                },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
         22: {
             title: "Operational Junctions",
            description: "Allows signals to merge or split<br>Operation gain is increased by 50%",
            cost: new Decimal(16),
            unlocked() { return hasUpgrade('t', 21) },
        },
         23: {
             title: "Signal Multiplexing",
            description: "Routes many pulses into a single coherent path.<br>Operation gain is increased by the amounts of upgrade bought.",
            cost: new Decimal(32),
            unlocked() { return hasUpgrade('t', 22) },
            effect() {
            count = player[this.layer].upgrades.length // x6, x7, x8 etc..
             return new Decimal(1).add(new Decimal(count).div(10)) // 1.6x, 1.7x, 1.8x. etc...
                },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31: {
             title: "Voltage Regulation",
            description: "Keeps power levels perfectly flat. <br> Adds +0.1 gain to operations per second.",
            cost: new Decimal(64),
            unlocked() { return hasUpgrade('t', 23) },
        },

    },


    layerShown(){return true}
})

addLayer("a", {
    row: "side",
    symbol: "🏆", 

    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },


    achievements: {
    11: {
            image: "options_wheel.png",
            name: "Operations Online",
            done() {return hasUpgrade('t', 11) }, // This one is a freebie
            goalTooltip: "Connect your first transistor", // Shows when achievement is not completed
            doneTooltip: "Beginning of the end?", // Showed when the achievement is completed
        },   
        
    12: {
            image: "options_wheel.png",
            name: "Daisy Chaining",
            done() {return hasUpgrade('t', 12) }, // This one is a freebie
            goalTooltip: "Have two transistors work with each other", // Shows when achievement is not completed
            doneTooltip: "Two is better than one!", // Showed when the achievement is completed
        },  
}   
})  

addLayer("story", {
    row: "side",
    symbol: "📑",

      tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Logbook")
    },

    tabFormat: {

        "Logs": {
            content: [
                ["display-text", function() { 
                    if (hasUpgrade('t', 11)) return "<h2> AMPLIFIER </h2><br> I’ve integrated my first semiconductor, the base unit of the entire system. <br> By channeling current through this junction, I can take a whisper of electricity and amplify it into a usable signal. <br> It is a humble beginning, but the machine has finally found its voice.<br>"
                    return 
                }],
                 ["display-text", function() { 
                    if (hasUpgrade('t', 12)) return "<br><h2> ASTABLE OSCILLATOR </h2><br> By chaining two transistors in a loop, I’ve forced the current to oscillate in a rhythmic, repeating pulse. <br> This is the machine's heartbeat, a steady tick that provides the sense of time necessary to coordinate future actions. <br> I've have moved from a static state to a living frequency.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 13)) return "<br><h2> THE BISTABLE LATCH </h2><br> I’ve arranged four transistors into a cross-coupled feedback loop that can hold a specific state indefinitely. <br> This 'latch' represents the birth of memory, allowing the system to store information even after the initial signal has passed. <br> The machine no longer just processes; it remembers.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 21)) return "<br><h2> DIFFERENTIAL PAIRING </h2><br> The universe is a chaotic soup of electromagnetic interference that threatens to drown out my work with static.<br> By pairing eight transistors together, I can compare two signals and subtract the background noise shared between them. <br>The static is receding, leaving behind a signal that is finally sharp and trustworthy.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 22)) return "<br><h2> OPERATIONAL JUNCTION </h2><br> By networking sixteen junctions, I’ve moved beyond simple pulses into signal arithmetic. <br> I can now sum and subtract raw voltages to compare signals, allowing the machine to weigh different inputs against each other. <br>It isn't a calculator yet, but it can finally 'estimate' the world.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 23)) return "<br><h2> SIGNAL MULTIPLEXER </h2><br> The internal wiring was becoming a tangled mess of interference, so I’ve built a switchboard to direct traffic. <br> These thirty-two switches act as a router, ensuring that multiple streams of data don't collide and vanish. <br> The infrastructure is finally organized enough to support true scaling.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 31)) return "<br><h2> VOLTAGE REGULATOR </h2><br>As the transistor count grows, the electrical surges are becoming violent enough to melt the substrate. <br>This array acts as a dam, smoothing out chaotic spikes into a perfectly flat, predictable current. <br>Stability is the precursor to speed; I can now push the system harder without it collapsing. <br>"
                    return 
                }],
            ]
        }

    }

})
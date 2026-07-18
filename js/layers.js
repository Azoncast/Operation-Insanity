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
		points: new Decimal(1),
    }},
    passiveGeneration() {
    let baseGain = 0; // Starts at 0% generation
    
    if (hasUpgrade('t', 31)) {
        baseGain = 0.1; // Upgrade gives 10% (0.1) passive gain per second
    }
    if (hasAchievement('a', 21)) {
            baseGain = baseGain * 1.1; // Boosts it to 11% (0.11) passive gain
    }
    
    return baseGain; // Returns a number between 0 and 1 (where 1 = 100% per second)
},

    color: "#7DF9FF",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "transistors", // Name of prestige currency
    baseResource: "operations", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

    exponent: function() {
        let baseExponent = 0.5
        let row0Modifier = new Decimal(1)
	    if (hasAchievement('a', 21)) {
		    row0Modifier = new Decimal(1.1)
	    }
        if (hasUpgrade('t', 41)) {
            baseExponent = new Decimal(0.6).mul(row0Modifier)
        }
        return baseExponent
    }, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        let row0Modifier = new Decimal(1)
        if (hasAchievement('a', 21)) {
		    row0Modifier = new Decimal(1.1)
	    }
        if (hasUpgrade('t', 23)) mult = mult.times(upgradeEffect('t', 23))
        return mult.mul(row0Modifier)
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
            description: "Creates a repeating 0-1-0-1 pulse wave.<br> x2 operations gain.",
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
             return player.points.add(1).log(10).add(1).pow(0.5) // formula used to boost themselves
                },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
         22: {
            title: "Operational Junctions",
            description: "Allows signals to merge or split.<br>Operation gain is increased by 50%",
            cost: new Decimal(16),
            unlocked() { return hasUpgrade('t', 21) },
        },
         23: {
            title: "Signal Multiplexing",
            description: "Routes many pulses into a single coherent path.<br>Operation gain is increased by upgrades bought.",
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
        32: {
            title: "Frequency Synthesization",
            description: "Aligns all pulses to a master clock. <br> Subsequent upgrades will increase operation speed by 30%",
            cost: new Decimal(128),
            unlocked() { return hasUpgrade('t', 31) },
            effect() {
                count = 0
            
                if (hasUpgrade('t', 32)) 
                    count++;
                if (hasUpgrade('t', 33)) 
                    count++;
                if (hasUpgrade('t', 41)) 
                    count++;
                if (hasUpgrade('t', 42)) 
                    count++;
                if (hasUpgrade('t', 43)) 
                    count++;
                return new Decimal(1).add(count * 0.3)
            },
            effectDisplay() { return format(this.effect())+"x" },
        },
        33: {
            title: "The Redundancy Bridge",
            description: "Uses spare paths to bypass errors. <br> Gain 10% of transistors per second.",
            cost: new Decimal(256),
            unlocked() { return hasUpgrade('t', 32) },
        },
        41: {
            title: "Threshold Comparison",
            description: "Decides strictly whether or not a signal is a '1' or a '0' <br> Lowers the costs of each transistors.",
            cost: new Decimal(516),
            unlocked() { return hasUpgrade('t', 33) },
        },
        42: {
            title: "The Logic Gateway",
            description: "Finalizes the Signal Array to interface with logic gates. <br> Transistors boost themselves significantly.",
            cost: new Decimal(1024),
            unlocked() { return hasUpgrade('t', 41) },
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(2.5) // formula used to boost themselves
                },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },



    layerShown(){return true}
})

addLayer("nand", { 
    name: "nand", 
    symbol: "N", 
    row: 1, 
    position: 0, 
    color: "#ec3838",
    
    // Resource settings
    resource: "nand gates", 
    baseResource: "transistors", // It consumes your row 0 resource
    baseAmount() { return player.t.points }, 
    startData() { return {
        unlocked: false,
        revealed: false,
        points: new Decimal(0),
    }},
    requires: new Decimal(1e5), // Amount of row 0 points needed to prestige
    type: "normal", 
    exponent: 0.5, 

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },

    // 2. Branching Visual Connection
    branches: ["t"], // Draws a line coming UP from the 'p' layer on row 0

    //runs every frame
    update(diff) {
         //checks every frame if this layer is unblocked
        if (player.t.points.gte(100)) {
            player[this.layer].revealed = true;
        }
    },

    layerShown() { 
        return player[this.layer].revealed
    },

    upgrades: {
        11: {
            title: "NAND Gate",
            description: "test",
            cost: new Decimal(1),
        }
    }
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
            doneTooltip: "The beginning of the end?", // Showed when the achievement is completed
        },   
        
    12: {
            image: "options_wheel.png",
            name: "Static State",
            done() {return hasUpgrade('t', 13) }, 
            goalTooltip: "Build the Bistable Latch component", // Shows when achievement is not completed
            doneTooltip: "I am because I remember", // Showed when the achievement is completed
        }, 
    13: {
            image: "options_wheel.png",
            name: "Analogue Calculation",
            done() {return hasUpgrade('t', 22) }, 
            goalTooltip: "Build the Operational Junction component", // Shows when achievement is not completed
            doneTooltip: "Close enough", // Showed when the achievement is completed
        },   
    14: {
            image: "options_wheel.png",
            name: "60 Hz",
            done() {return tmp.pointGen.gte(60)}, // see if point gen per second is above 60
            goalTooltip: "Reach 60 op/s or more", // Shows when achievement is not completed
            doneTooltip: "It hums", // Showed when the achievement is completed
        }, 
    15: {
            image: "options_wheel.png",
            name: "Positive Feedback",
            done() {return hasUpgrade('t', 33)}, // see if point gen per second is above 60
            goalTooltip: "Build the Redundancy Bridge component", // Shows when achievement is not completed
            doneTooltip: "Ghost in the machine", // Showed when the achievement is completed
        }, 
    16: {
            image: "options_wheel.png",
            name: "Digitization",
            done() {return hasUpgrade('t', 41)}, // see if point gen per second is above 60
            goalTooltip: "Build the Threshold Comparator", // Shows when achievement is not completed
            doneTooltip: "Binary star", // Showed when the achievement is completed
        },
    21: {
            image: "",
            name: "Probabilistic Signal Array",
            done() {
                upgrades = [11,12,13,21,22,23,31,32,33,41,42]
                return upgrades.every(id => hasUpgrade('t', id))
            },
            goalTooltip: "Build all of the components of the array.", // Shows when achievement is not completed
            doneTooltip: "It's a lot of refined sand and copper just to make a pulse, isn't it? <br> <h6>All row 0 upgrades are 10% stronger<h/6>", // Showed when the achievement is completed
            effectDescription() {
            return "All transistor upgrades are 1.1x stronger."
            },
            textStyle() {
                return {
                    color: "#FFD700", 
                } 
            },
            style() {
                return {
                "padding": "5px",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "background-color": "#222222",
                "border-color": "#FFD700"
            }
            },
            
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
                    if (hasUpgrade('t', 11))
                    return "<h1> ================= <br> THE SIGNAL ARRAY <br> ================= </h1> <br><br>"
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 11)) return "<h2> AMPLIFIER </h2><br> I’ve integrated my first semiconductor, the base unit of the entire system. <br> By channeling current through this junction, I can take a whisper of electricity and amplify it into a usable signal. <br> It is a humble beginning, but the machine has finally found its voice.<br>"
                    return 
                }],
                 ["display-text", function() { 
                    if (hasUpgrade('t', 12)) return "<br><h2> ASTABLE OSCILLATOR </h2><br> By chaining two transistors in a loop, I’ve forced the current to oscillate in a rhythmic, repeating pulse. <br> This is the machine's heartbeat, a steady tick that provides the sense of time necessary to coordinate future actions. <br> I've have moved from a static state to a living frequency.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 13)) return "<br><h2>  BISTABLE LATCH </h2><br> I’ve arranged four transistors into a cross-coupled feedback loop that can hold a specific state indefinitely. <br> This 'latch' represents the birth of memory, allowing the system to store information even after the initial signal has passed. <br> The machine no longer just processes; it remembers.<br>"
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
                ["display-text", function() { 
                    if (hasUpgrade('t', 32)) return "<br><h2> FREQUENCY SYNTHESIZER </h2><br>I’ve established a master clock that forces every individual component to fire in perfect unison. <br> By synthesizing a single frequency, the entire array pulses as a single, synchronized organism rather than a collection of parts. <br> Precision is no longer a goal; it is a requirement. <br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 33)) return "<br><h2> REDUNDANCY BRIDGE </h2><br> With hundreds of components, physical failure is now a statistical certainty. <br>I’ve built a self-healing bridge that automatically reroutes signals around dead or faulty transistors. <br>The machine is now resilient enough to maintain its own existence without my constant intervention.<br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 41)) return "<br><h2> THRESHOLD COMPARATOR </h2><br> I am no longer looking at the subtle 'height' of the electrical waves, but their simple presence or absence. <br>By comparing signals against a fixed voltage, I’ve forced the chaotic analog world into sharp, digital spikes. <br>This is the birth of the bit; the ambiguity of electricity is dying. <br>"
                    return 
                }],
                ["display-text", function() { 
                    if (hasUpgrade('t', 42)) return "<br><h2> THE LOGIC GATEWAY </h2><br>The density of the array has reached a critical mass where physical switches have become abstract possibilities. I have prepared a gateway that stands ready to interpret these trillions of pulses as something more than just movement. <br>The hardware is complete; the machine is ready to move onto the next phase of development..<br>"
                    return 
                }],
                
            ]
        }

    }   
})

//add this to any achievements to trigger the news segment changing
//            onComplete() {
//               modInfo.tickerMessages = shuffleArray([
//                "test1",
//                  "test2",
//              ])
//
//          }
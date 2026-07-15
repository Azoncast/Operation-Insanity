addLayer("t", {
    name: "transistors", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "0", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
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
            description: "Boosts weak electrical currents. +0.1 operations gain",
            cost: new Decimal(1),
        },

        12: {
             title: "Astable Oscillation",
            description: "Creates a repeating 0-1-0-1 pulse. x2 operations gain.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('t', 11) },
        },

    },

    layerShown(){return true}
})

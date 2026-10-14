export const enemyTypes = {

    goblin: {
        name: 'Goblin',

        health: 30,
        speed: 60,
        damage: {
            min: 2,
            max: 4
        },
        lifes: 1,
        reward: 5,
        size: 12,
        color: 0xAF5F00,
        // blockable: false,
    },

    orc: {
        name: 'Orc',

        health: 80,
        speed: 45,
        damage: {
            min: 10,
            max: 14
        },
        lifes: 1,
        reward: 9,
        size: 18,
        color: 0xAF1F00
    },

    wolf: {
        name: 'Lobo',

        health: 20,
        speed: 90,
        damage: {
            min: 2,
            max: 5
        },
        lifes: 1,
        reward: 6,
        size: 10,
        color: 0xFFAF00
    },

    ogre: {
        name: 'Ogro',

        health: 200,
        speed: 33,
        damage: {
            min: 20,
            max: 40
        },
        lifes: 3,
        reward: 25,
        size: 25,
        color: 0xDF0000
    },

};
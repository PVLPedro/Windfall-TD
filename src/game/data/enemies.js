export const enemyTypes = {

    goblin: {
        name: 'Goblin',

        health: 30,
        speed: 60,

        meleeDamage: {
            min: 2,
            max: 4,
        },

        meleeCooldown: 1,

        lifes: 1,
        reward: 5,
        size: 12,
        color: 0xAF5F00,
        // blockable: false,
    },

    goblinArcher: {
        name: 'Goblin Arqueiro',

        health: 25,
        speed: 60,

        meleeDamage: {
            min: 1,
            max: 3,
        },

        meleeCooldown: 1.5,

        rangedDamage: {
            min: 4,
            max: 7,
        },

        rangedCooldown: 1.5,
        rangedRange: 100,
        projectileSpeed: 240,

        lifes: 1,
        reward: 8,
        size: 12,
        color: 0x55AA22,
    },

    orc: {
        name: 'Orc',

        health: 80,
        speed: 45,

        meleeDamage: {
            min: 10,
            max: 14,
        },

        meleeCooldown: 1,

        lifes: 1,
        reward: 9,
        size: 18,
        color: 0xAF1F00
    },

    wolf: {
        name: 'Lobo',

        health: 20,
        speed: 90,

        meleeDamage: {
            min: 1,
            max: 3,
        },

        meleeCooldown: 0.8,

        lifes: 1,
        reward: 6,
        size: 10,
        color: 0xFFAF00
    },

    ogre: {
        name: 'Ogro',

        health: 200,
        speed: 33,

        meleeDamage: {
            min: 20,
            max: 40,
        },

        meleeCooldown: 1.5,
        
        lifes: 3,
        reward: 25,
        size: 25,
        color: 0xDF0000
    },

};
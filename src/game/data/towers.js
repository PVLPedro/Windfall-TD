export const towerTypes = {

    archer: {
        name: 'Torre Arqueira',
        icon: 'nature',

        cost: 70,
        damage: {
            min: 400,
            max: 600,
        },
        range: 150,
        attackCooldown: 800,

        projectileType: 'basic',
        projectileSpeed: 500,

        size: 40,
        color: 0x39B54A
    },

    mage: {
        name: 'Torre Maga',
        icon: 'magic',

        cost: 100,
        damage: {
            min: 9,
            max: 17,
        },
        range: 150,
        attackCooldown: 1500,

        projectileType: 'basic',
        projectileSpeed: 400,

        size: 35,
        color: 0x0071BC
    },

    bomber: {
        name: 'Torre Bomba',
        icon: 'industrial',

        cost: 125,
        damage: {
            min: 8,
            max: 16,
            falloff: {
                minimum: 0.6,
            },
        },
        range: 180,
        attackCooldown: 3000,

        projectileType: 'bomb',
        projectileSpeed: 300,
        explosionRadius: 65,
        
        size: 50,
        color: 0xF7931E
    },

    alchemist: {
        name: 'Torre Alquimista',
        icon: 'alchemy',

        cost: 110,
        damage: {
            min: 10,
            max: 13,
            falloff: {
                minimum: 0.4,
            },
        },
        debuff: {
            type: 'slow',
            value: 50,
            duration: 1,
        },
        range: 130,
        attackCooldown: 1500,

        projectileType: 'bomb',
        projectileSpeed: 400,
        explosionRadius: 60,
        
        size: 50,
        color: 0xFFE52F
    },

    // resistence: {
    //     name: 'Torre Resistência',
    //     icon: 'resistence',

    //     cost: 110,
    //     damage: {
    //         min: 10,
    //         max: 13,
    //         falloff: {
    //             minimum: 0.4,
    //         },
    //     },
    //     debuff: {
    //         type: 'slow',
    //         value: 50,
    //         duration: 1,
    //     },
    //     range: 130,
    //     attackCooldown: 1500,

    //     projectileType: 'bomb',
    //     projectileSpeed: 400,
    //     explosionRadius: 60,
        
    //     size: 50,
    //     color: 0x662D91
    // },

    // mad: {
    //     name: 'Torre Fronteira',
    //     icon: 'mad',

    //     cost: 110,
    //     damage: {
    //         min: 10,
    //         max: 13,
    //         falloff: {
    //             minimum: 0.4,
    //         },
    //     },
    //     debuff: {
    //         type: 'slow',
    //         value: 50,
    //         duration: 1,
    //     },
    //     range: 130,
    //     attackCooldown: 1500,

    //     projectileType: 'bomb',
    //     projectileSpeed: 400,
    //     explosionRadius: 60,
        
    //     size: 50,
    //     color: 0xFF0000
    // }
};
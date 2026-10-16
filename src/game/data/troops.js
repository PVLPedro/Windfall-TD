export const troopTypes = {

    soldier: {
        id: 'soldier',
        name: 'Soldado',

        health: 60,
        speed: 180,

        meleeDamage: {
            min: 1,
            max: 3,
        },
        meleeCooldown: 1,
        interceptRange: 80,

        regeneration: 3,
        regenerationCooldown: 1,
        passiveRegeneration: false,
        
        canRespawn: true,
        respawnTime: 10,

        size: 12,
        color: 0x3399ff,
    },

    archer: {
        id: 'archer',
        name: 'Arqueiro',

        health: 35,
        speed: 180,

        meleeDamage: {
            min: 1,
            max: 3,
        },

        meleeCooldown: 1,
        interceptRange: 80,

        rangedDamage: {
            min: 6,
            max: 10,
        },

        rangedCooldown: 1.2,
        rangedRange: 110,
        projectileSpeed: 300,

        regeneration: 2,
        regenerationCooldown: 1,
        passiveRegeneration: false,

        canRespawn: true,
        respawnTime: 5,

        size: 10,
        color: 0x33ffff,
    },

    // archer: {
    //     name: 'Arqueiro',

    //     health: 40,
    //     moveSpeed: 150,
    //     damage: {
    //         min: 2,
    //         max: 4
    //     },

    //     attackRange: 110,
    //     attackCooldown: 1.2,

    //     interceptRange: 80,

    //     color: 0x33cc66
    // }
};

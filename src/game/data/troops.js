export const troopTypes = {

    militiaMember: {
        
        name: 'Miliciano',

        health: 40,
        speed: 18,

        meleeDamage: {
            min: 1,
            max: 3,
        },
        meleeCooldown: 1,
        interceptRange: 20,

        regeneration: 3,
        regenerationCooldown: 1,
        passiveRegeneration: false,
        
        canRespawn: true,
        respawnTime: 10,

        size: 12,
        color: 0x3399ff,
    },

    slinger: {

        name: 'Fundeiro',

        health: 35,
        speed: 18,

        meleeDamage: {
            min: 1,
            max: 2,
        },

        meleeCooldown: 1,
        interceptRange: 20,

        rangedDamage: {
            min: 6,
            max: 10,
        },

        rangedCooldown: 1.2,
        rangedRange: 28,
        projectileSpeed: 75,

        regeneration: 2,
        regenerationCooldown: 1,
        passiveRegeneration: false,

        canRespawn: true,
        respawnTime: 5,

        size: 10,
        color: 0x33ffff,
    },

    troublemaker: {

        name: 'Barraqueiro',

        health: 50,
        speed: 18,

        meleeDamage: {
            min: 4,
            max: 8,
        },

        meleeCooldown: 1,
        interceptRange: 20,

        regeneration: 2,
        regenerationCooldown: 1,
        passiveRegeneration: false,

        canRespawn: true,
        respawnTime: 5,

        size: 10,
        color: 0x33ffff,
    }
};

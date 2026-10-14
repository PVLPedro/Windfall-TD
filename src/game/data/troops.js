export const troopTypes = {

    soldier: {
        name: 'Soldado',

        health: 60,
        moveSpeed: 180,
        damage: {
            min: 3,
            max: 6
        },

        attackRange: 28,
        attackCooldown: 0.8,

        interceptRange: 80,

        color: 0x3399ff
    },

    archer: {
        name: 'Arqueiro',

        health: 40,
        moveSpeed: 150,
        damage: {
            min: 2,
            max: 4
        },

        attackRange: 110,
        attackCooldown: 1.2,

        interceptRange: 80,

        color: 0x33cc66
    }
};

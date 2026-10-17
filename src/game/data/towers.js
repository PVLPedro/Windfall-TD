import { troopTypes } from "./troops";

export const towerTypes = {

    nature: {

        name: 'Cogamelo Jovem',

        cost: 70,

        range: 30,
        troopRange: null, // Não é necessário explicitar. Na Classe Tower, essa proriedade e outras propriedades terão valor padrão

        damage: {
            min: 6,
            max: 9,
        },
        damageType: 'physical',
        attackCooldown: 0.7,

        projectile: {
            type: 'basic',
            speed: 25,
            height: 25, // Para criar um projétil teleguiado, baste não definir altura. A padrão será 0
        },

        // Temporários. Serão substituídos por sprites.

        icon: 'nature',
        size: 40,
        color: 0x39B54A
    },

    mage: {

        name: 'Aprendiz de Magia',

        cost: 90,

        range: 35,
        troopRange: null, // Não é necessário explicitar. Na Classe Tower, essa proriedade e outras propriedades terão valor padrão

        damage: {
            min: 9,
            max: 15,
        },
        damageType: 'magical',
        attackCooldown: 1.2,

        projectile: {
            type: 'basic', // Para criar um projétil teleguiado, baste não declarar altura. O valor padrão será 0
            speed: 30,
        },

        // Temporários. Serão substituídos por sprites.
        
        icon: 'magic',
        size: 35,
        color: 0x0071BC
    },

    mecanism: {
        name: 'Canhão Simples',

        cost: 110,

        range: 180,

        damage: {
            min: 14,
            max: 17,
        },
        damageType: 'physical',
        attackCooldown: 2.2,

        projectile: {
            type: 'area',
            speed: 40,
            radius: 15,
            falloff: 0.4
        },
        
        // Temporários. Serão substituídos por sprites.
        
        icon: 'mecanism',
        size: 50,
        color: 0xF7931E,        
    },

    alchemist: {

        name: 'Alquimista Despreparado',
        
        cost: 100,

        range: 130,

        damage: {
            min: 8,
            max: 14,
        },
        damageType: 'incendiary',
        attackCooldown: 1,

        projectile: {
            type: 'area',
            speed: 20,
            height: 10,
            radius: 12,
            falloff: null // Para determinar um ataque em área que não tenha falloff, basta não declarar falloff. O valor padrão será false
        },    

        debuff: {
            type: 'slowdown',
            value: 0.5,
            duration: 1,
            cumulative: false // Para determinar um debyff que não seja cumulativo, basta não declarar cumulative. O valor padrão será false
        },
        
        // Temporários. Serão substituídos por sprites.

        icon: 'alchemy',
        size: 50,
        color: 0xFFE52F
    },

    resistence: {

        name: 'Cabana Miliciana',

        cost: 70,

        range: 0,
        // Se range for igual a zero, quer dizer que não há motivos para declarar dano e derivados
        // Será usado o valor padrão (0 ou false para o resto)

        troopRange: 20,

        troops: [
            troopTypes.militiaMember,
            troopTypes.militiaMember,
            troopTypes.slinger
        ],
        
        // Temporários. Serão substituídos por sprites.

        icon: 'resistence',
        size: 50,
        color: 0x662D91
    },

    mad: {

        name: 'Dupla Elétrica',

        cost: 120,

        range: 40,
        troopRange: 30,

        damage: {
            min: 5,
            max: 20,
        },
        damageType: 'electric',
        attackCooldown: 1.5,

        // TEMPORÁRIO: o projétil 'chain' (Cadeia) ainda não existe.
        // Até lá, usa 'area' para a torre continuar funcionando.
        projectile: {
            type: 'area',
            speed: 30,
            radius: 5
        },

        troops: [
            troopTypes.troublemaker
        ],

        // Temporários. Serão substituídos por sprites.

        icon: 'mad',
        size: 50,
        color: 0xFF0000
    }
};
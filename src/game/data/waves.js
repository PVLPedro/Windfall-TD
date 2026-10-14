import { enemyTypes } from './enemies';

// export const waves = [
//     {
//         groups: [
//             {
//                 type: enemyTypes.goblin,
//                 count: 4,
//                 interval: 1,
//                 lanes: [-1, 0, 1, 2]
//             }
//         ],
//         groupInterval: 4,
//         lanesOrder: ['normal', 'reverse'],
//         repeats: 2,
//         nextWaveDelay: 15
//     },
//     {
//         groups: [
//             {
//                 type: enemyTypes.goblin,
//                 count: 4,
//                 interval: 1,
//                 lanes: [-1, 0, 1, 2]
//             }
//         ],
//         groupInterval: 4,
//         lanesOrder: ['normal', 'reverse'],
//         repeats: 2,
//         nextWaveDelay: 15
//     }
// ]

export const waves = [

    {
        groups: [

            {
                type: enemyTypes.goblin,
                count: 3,
                interval: 1,
                lanes: [-1, 0, 1]
            },
        ],

        groupInterval: 4,
        repeats: 2,
        lanesOrder: ['normal', 'reverse'],
        nextWaveDelay: 15
    },

    {
        groups: [

            {
                type: enemyTypes.goblin,
                count: 5,
                interval: .8,
                lanes: [0, -1, 0, 1, 0]
            },
        ],

        groupInterval: 3,
        repeats: 3,
        lanesOrder: ['normal', 'reverse', 'normal'],
        nextWaveDelay: 15,
        // earlyStartReward: 50
    },

    {
        groups: [
            {
                type: enemyTypes.goblin,
                count: 4,
                interval: 1,
                defaultLane: 2
            },
            {
                type: enemyTypes.orc,
                count: 3,
                interval: 1.5,
                defaultLane: 2
            }
        ],

        groupInterval: 4,
        repeats: 2,
        nextWaveDelay: 15
    },

    {
        groups: [

            {
                type: enemyTypes.goblin,
                count: 10,
                interval: .5,
                lanes: [0, 0, 1, 1, 1, 0, 0, -1, -1, -1]
            },

            {
                type: enemyTypes.orc,
                count: 3,
                interval: 0,
                lanes: [1, 0, -1]
            }

        ],

        groupInterval: 2.5,
        repeats: 2,
        nextWaveDelay: 15,
        earlyStartReward: 30
    },
    {
        groups: [

            {
                type: enemyTypes.wolf,
                count: 2,
                interval: 0.5,
                defaultLane: 2
            },

            {
                type: enemyTypes.goblin,
                count: 2,
                interval: 0.5,
                defaultLane: 2
            }

        ],

        groupInterval: 1,
        repeats: 12,
        nextWaveDelay: 10
    },

    {
        groups: [

            {
                type: enemyTypes.goblin,
                count: 5,
                interval: .5,
                defaultLane: 2,
            },

            {
                type: enemyTypes.orc,
                count: 3,
                interval: 1,
                defaultLane: 2,
            },

            {
                type: enemyTypes.wolf,
                count: 5,
                interval: .5,
                defaultLane: 2,
            },

            {
                type: enemyTypes.orc,
                count: 3,
                interval: 1,
            },

        ],

        groupInterval: 1.5,
        repeats: 3,
        nextWaveDelay: 10,
        earlyStartReward: 50
    },
    {
        groups: [

            {
                type: enemyTypes.orc,
                count: 10,
                interval: 1.5,
                defaultLane: 2,
            },

            {
                type: enemyTypes.orc,
                count: 15,
                interval: 1.5,
                defaultLane: 2,
            }

        ],

        groupInterval: 2.5,
        repeats: 1,
        nextWaveDelay: 10
    },

    {
        groups: [

            {
                type: enemyTypes.goblin,
                count: 12,
                interval: .5,
                lanes: [0, 0, 1, 1, -1 -1, 0, 0, 1, 1, -1 -1]
            },

            {
                type: enemyTypes.orc,
                count: 8,
                interval: .8,
                lanes: [0, 1, 0, -1, 0, 1, 0, -1]
            },

            {
                type: enemyTypes.wolf,
                count: 20,
                interval: .8,
                defaultLane: 2,
            },

            {
                type: enemyTypes.ogre,
                count: 1,
                interval: 1,                
            },

        ],

        groupInterval: 2,
        repeats: 2,
        nextWaveDelay: 10,
        earlyStartReward: 50
    },
]
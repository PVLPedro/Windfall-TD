import * as Phaser from 'phaser';

import Enemy from '../entities/Enemy';
import { GameEvents } from '../constants/events';

export default class EnemySpawner {
    constructor(scene, gamePath) {
        this.scene = scene;
        this.gamePath = gamePath;
        this.enemies = [];

        this.laneSpacing = 12;
        this.validLanes = [-1, 0, 1];
    }

    resolveLane(lane) {

        if (lane === 2) {
            const randomIndex = Phaser.Math.Between(
                0,
                this.validLanes.length - 1
            );

            return this.validLanes[randomIndex];
        }

        if (!this.validLanes.includes(lane)) {
            return 0;
        }

        return lane;
    }

    spawn(type, lane = 0) {

        const resolvedLane = this.resolveLane(lane);

        const enemy = new Enemy(
            this.scene,
            this.gamePath,
            type,
            resolvedLane,
            this.laneSpacing
        );

        enemy.setInteractive();

        enemy.on('pointerdown', () => {
            this.scene.events.emit(
                GameEvents.ENTITY_CLICKED,
                enemy
            );
        });

        this.enemies.push(enemy);

        return enemy;
    }

    spawnGroup(
        type,
        count,
        interval,
        lanes = [],
        defaultLane = 0,
        order = 'normal',
        onComplete
    ) {

        const resolvedLanes = Array.from(
            { length: count },
            (_, index) => lanes[index] ?? defaultLane
        );

        if (order === 'reverse') {
            resolvedLanes.reverse();
        }

        let spawned = 0;

        const spawnNext = () => {
            this.spawn(type, resolvedLanes[spawned]);

            spawned++;

            if (spawned >= count) {
                if (onComplete) onComplete();
                return;
            }

            this.scene.time.delayedCall(
                interval * 1000,
                spawnNext
            );
        };

        if (count > 0) {
            spawnNext();
        } else if (onComplete) {
            onComplete();
        }
    }

    spawnGroups(
        groups,
        groupInterval,
        repeats = 1,
        onComplete,
        lanesOrder = []
    ) {
        if (groups.length === 0 || repeats <= 0) {
            if (onComplete) onComplete();
            return;
        }

        let currentGroup = 0;
        let currentRepeat = 0;
        let isFirstGroup = true;

        const spawnNextGroup = () => {
            if (currentGroup >= groups.length) {
                currentRepeat++;

                if (currentRepeat >= repeats) {
                    if (onComplete) onComplete();
                    return;
                }

                currentGroup = 0;
            }

            const group = groups[currentGroup];
            const order = lanesOrder[currentRepeat] ?? 'normal';

            currentGroup++;

            const spawn = () => {
                this.spawnGroup(
                    group.type,
                    group.count,
                    group.interval,
                    group.lanes ?? [],
                    group.defaultLane,
                    order,
                    spawnNextGroup
                );
            };

            if (isFirstGroup) {
                isFirstGroup = false;
                spawn();
            } else {
                this.scene.time.delayedCall(
                    groupInterval,
                    spawn
                );
            }
        };

        spawnNextGroup();
    }

    update(delta) {
        this.enemies.forEach(enemy => {
            enemy.update(delta);
        });
    }
}

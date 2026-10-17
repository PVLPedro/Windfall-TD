import * as Phaser from 'phaser';

import Troop from './Troop';
import { QUAD } from '../constants/units';

export default class CommandPoint extends Phaser.GameObjects.Container {

    constructor(scene, gamePath, tower, data, x, y) {

        super(scene, x, y);

        this.scene = scene;
        this.gamePath = gamePath;
        this.tower = tower;

        this.troopData = data;
        this.color = data.color;

        this.type = 'commandPoint';

        this.commandX = x;
        this.commandY = y;

        this.canRespawn = data.canRespawn ?? false;
        this.respawnTime = data.respawnTime ?? 10;
        this.respawnEvent = null;
        
        this.detectionRange = data.interceptRange * QUAD;

        this.troop = null;

        this.detectionArea = scene.add.circle(
            0,
            0,
            this.detectionRange,
            this.color,
            0.05
        );

        this.detectionArea.setStrokeStyle(
            2,
            this.color,
            0.05
        );

        this.marker = scene.add.circle(
            0,
            0,
            5,
            0x123a70,
            1
        );

        this.marker.setStrokeStyle(2, 0xffffff, 0.9);

        this.add([
            this.detectionArea,
            this.marker
        ]);

        scene.add.existing(this);

        this.setDepth(y - 1);

        this.spawnTroop();
    }

    moveCommandPoint(x, y) {
        
        if (!this.active) return false;

        this.setPosition(x, y);

        this.commandX = x;
        this.commandY = y;

        if (this.troop?.active) {

            this.troop.returnToCommandPoint();
        }

        return true;
    }

    spawnTroop() {

        if (!this.scene || !this.scene.sys.isActive()) return;
        if (this.troop?.active) return;

        this.troop = null;

        const troop = new Troop(
            this.scene,
            this.troopData,
            this
        );

        if (!troop.active || this.troop !== troop) {
            troop.destroy();
            return;
        }

        if (!this.scene.troops.includes(troop)) {
            this.scene.troops.push(troop);
        }
    }

    handleTroopDeath(troop) {
        if (this.troop !== troop) return;

        this.troop = null;

        if (!this.canRespawn) return;

        const delay = Math.max(
            0,
            this.respawnTime * 1000
        );

        this.respawnEvent = this.scene.time.delayedCall(
            delay,
            () => {
                this.respawnEvent = null;
                this.spawnTroop();
            }
        );
    }

    setTroop(troop) {
        if (this.troop && this.troop !== troop) {
            return false;
        }

        this.troop = troop;
        return true;
    }

    getPosition() {
        return {
            x: this.commandX,
            y: this.commandY
        };
    }

    destroy(fromScene) {
        if (this.respawnEvent) {
            this.respawnEvent.remove(false);
            this.respawnEvent = null;
        }

        this.troop.destroy();
        this.troop = null;

        super.destroy(fromScene);
    }
}
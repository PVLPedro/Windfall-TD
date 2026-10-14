import * as Phaser from 'phaser';

export default class CommandPoint extends Phaser.GameObjects.Container {
    constructor(scene, x, y, detectionRange = 80) {
        super(scene, x, y);

        this.type = 'commandPoint';

        this.commandX = x;
        this.commandY = y;

        this.detectionRange = detectionRange;

        this.troop = null;

        this.detectionArea = scene.add.circle(
            0,
            0,
            this.detectionRange,
            0x00aaff,
            0.08
        );

        this.detectionArea.setStrokeStyle(
            2,
            0x00aaff,
            0.45
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
        this.troop = null;
        super.destroy(fromScene);
    }
}
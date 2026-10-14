import * as Phaser from 'phaser';

export default class Slot extends Phaser.GameObjects.Rectangle {

    constructor(scene, x, y, initialCost) {

        super(
            scene,
            x,
            y,
            50,
            50,
            0x002222,
            0.5
        );

        this.scene = scene;

        this.setStrokeStyle(4, 0x444444, 1);

        this.text = scene.add.text(
            x,
            y,
            'Slot',
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(100);

        this.initialCost = initialCost;

        scene.add.existing(this);
    }
}
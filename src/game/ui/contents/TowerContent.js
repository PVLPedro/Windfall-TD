
import * as Phaser from 'phaser';

import UIButton from '../components/UIButton';

export default class TowerContent {

    constructor(scene, towerManager, width, height, onSold) {

        this.scene = scene;
        this.towerManager = towerManager;
        this.width = width;
        this.height = height;
        this.onSold = onSold;

        this.selectedTower = null;

        this.create();
        this.hide();
    }

    create() {

        this.container = this.scene.add.container(0, 0);

        this.description = this.scene.add.text(
            20,
            70,
            '',
            {
                fontSize: '18px',
                color: '#cccccc',
                wordWrap: {
                    width: this.width - 40
                }
            }
        );

        this.sellButton = new UIButton(
            this.scene,
            this.width / 2,
            this.height - 27,
            this.width - 40,
            42,
            'VENDER',
            {
                backgroundColor: 0xff4c4c,
                hoverColor: 0xff6969,
                pressedColor: 0xd12222,
                selectedColor: 0xff5c5c,

                onClick: () => this.handleSell()
            }
        );

        this.container.add([
            this.description,
            this.sellButton
        ]);
    }

    show(tower) {

        this.selectedTower = tower;

        this.description.setText(
            `Dano: ${tower.damage.min} - ${tower.damage.max}\n` +
            `Alcance: ${tower.range}`
        );

        this.container.setVisible(true);
    }

    hide() {

        this.container.setVisible(false);

        this.selectedTower = null;
    }

    handleSell() {

        if (!this.selectedTower) return;

        const { sold, slot } = this.towerManager.sellTower(
            this.selectedTower
        );

        if (!sold) return;

        this.hide();

        this.onSold(slot);
    }
}

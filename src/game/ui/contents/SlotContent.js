
import * as Phaser from 'phaser';

import { towerTypes } from '../../data/towers';
import UIButton from '../components/UIButton';

export default class SlotContent {

    constructor(scene, towerManager, width, height, onBuilt) {

        this.scene = scene;
        this.towerManager = towerManager;
        this.width = width;
        this.height = height;
        this.onBuilt = onBuilt;

        this.selectedSlot = null;
        this.selectedTowerType = null;
        this.towerTypeButtons = [];

        this.create();
        this.hide();
    }

    create() {

        this.container = this.scene.add.container(0, 0);

        this.description = this.scene.add.text(
            20,
            62,
            'Selecione uma torre para construir.',
            {
                fontSize: '16px',
                color: '#cccccc',
                wordWrap: {
                    width: this.width - 40
                }
            }
        );

        this.container.add(this.description);

        this.createTowerButtons();

        this.feedback = this.scene.add.text(
            20,
            this.height - 300,
            'Selecione uma torre.',
            {
                fontSize: '14px',
                color: '#cccccc',
                wordWrap: {
                    width: this.width - 40
                }
            }
        );

        this.container.add(this.feedback);

        this.buyButton = new UIButton(
            this.scene,
            this.width / 2,
            this.height - 27,
            this.width - 40,
            42,
            'COMPRAR',
            {
                backgroundColor: 0x547943,
                hoverColor: 0x6b9855,
                pressedColor: 0x3d5e31,
                selectedColor: 0x547943,

                onClick: () => this.handleBuild()
            }
        );

        this.container.add(this.buyButton);

        this.buyButton.setEnabled(false);
    }

    createTowerButtons() {

        const towers = Object.values(towerTypes);

        const buttonWidth = this.width - 40;
        const buttonHeight = 34;
        const spacing = 38;
        const startY = 105;

        towers.forEach((tower, index) => {

            const button = new UIButton(
                this.scene,
                this.width / 2,
                startY + index * spacing,
                buttonWidth,
                buttonHeight,
                `${tower.name} ($${tower.cost})`,
                {
                    backgroundColor: 0x34414a,
                    hoverColor: 0x465660,
                    pressedColor: 0x26343b,
                    selectedColor: 0x547943,
                    fontSize: '15px',

                    onClick: () => {
                        this.selectTowerType(tower);
                    }
                }
            );

            this.towerTypeButtons.push({
                towerType: tower,
                button
            });

            this.container.add(button);
        });
    }

    show(slot) {

        this.selectedSlot = slot;

        this.resetTowerTypeSelection();

        this.feedback.setText('Selecione uma torre.');

        this.container.setVisible(true);
    }

    hide() {

        this.container.setVisible(false);

        this.selectedSlot = null;

        this.resetTowerTypeSelection();
    }

    selectTowerType(towerType) {

        if (!this.selectedSlot) return;

        this.selectedTowerType = towerType;

        this.towerTypeButtons.forEach(item => {

            item.button.setSelected(
                item.towerType === towerType
            );
        });

        this.buyButton.setEnabled(true);

        this.feedback.setText(
            `${towerType.name} selecionada.\n` +
            `Dano: ${towerType.damage.min} - ${towerType.damage.max}\n` +
            `Alcance: ${towerType.range}`
        );
    }

    handleBuild() {

        if (!this.selectedSlot || !this.selectedTowerType) {
            return;
        }

        const { built, tower } = this.towerManager.buildTower(
            this.selectedSlot,
            this.selectedTowerType
        );

        if (!built) {

            this.feedback.setText(
                'Dinheiro insuficiente para comprar esta torre.'
            );

            return;
        }

        this.hide();

        this.onBuilt(tower);
    }

    resetTowerTypeSelection() {

        this.selectedTowerType = null;

        this.towerTypeButtons.forEach(item => {
            item.button.setSelected(false);
        });

        this.buyButton.setEnabled(false);
    }
}

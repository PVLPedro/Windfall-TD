
import * as Phaser from 'phaser';

import UIButton from './components/UIButton';

import SlotContent from './contents/SlotContent';
import TowerContent from './contents/TowerContent';
import EntityContent from './contents/EntityContent';

import SelectionHighlight from './components/SelectionHighlight';

export default class SelectionPanel {

    constructor(scene, towerManager) {

        this.scene = scene;
        this.towerManager = towerManager;

        this.selectionHighlight = new SelectionHighlight(
            this.scene
        );

        this.width = 400;
        this.height = 600;

        this.selectedObject = null;
        this.mode = null;

        this.create();
        this.hide();
    }

    create() {

        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        const x = screenWidth - this.width;
        const y = (screenHeight - this.height) / 2;

        this.panel = this.scene.add.container(x, y)
            .setDepth(100);

        this.background = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0x151515,
            0.9
        )
        .setOrigin(0, 0)
        .setInteractive();

        this.title = this.scene.add.text(
            20,
            16,
            '',
            {
                fontSize: '26px',
                fontStyle: 'bold',
                color: '#FFFFFF'
            }
        );

        this.closeButton = new UIButton(
            this.scene,
            this.width - 28,
            27,
            42,
            42,
            'X',
            {
                backgroundColor: 0x34414a,
                hoverColor: 0x465660,
                pressedColor: 0x26343b,

                onClick: () => this.hide()
            }
        );

        this.slotContent = new SlotContent(
            this.scene,
            this.towerManager,
            this.width,
            this.height,
            tower => this.showTower(tower)
        );

        this.towerContent = new TowerContent(
            this.scene,
            this.towerManager,
            this.width,
            this.height,
            slot => this.showSlot(slot)
        );

        this.entityContent = new EntityContent(
            this.scene,
            this.towerManager,
            this.width,
            this.height
        );

        this.panel.add([
            this.background,
            this.slotContent.container,
            this.towerContent.container,
            this.entityContent.container,
            this.title,
            this.closeButton
        ]);
    }

    showSlot(slot) {

        if (
            this.mode === 'slot' &&
            this.selectedObject === slot
        ) {
            this.hide();
            return;
        }

        this.selectedObject = slot;
        this.mode = 'slot';

        this.selectionHighlight.select(
            slot,
            'rectangle'
        );

        this.title.setText('ESPAÇO');

        this.towerContent.hide();
        this.entityContent.hide();
        this.slotContent.show(slot);

        this.show();
    }

    showTower(tower) {

        if (
            this.mode === 'tower' &&
            this.selectedObject === tower
        ) {
            this.hide();
            return;
        }

        this.selectedObject = tower;
        this.mode = 'tower';

        this.selectionHighlight.select(
            tower,
            'rectangle'
        );

        this.title.setText(tower.name);

        this.slotContent.hide();
        this.entityContent.hide();
        this.towerContent.show(tower);

        this.show();
    }

    showEntity(entity) {

        this.selectedObject = entity;
        this.mode = 'entity';

        this.selectionHighlight.select(
            entity,
            'circle'
        );

        this.title.setText(entity.name);

        this.slotContent.hide();
        this.towerContent.hide();
        this.entityContent.show();

        this.show();
    }

    show() {

        this.panel.setVisible(true);
    }

    hide() {

        this.selectionHighlight.clear();

        this.panel.setVisible(false);

        this.selectedObject = null;
        this.mode = null;

        if (this.slotContent) {
            this.slotContent.hide();
        }

        if (this.towerContent) {
            this.towerContent.hide();
        }
    }

    update() {

        if (this.mode === 'entity') {
            this.entityContent.update(this.selectedObject)
        }

        this.selectionHighlight.update();
    }
}


import * as Phaser from 'phaser';

import { enemyTypes } from '../../data/enemies';
import UIButton from '../components/UIButton';

export default class EntityContent {

    constructor(scene, towerManager, width, height) {

        this.scene = scene;
        this.towerManager = towerManager;
        this.width = width;
        this.height = height;

        this.entityType = null;

        this.create();
        this.hide();
    }

    create() {

        this.container = this.scene.add.container(0, 0);

        this.description = this.scene.add.text(
            20,
            62,
            'Inimigo.',
            {
                fontSize: '16px',
                color: '#cccccc',
                wordWrap: {
                    width: this.width - 40
                }
            }
        );

        this.container.add(this.description);
    }

    show() {

        this.container.setVisible(true);
    }

    hide() {

        this.container.setVisible(false);
    }

    update(entity) {

        if (entity.health <= 0) {

            this.scene.selectionPanel.hide();
            this.hide();

            return
        }
        
        this.description.setText(
            `${entity.name} \n` +
            `${entity.health} / ${entity.maxHealth} \n` +
            `${entity.speed} \n` +
            `${entity.damage.min}-${entity.damage.max}\n` +
            `${entity.lifes} \n` +
            `${entity.reward} \n` +
            ``
        );
    }
}

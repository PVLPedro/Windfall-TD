import Tower from '../entities/Tower';

import { GameEvents } from '../constants/events';

export default class TowerManager {

    constructor(scene, enemies, projectileManager) {

        this.scene = scene;

        this.enemies = enemies;
        this.projectileManager = projectileManager;

        this.towers = [];
    }

    setSlotManager(slotManager) {

        this.slotManager = slotManager;
    }

    buildTower(slot, towerType) {

        const moneySystem = this.scene.moneySystem;

        let built = false;

        if (!moneySystem.spendMoney(towerType.cost)) {
            return { built };
        }

        const tower = new Tower(
            this.scene,
            slot.x,
            slot.y,
            towerType,
            this.enemies,
            this.projectileManager
        );

        tower.buildSlot = slot;

        this.towers.push(tower);

        slot.text.setVisible(false);
        slot.setVisible(false);
        slot.disableInteractive();

        tower.setInteractive();

        tower.on('pointerdown', () => {

            this.scene.events.emit(
                GameEvents.TOWER_CLICKED,
                tower
            );

        });

        built = true;

        return { built, tower };
    }

    sellTower(tower) {

        const slot = tower.buildSlot;

        let sold = false;

        this.scene.moneySystem.refundMoney(
            tower.cost
        );

        tower.destroy();

        this.towers = this.towers.filter(
            currentTower => currentTower !== tower
        );

        this.slotManager.releaseSlot(slot);

        sold = true;

        return { sold, slot };
    }

    update(delta) {

        this.towers.forEach(tower => {
            tower.update(delta);
        });
    }
}
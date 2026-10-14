import Slot from '../entities/Slot';
import { GameEvents } from '../constants/events';

export default class SlotManager {

    constructor(scene, slotData, towerManager) {

        this.scene = scene;

        this.towerManager = towerManager;

        this.slots = [];

        this.createSlots(slotData);
    }

    createSlots(slotData) {

        this.slots = slotData.map(data => {

            const slot = new Slot(
                this.scene,
                data.x,
                data.y,
                data.initialCost
            );

            slot.setInteractive();

            slot.on('pointerdown', () => {

                this.scene.events.emit(
                    GameEvents.SLOT_CLICKED,
                    slot
                );
            });

            return slot;
        });
    }

    releaseSlot(slot) {

        slot.text.setVisible(true);
        slot.setVisible(true);
        slot.setInteractive();
    }
}
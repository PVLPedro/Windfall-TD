import { GameEvents } from '../constants/events';

export default class MoneySystem {

    constructor(scene, initialMoney, refundRate) {

        this.scene = scene;

        this.money = initialMoney;

        this.refundRate = refundRate;
    }

    emitChange() {

        this.scene.events.emit(
            GameEvents.MONEY_CHANGED,
            this.money
        );
    }

    canSpend(amount) {

        return this.money >= amount;
    }

    spendMoney(amount) {

        if (!this.canSpend(amount)) {
            return false;
        }

        this.money -= amount;

        this.emitChange();

        return true;
    }

    gainMoney(amount) {

        this.money += amount;

        this.emitChange();
    }

    refundMoney(originalCost) {

        const refund = Math.floor(
            originalCost * this.refundRate
        );

        this.gainMoney(refund);
    }
}
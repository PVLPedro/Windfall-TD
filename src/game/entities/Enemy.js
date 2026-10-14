import * as Phaser from 'phaser';
import { GameEvents } from '../constants/events';

const HEALTH_BAR_WIDTH = 30;

export default class Enemy extends Phaser.GameObjects.Arc {
    constructor(scene, gamePath, data, lane = 0, laneSpacing = 12) {
        const start = gamePath.getLanePosition(0, lane, laneSpacing);

        super(
            scene,
            start.x,
            start.y,
            data.size,
            0,
            360,
            false,
            data.color
        );

        this.gamePath = gamePath;
        this.pathLength = gamePath.getLength();
        this.pathDistance = 0;

        this.lane = lane;
        this.laneSpacing = laneSpacing;

        this.type = 'enemy';
        this.name = data.name;

        this.health = data.health;
        this.maxHealth = data.health;

        this.speed = data.speed;
        this.actualSpeed = data.speed;

        this.damage = data.damage;
        this.lifes = data.lifes;
        this.reward = data.reward;

        this.color = data.color;
        this.size = data.size;

        this.blockable = data.blockable ?? true;

        this.reservedBy = null;
        this.isIntercepted = false;
        this.isBlocked = false;
        this.blockingTroop = null;

        this.container = scene.add
            .container(start.x, start.y - this.size * 2)
            .setDepth(100);

        this.healthBarBg = scene.add.rectangle(
            0,
            this.size / 2,
            HEALTH_BAR_WIDTH,
            5,
            0x002200
        );

        this.healthBar = scene.add.rectangle(
            0,
            this.size / 2,
            HEALTH_BAR_WIDTH,
            5,
            0x00aa00
        );

        this.container.add([
            this.healthBarBg,
            this.healthBar
        ]);

        scene.add.existing(this);
    }

    update(delta) {
        if (!this.active) return;

        if (this.reservedBy) {
            if (this.reservedBy.active) {
                return;
            }

            this.releaseTroop(this.reservedBy);
        }

        if (this.isBlocked) return;

        this.pathDistance += this.speed * (delta / 1000);

        if (this.pathDistance >= this.pathLength) {
            this.scene.lifeSystem.loseLife(this.lifes);
            this.destroy();
            return;
        }

        const point = this.gamePath.getLanePosition(
            this.pathDistance,
            this.lane,
            this.laneSpacing
        );

        this.setPosition(point.x, point.y);
        this.setDepth(point.y);

        this.container
            .setPosition(point.x, point.y - this.size * 2)
            .setDepth(point.y);
    }

    takeDamage(amount) {
        if (!this.active) return;

        this.health -= amount;
        this.updateHealthBar();

        if (this.health <= 0) {
            this.health = 0;

            this.scene.moneySystem.gainMoney(this.reward);
            this.scene.events.emit(GameEvents.ENTITY_DEATH, this);

            this.destroy();
            return;
        }

        this.flashDamage();
    }

    updateHealthBar() {
        const percentage = Phaser.Math.Clamp(
            this.health / this.maxHealth,
            0,
            1
        );

        this.healthBar.width = HEALTH_BAR_WIDTH * percentage;
    }

    flashDamage() {
        this.setFillStyle(0xffffff);

        this.scene.time.delayedCall(100, () => {
            if (this.active) {
                this.setFillStyle(this.color);
            }
        });
    }

    reserveTroop(troop) {
        if (!this.active || !this.blockable || !troop.active) {
            return false;
        }

        if (this.reservedBy && this.reservedBy !== troop) {
            return false;
        }

        this.reservedBy = troop;
        this.isIntercepted = !this.isBlocked;

        return true;
    }

    confirmBlock(troop) {
        if (
            !this.active ||
            !this.blockable ||
            this.reservedBy !== troop
        ) {
            return false;
        }

        this.isIntercepted = false;
        this.isBlocked = true;
        this.blockingTroop = troop;

        return true;
    }

    releaseTroop(troop) {
        if (this.reservedBy !== troop) {
            return false;
        }

        this.reservedBy = null;
        this.isIntercepted = false;
        this.isBlocked = false;
        this.blockingTroop = null;

        return true;
    }

    destroy(fromScene) {
        if (this.reservedBy) {
            const troop = this.reservedBy;

            if (troop.active) {
                troop.onTargetLost(this);
            }

            this.reservedBy = null;
        }

        this.isIntercepted = false;
        this.isBlocked = false;
        this.blockingTroop = null;

        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        super.destroy(fromScene);
    }
}
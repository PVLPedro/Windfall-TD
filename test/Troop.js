import * as Phaser from 'phaser';

const HEALTH_BAR_WIDTH = 30;

export default class Troop extends Phaser.GameObjects.Arc {

    constructor(scene, data, commandPoint) {

        super(
            scene,
            commandPoint.x,
            commandPoint.y,
            data.size,
            0,
            360,
            false,
            data.color
        );

        this.scene = scene;

        this.commandPoint = commandPoint;
        this.actionRadius = commandPoint.detectionRange;

        this.state = 'idle';
        this.targetEnemy = null;
        this.interceptionTween = null;

        this.health = data.health;
        this.maxHealth = data.health;

        this.speed = data.speed;
        this.actualSpeed = data.speed;

        this.meleeDamage = data.meleeDamage;
        this.meleeCooldown = data.meleeCooldown;

        this.attackTimer = 0;

        this.regeneration = data.regeneration ?? 0;
        this.regenerationCooldown = data.regenerationCooldown;
        this.passiveRegeneration = data.passiveRegeneration ?? false;

        this.regenerationTimer = 0;

        this.detectionArea = commandPoint.detectionArea;

        this.color = data.color;
        this.size = data.size;

        this.container = scene.add
            .container(commandPoint.x, commandPoint.y + this.size * 2)
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

        if (!commandPoint.setTroop(this)) {
            this.destroy();
            return;
        }
    }

    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (const enemy of enemies) {
            if (!enemy.active) continue;
            if (!enemy.blockable) continue;

            if (enemy.reservedBy && enemy.reservedBy !== this) {
                continue;
            }

            const commandPosition = this.commandPoint.getPosition();

            const distance = Phaser.Math.Distance.Between(
                commandPosition.x,
                commandPosition.y,
                enemy.x,
                enemy.y
            );

            if (
                distance <= this.actionRadius &&
                distance < closestDistance
            ) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        return closestEnemy;
    }

    update(enemies, delta) {

        if (!this.active) return;

        this.regenerate(delta);

        if (this.targetEnemy) {
            const enemy = this.targetEnemy;

            const validTarget =
                enemy.active &&
                enemy.blockable &&
                enemy.reservedBy === this;

            if (!validTarget) {
                this.releaseTarget();
                // return; -> Habilitado: faz a tropa não poder achar inimigos enquanto está voltando
            }
        }

        if (!this.targetEnemy && this.state === 'idle') {
            const enemy = this.findTarget(enemies);

            if (enemy && enemy.reserveTroop(this)) {
                this.targetEnemy = enemy;
                this.moveToTarget(enemy);
            }
        }

        if (this.state === 'blocking' && this.targetEnemy?.active) {
            this.updateCombat(delta);
        }

        this.setDepth(this.y);

        this.updateVisuals();

        if (this.container && this.active) {
            this.container.setPosition(this.x, this.y + this.size * 2);
        }
    }

    updateCombat(delta) {

        const enemy = this.targetEnemy;

        if (
            !this.active ||
            this.state !== 'blocking' ||
            !enemy?.active ||
            !enemy.isBlocked ||
            enemy.blockingTroop !== this
        ) {
            return;
        }

        this.attackTimer += delta;

        const cooldown = this.meleeCooldown * 1000;

        if (!Number.isFinite(cooldown) || cooldown <= 0) {
            return;
        }

        if (this.attackTimer < cooldown) return;

        this.attackTimer -= cooldown;

        this.scene.combatSystem.dealDamage(
            enemy,
            this.meleeDamage
        );
    }

    moveToTarget(enemy) {
        if (
            !this.active ||
            !enemy.active ||
            enemy.reservedBy !== this
        ) {
            this.releaseTarget();
            return;
        }

        this.state = 'intercepting';

        const targetX = enemy.x;
        const targetY = enemy.y;

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            targetX,
            targetY
        );

        const duration = Math.max(
            1,
            (distance / this.speed) * 1000
        );

        this.interceptionTween = this.scene.tweens.add({
            targets: this,
            x: targetX + 20,
            y: targetY,
            duration,
            ease: 'Linear',

            onComplete: () => {
                this.interceptionTween = null;

                if (
                    !this.active ||
                    !enemy.active ||
                    this.targetEnemy !== enemy ||
                    enemy.reservedBy !== this
                ) {
                    return;
                }

                if (enemy.confirmBlock(this)) {
                    this.state = 'blocking';
                } else {
                    this.releaseTarget();
                }

                this.setDepth(this.y);
                this.updateVisuals();
            }
        });
    }

    takeDamage(amount) {
        if (!this.active) return;

        this.health -= amount;
        this.updateHealthBar();

        if (this.health <= 0) {

            this.health = 0;
            this.isDead = true;

            this.updateVisuals();

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

    releaseTarget() {
        const enemy = this.targetEnemy;

        if (this.interceptionTween) {
            this.interceptionTween.stop();
            this.interceptionTween = null;
        }

        this.targetEnemy = null;

        if (enemy?.active) {
            enemy.releaseTroop(this);
        }

        this.returnToCommandPoint();
    }

    onTargetLost(enemy) {
        if (this.targetEnemy !== enemy) return;

        if (this.interceptionTween) {
            this.interceptionTween.stop();
            this.interceptionTween = null;
        }

        this.targetEnemy = null;

        this.returnToCommandPoint();
    }

    returnToCommandPoint() {
        if (!this.active || !this.commandPoint) return;

        if (this.interceptionTween) {
            this.interceptionTween.stop();
            this.interceptionTween = null;
        }

        const position = this.commandPoint.getPosition();

        this.state = 'returning';

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            position.x,
            position.y
        );

        const duration = Math.max(
            1,
            (distance / this.speed) * 1000
        );

        this.interceptionTween = this.scene.tweens.add({
            targets: this,
            x: position.x,
            y: position.y,
            duration,
            ease: 'Linear',

            onComplete: () => {
                this.interceptionTween = null;

                if (!this.active || this.state !== 'returning') {
                    return;
                }

                this.setPosition(position.x, position.y);
                this.setDepth(this.y);

                this.state = 'idle';
                this.updateVisuals();
            }
        });

        this.updateVisuals();
    }

    regenerate(delta) {
        if (
            !this.active ||
            this.regeneration <= 0 ||
            this.health >= this.maxHealth
        ) {
            return;
        }
        
        if (!this.passiveRegeneration) {

            if (this.state !== 'idle') return;
        }
        
        this.regenerationTimer += delta;
        
        const cooldown = this.regenerationCooldown * 1000;
        
        if (!Number.isFinite(cooldown) || cooldown <= 0) {
            return;
        }
        
        if (this.regenerationTimer < cooldown) return;
        
        this.regenerationTimer -= cooldown;
        
        this.health = Math.min(
            this.maxHealth,
            this.health + this.regeneration
        );

        this.updateHealthBar();
    }

    updateVisuals() {
        if (this.state === 'idle') {
            this.detectionArea.setFillStyle(0x00aaff, 0.1);
            this.detectionArea.setStrokeStyle(2, 0x00aaff, 0.8);
            return;
        }

        if (this.state === 'intercepting') {
            this.detectionArea.setFillStyle(0xffaa00, 0.1);
            this.detectionArea.setStrokeStyle(2, 0xffaa00, 0.8);
            return;
        }
        
        if (this.state === 'returning') {
            this.detectionArea.setFillStyle(0x33cc66, 0.1);
            this.detectionArea.setStrokeStyle(2, 0x33cc66, 0.8);
            return;
        }

        if (this.state === 'blocking') {
            this.detectionArea.setFillStyle(0xff4444, 0.1);
            this.detectionArea.setStrokeStyle(2, 0xff4444, 0.8);
        }

        if (this.health === 0) {
            this.detectionArea.setFillStyle(0x223344, 0.1);
            this.detectionArea.setStrokeStyle(2, 0x223344, 0.8);
        }
    }

    destroy(fromScene) {

        if (this.interceptionTween) {

            this.interceptionTween.stop();
            this.interceptionTween = null;
        }

        const enemy = this.targetEnemy;
        this.targetEnemy = null;

        if (enemy?.active) {
            enemy.releaseTroop(this);
        }

        if (this.isDead && this.commandPoint) {
            this.commandPoint.handleTroopDeath(this);
        }

        if (this.commandPoint?.troop === this) {
            this.commandPoint.troop = null;
        }

        const troops = this.scene?.troops;

        if (troops) {
            const index = troops.indexOf(this);

            if (index !== -1) {
                troops.splice(index, 1);
            }
        }

        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        super.destroy(fromScene);
    }
}
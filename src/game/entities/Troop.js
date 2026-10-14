import * as Phaser from 'phaser';

export default class Troop extends Phaser.GameObjects.Container {
    constructor(scene, commandPoint) {
        super(scene, commandPoint.x, commandPoint.y);

        this.commandPoint = commandPoint;
        this.radius = commandPoint.detectionRange;
        this.moveSpeed = 180;

        this.state = 'idle';
        this.targetEnemy = null;
        this.interceptionTween = null;

        this.detectionArea = commandPoint.detectionArea;

        this.body = scene.add.circle(
            0,
            0,
            12,
            0x3399ff
        );

        this.setSize(this.body.width, this.body.height);

        this.body.setStrokeStyle(2, 0xffffff);

        this.add(this.body);

        scene.add.existing(this);

        this.setDepth(this.y);

        if (!commandPoint.setTroop(this)) {
            this.destroy();
            throw new Error(
                'Este ponto de comando já possui uma tropa.'
            );
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
                distance <= this.radius &&
                distance < closestDistance
            ) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        return closestEnemy;
    }

    update(enemies) {
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

        this.setDepth(this.y);

        this.updateVisuals();
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
            (distance / this.moveSpeed) * 1000
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
            (distance / this.moveSpeed) * 1000
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

    updateVisuals() {
        if (this.state === 'idle') {
            this.detectionArea.setFillStyle(0x00aaff, 0.15);
            this.detectionArea.setStrokeStyle(2, 0x00aaff, 0.8);
            return;
        }

        if (this.state === 'intercepting') {
            this.detectionArea.setFillStyle(0xffaa00, 0.2);
            this.detectionArea.setStrokeStyle(2, 0xffaa00, 1);
            return;
        }
        
        if (this.state === 'returning') {
            this.detectionArea.setFillStyle(0x33cc66, 0.15);
            this.detectionArea.setStrokeStyle(2, 0x33cc66, 0.8);
            return;
        }

        if (this.state === 'blocking') {
            this.detectionArea.setFillStyle(0xff4444, 0.2);
            this.detectionArea.setStrokeStyle(2, 0xff4444, 1);
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

        if (this.commandPoint?.troop === this) {
            this.commandPoint.troop = null;
        }

        super.destroy(fromScene);
    }
}
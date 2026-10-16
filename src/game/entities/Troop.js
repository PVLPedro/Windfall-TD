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
        this.gamePath = commandPoint.gamePath;
        this.tower = commandPoint.tower;

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

        this.rangedDamage = data.rangedDamage ?? null;
        this.rangedCooldown = data.rangedCooldown ?? 0;
        this.rangedRange = data.rangedRange ?? 0;
        this.projectileSpeed = data.projectileSpeed ?? 240;

        this.rangedAttackTimer = this.rangedCooldown * 800;

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

        this.rangeIndicator = null;

        if (this.rangedDamage && this.rangedRange > 0) {
            this.rangeIndicator = scene.add
                .circle(
                    this.x,
                    this.y,
                    this.rangedRange,
                    this.color,
                    0.04
                )
                .setStrokeStyle(2, this.color, 0.45)
                .setDepth(this.y - 1);
        };

        this.commandPointMoveMode = false;

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
            Phaser.Geom.Rectangle.Contains
        );

        this.on('pointerdown', () => {
            this.handleCommandPointMove();
        });

        scene.add.existing(this);

        if (!commandPoint.setTroop(this)) {
            this.destroy();
            return;
        }
    }

    handleCommandPointMove() {
        if (!this.active) return;

        // Se já estiver ativo, o clique desativa o modo.
        if (this.commandPointMoveMode) {
            this.setCommandPointMoveMode(false);
            return;
        }

        // Apenas uma tropa pode estar em modo de reposicionamento.
        const previousTroop = this.scene.activeCommandPointMoveTroop;

        if (previousTroop && previousTroop !== this) {
            previousTroop.setCommandPointMoveMode(false);
        }

        this.setCommandPointMoveMode(true);
    }

    setCommandPointMoveMode(enabled) {
        if (!this.active) return;

        if (this.commandPointMoveMode === enabled) return;

        this.commandPointMoveMode = enabled;

        if (enabled) {
            this.scene.activeCommandPointMoveTroop = this;

            this.scene.input.on(
                'pointerdown',
                this.handleMovePointerDown,
                this
            );
        } else {
            this.scene.input.off(
                'pointerdown',
                this.handleMovePointerDown,
                this
            );

            if (this.scene.activeCommandPointMoveTroop === this) {
                this.scene.activeCommandPointMoveTroop = null;
            }
        }
    }

    handleMovePointerDown(pointer) {
        if (!this.active || !this.commandPointMoveMode) return;

        // Não interpretar cliques em outras tropas como destinos.
        const clickedTroop = this.scene.troops.some(troop => {
            if (!troop.active) return false;

            const bounds = troop.getBounds();

            return bounds.contains(pointer.worldX, pointer.worldY);
        });

        if (clickedTroop) return;

        // Verifica se o clique está dentro da área do caminho.
        const isOnPath = this.gamePath.containsPoint(
            pointer.worldX,
            pointer.worldY
        );

        // Verifica se o destino está dentro do alcance da torre.
        const distance = Phaser.Math.Distance.Between(
            this.tower.positionX,
            this.tower.positionY,
            pointer.worldX,
            pointer.worldY
        );

        const isWithinTowerRange =
            distance <= this.tower.range;

        // O modo termina após a tentativa, mesmo se o destino for inválido.
        this.setCommandPointMoveMode(false);

        if (!isOnPath || !isWithinTowerRange) {
            return;
        }

        const moved = this.commandPoint.moveCommandPoint(
            pointer.worldX,
            pointer.worldY
        );
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

        if (
            this.meleeDamage &&
            !this.targetEnemy &&
            this.state === 'idle'
        ) {
            const enemy = this.findTarget(enemies);

            if (enemy && enemy.reserveTroop(this)) {
                this.targetEnemy = enemy;
                this.moveToTarget(enemy);
            }
        }

        if (this.state === 'blocking' && this.targetEnemy?.active) {
            this.updateCombat(delta);
        }

        if (this.state === 'idle' && this.rangedDamage) {
            this.updateRangedCombat(enemies, delta);
        }

        this.setDepth(this.y);

        this.updateVisuals();

        if (this.container && this.active) {
            this.container.setPosition(this.x, this.y + this.size * 2);
        }

        if (this.rangeIndicator) {
            this.rangeIndicator
                .setPosition(this.x, this.y)
                .setDepth(this.y - 1);
        }
    }

    updateRangedCombat(enemies, delta) {
        if (
            !this.active ||
            !this.rangedDamage ||
            this.rangedRange <= 0 ||
            this.rangedCooldown <= 0
        ) {
            return;
        }

        let target = null;
        let closestDistance = Infinity;

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                enemy.x,
                enemy.y
            );

            if (
                distance <= this.rangedRange &&
                distance < closestDistance
            ) {
                target = enemy;
                closestDistance = distance;
            }
        }

        if (!target) {
            // this.rangedAttackTimer = 0;
            return;
        }

        this.rangedAttackTimer += delta;

        const cooldown = this.rangedCooldown * 1000;

        if (this.rangedAttackTimer < cooldown) return;

        this.rangedAttackTimer -= cooldown;

        this.scene.projectileManager.spawn('basic', {
            x: this.x,
            y: this.y,
            target,
            damage: this.rangedDamage,
            speed: this.projectileSpeed,
        });
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
            this.detectionArea.setFillStyle(0x00aaff, 0.03);
            this.detectionArea.setStrokeStyle(2, 0x00aaff, 0.3);
            return;
        }

        if (this.state === 'intercepting') {
            this.detectionArea.setFillStyle(0xffaa00, 0.03);
            this.detectionArea.setStrokeStyle(2, 0xffaa00, 0.3);
            return;
        }
        
        if (this.state === 'returning') {
            this.detectionArea.setFillStyle(0x33cc66, 0.03);
            this.detectionArea.setStrokeStyle(2, 0x33cc66, 0.3);
            return;
        }

        if (this.state === 'blocking') {
            this.detectionArea.setFillStyle(0xff4444, 0.03);
            this.detectionArea.setStrokeStyle(2, 0xff4444, 0.3);
        }

        if (this.health === 0) {
            this.detectionArea.setFillStyle(0x223344, 0.03);
            this.detectionArea.setStrokeStyle(2, 0x223344, 0.3);
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

        if (this.rangeIndicator) {
            this.rangeIndicator.destroy();
            this.rangeIndicator = null;
        }

        this.setCommandPointMoveMode(false);

        super.destroy(fromScene);
    }
}
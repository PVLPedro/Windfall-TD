import * as Phaser from 'phaser';

export default class CombatSystem {

    constructor(scene, enemies = [], troops = []) {

        this.scene = scene;
        this.enemies = enemies;
        this.troops = troops;
    }

    rollDamage(damage) {

        return Phaser.Math.Between(
            damage.min,
            damage.max
        );
    }

    applyDamage(target, amount) {

        if (!target || !target.active) {
            return;
        }

        target.takeDamage(amount);
    }

    dealDamage(target, damage, debuff = null) {

        if (!target || !target.active) {
            return;
        }

        const finalDamage = this.rollDamage(damage);

        this.applyDamage(
            target,
            finalDamage
        );
    }

    // falloff: redução máxima de dano nas bordas da área (0.4 = até 40%).
    // false/null = sem redução.
    dealAreaDamage(x, y, radius, damage, debuff = null, falloff = false) {

        const baseDamage = this.rollDamage(damage);

        this.enemies.forEach(enemy => {

            if (!enemy.active) {
                return;
            }

            const distance = Phaser.Math.Distance.Between(
                x,
                y,
                enemy.x,
                enemy.y
            );

            if (distance > radius) {
                return;
            }

            let finalDamage = baseDamage;

            if (falloff) {

                const damageMultiplier = Math.max(
                    1 - falloff,
                    1 - (distance / radius)
                );

                finalDamage = Math.floor(
                    baseDamage * damageMultiplier
                );
            }

            this.applyDamage(
                enemy,
                finalDamage,
            );

            this.applyDebuff(
                enemy,
                debuff,
            );
        });
    }

    applyDebuff(target, debuff) {

        if (!debuff) return;

        if (debuff.type == 'slowdown') {

            target.speed = target.actualSpeed * (1 - debuff.value);

            this.scene.time.delayedCall(
                debuff.duration * 1000,
                () => {
                    
                    target.speed = target.actualSpeed;
                }
            )
        }
    }
}
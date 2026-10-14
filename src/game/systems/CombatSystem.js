import * as Phaser from 'phaser';

export default class CombatSystem {

    constructor(scene, enemies) {

        this.scene = scene;
        this.enemies = enemies;
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

    dealDamage(target, damage, debuff) {

        if (!target || !target.active) {
            return;
        }

        const finalDamage = this.rollDamage(damage);

        this.applyDamage(
            target,
            finalDamage
        );
    }

    dealAreaDamage(x, y, radius, damage, debuff) {

        const baseDamage = this.rollDamage(damage);

        // console.log(debuff);

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

            if (damage.falloff) {

                const damageMultiplier = Math.max(
                    damage.falloff.minimum,
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

        if (debuff.type == 'slow') {

            target.speed = (target.actualSpeed * debuff.value) / 100;

            this.scene.time.delayedCall(
                debuff.duration * 1000,
                () => {
                    
                    target.speed = target.actualSpeed;
                }
            )
        }
    }
}
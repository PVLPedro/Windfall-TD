import * as Phaser from 'phaser';
import Projectile from '../Projectile';

export default class BombProjectile extends Projectile {

    constructor(
        scene,
        x,
        y,
        target,
        damage,
        speed,
        combatSystem,
        explosionRadius,
        debuff,
    ) {

        super(
            scene,
            x,
            y,
            target,
            damage,
            speed,
            combatSystem
        );

        this.explosionRadius = explosionRadius;
        this.debuff = debuff;

        this.setFillStyle(0xff6600);
    }

    update(delta) {

        if (!this.active) return;

        if (!this.target || !this.target.active) {

            this.destroy();

            return;
        }

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.target.x,
            this.target.y
        );

        if (distance <= 8) {

            this.explode();

            return;
        }

        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.target.x,
            this.target.y
        );

        this.x +=
            Math.cos(angle) *
            this.speed *
            (delta / 1000);

        this.y +=
            Math.sin(angle) *
            this.speed *
            (delta / 1000);
    }

    explode() {

        const explosion = this.scene.add.circle(
            this.x,
            this.y,
            this.explosionRadius,
            0xff6600,
            0.35
        );

        this.scene.tweens.add({

            targets: explosion,

            scale: 1.2,

            alpha: 0,

            duration: 200,

            onComplete: () => {
                explosion.destroy();
            }
        });

        this.combatSystem.dealAreaDamage(
            this.x,
            this.y,
            this.explosionRadius,
            this.damage,
            this.debuff
        );

        this.destroy();
    }
}
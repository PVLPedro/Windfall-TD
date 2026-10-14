import * as Phaser from 'phaser';

export default class Projectile extends Phaser.GameObjects.Arc {

    constructor(
        scene,
        x,
        y,
        target,
        damage,
        speed,
        combatSystem
    ) {

        super(
            scene,
            x,
            y,
            6,
            0,
            360,
            false,
            0xffff00
        );

        this.scene = scene;

        this.target = target;
        this.damage = damage;
        this.speed = speed;

        this.combatSystem = combatSystem;

        scene.add.existing(this);
    }

    update(delta) {

        if (!this.active) return;

        if (!this.target || !this.target.active) {

            this.destroy();

            return;
        }

        const distance =
            Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.target.x,
                this.target.y
            );

        if (distance <= 8) {

            this.combatSystem.dealDamage(
                this.target,
                this.damage
            );

            this.destroy();

            return;
        }

        const angle =
            Phaser.Math.Angle.Between(
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
}
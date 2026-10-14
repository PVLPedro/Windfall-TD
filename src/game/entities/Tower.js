import * as Phaser from 'phaser';

export default class Tower extends Phaser.GameObjects.Rectangle {

    constructor(
        scene,
        x,
        y,
        data,
        enemies,
        projectileManager
    ) {

        super(
            scene,
            x,
            y,
            data.size,
            data.size,
            data.color
        );

        this.scene = scene;

        this.type = data.type;
        this.name = data.name;
        this.icon = data.icon;

        this.size = data.size;
        this.color = data.color;

        this.enemies = enemies;
        this.projectileManager = projectileManager;

        this.cost = data.cost;
        this.range = data.range;
        this.damage = data.damage;
        this.attackCooldown = data.attackCooldown;

        this.debuff = data.debuff;

        this.projectileType = data.projectileType;
        this.projectileSpeed = data.projectileSpeed;
        this.explosionRadius = data.explosionRadius;

        this.target = null;

        scene.add.existing(this);

        this.rangeCircle = scene.add.circle(
            x,
            y,
            this.range,
            this.color,
            0.1
        );

        this.iconCircle = scene.add.circle(
            x,
            y,
            this.size / 2 - 5,
            0xFFFFFF,
            1
        ).setDepth(100);

        this.detail = scene.add.rectangle(
            x,
            y,
            this.size,
            this.size,
            this.color,
            1
        );

        this.towerIcon = scene.add.image(
            x,
            y,
            this.icon
        ).setDepth(100).setOrigin(0.5).setScale(0.06);

        this.towerName = scene.add.text(
            x,
            y + this.size,
            this.name,
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        ).setDepth(100).setOrigin(0.5);
        
        this.detail.angle = 45;

        this.attackEvent = scene.time.addEvent({

            delay: this.attackCooldown,

            loop: true,

            callback: () => {
                this.attack();
            }
        });
    }

    update() {

        this.target = null;

        this.enemies.forEach(enemy => {

            if (!enemy.active) return;

            const distanceToTower =
                Phaser.Math.Distance.Between(
                    this.x,
                    this.y,
                    enemy.x,
                    enemy.y
                );

            if (distanceToTower <= this.range) {

                if (
                    this.target === null ||
                    enemy.pathDistance >
                    this.target.pathDistance
                ) {

                    this.target = enemy;
                }
            }
        });
    }

    attack() {

        if (!this.active) return;

        if (!this.target || !this.target.active) {
            return;
        }

        this.projectileManager.spawn(
            this.projectileType,
            {
                x: this.x,
                y: this.y,
                target: this.target,
                damage: this.damage,
                speed: this.projectileSpeed,
                explosionRadius: this.explosionRadius,
                debuff: this.debuff
            }
        );
    }

    destroy() {

        if (this.attackEvent) {
            this.attackEvent.remove();
        }

        if (this.rangeCircle) {
            this.rangeCircle.destroy();
            this.iconCircle.destroy();
            this.detail.destroy();
            this.towerIcon.destroy();
            this.towerName.destroy();
            this.detail.destroy();
        }

        super.destroy();
    }
}
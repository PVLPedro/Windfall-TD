import * as Phaser from 'phaser';

import { troopTypes } from '../data/troops';
import CommandPoint from './CommandPoint';
import { QUAD } from '../constants/units';

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

        this.positionX = x;
        this.positionY = y;

        this.scene = scene;

        this.type = data.type;
        this.name = data.name;
        this.icon = data.icon;

        this.size = data.size;
        this.color = data.color;

        this.enemies = enemies;
        this.projectileManager = projectileManager;

        this.cost = data.cost;

        // Valores padrão: 0 ou false para o que não for declarado.
        // Torres sem alcance de ataque (range 0) não precisam declarar dano e derivados.
        // Alcances e velocidades vêm em quadrados e são convertidos para pixels aqui.
        this.range = (data.range ?? 0) * QUAD;
        this.troopRange = (data.troopRange ?? 0) * QUAD;

        this.damage = data.damage ?? { min: 0, max: 0 };
        this.damageType = data.damageType ?? false;

        this.attackCooldown = data.attackCooldown ?? 1;

        // Projétil: sem altura = teleguiado (height 0); sem falloff = false.
        const projectile = data.projectile ?? {};

        this.projectile = {
            type: projectile.type ?? 'basic',
            speed: (projectile.speed ?? 30) * QUAD,
            height: (projectile.height ?? 0) * QUAD,
            radius: (projectile.radius ?? 0) * QUAD,
            falloff: projectile.falloff ?? false
        };

        // Efeito negativo: sem cumulative = false.
        this.debuff = data.debuff
            ? { ...data.debuff, cumulative: data.debuff.cumulative ?? false }
            : false;

        this.troops = data.troops ?? false;
        this.commandPoints = [];

        this.spawnTroops();

        this.target = null;

        scene.add.existing(this);

        // Torres sem alcance de ataque mostram o alcance de tropa.
        this.rangeCircle = scene.add.circle(
            x,
            y,
            this.range || this.troopRange,
            this.color,
            0.03
        );

        this.rangeCircle.setStrokeStyle(2, this.color, 0.3);

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

        this.attackEvent = null;

        // Só cria o ciclo de ataque se a torre realmente ataca.
        if (this.canAttack()) {

            this.attackEvent = scene.time.addEvent({

                delay: this.attackCooldown * 1000,

                loop: true,

                callback: () => {
                    this.attack();
                }
            });
        }
    }

    canAttack() {

        return this.range > 0 && this.damage.max > 0;
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

    spawnTroops() {

        if (!this.active || !this.troops) return;
        
        const totalTroops = this.troops.length || 1;
        const intervaloX = 30;

        this.troops.forEach((troop, index) => {
            const deslocamentoX = (index - (totalTroops - 1) / 2) * intervaloX;
            
            const commandPoint = new CommandPoint(
                this.scene,
                this.scene.gamePath,
                this,
                troop,
                this.x + deslocamentoX,
                this.y + 30,
            );

            this.commandPoints.push(commandPoint);
        });
    }

    attack() {

        if (!this.active) return;

        if (!this.target || !this.target.active) {
            return;
        }

        this.projectileManager.spawn(
            this.projectile.type,
            {
                x: this.x,
                y: this.y,
                target: this.target,
                damage: this.damage,
                damageType: this.damageType,
                speed: this.projectile.speed,
                height: this.projectile.height,
                radius: this.projectile.radius,
                falloff: this.projectile.falloff,
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

        this.commandPoints.forEach(commandPoint => {
            commandPoint.destroy();
        })

        super.destroy();
    }
}
import Projectile from '../entities/Projectile';
import BombProjectile from '../entities/projectiles/BombProjectile';

export default class ProjectileManager {

    constructor(scene, combatSystem) {

        this.scene = scene;
        this.combatSystem = combatSystem;

        this.projectiles = [];
    }

    spawn(type, data) {

        let projectile;

        switch (type) {

            case 'basic':

                projectile = new Projectile(
                    this.scene,
                    data.x,
                    data.y,
                    data.target,
                    data.damage,
                    data.speed,
                    this.combatSystem
                );

                break;

            case 'bomb':

                projectile = new BombProjectile(
                    this.scene,
                    data.x,
                    data.y,
                    data.target,
                    data.damage,
                    data.speed,
                    this.combatSystem,
                    data.explosionRadius,
                    data.debuff
                );

                break;

            default:

                console.error(
                    `Tipo de projétil desconhecido: ${type}`
                );

                return null;
        }

        this.projectiles.push(projectile);

        return projectile;
    }

    update(delta) {

        this.projectiles.forEach(projectile => {
            projectile.update(delta);
        });

        this.projectiles = this.projectiles.filter(
            projectile => projectile.active
        );
    }
}
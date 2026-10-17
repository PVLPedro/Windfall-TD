import Projectile from '../entities/Projectile';
import AreaProjectile from '../entities/projectiles/AreaProjectile';

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

            case 'area':

                projectile = new AreaProjectile(
                    this.scene,
                    data.x,
                    data.y,
                    data.target,
                    data.damage,
                    data.speed,
                    this.combatSystem,
                    data.radius,
                    data.debuff,
                    data.falloff
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
import { GameEvents } from '../constants/events';

export default class LifeSystem {

    constructor(scene, initialLives) {

        this.scene = scene;

        this.lives = initialLives;
    }

    emitChange() {

        this.scene.events.emit(
            GameEvents.LIVES_CHANGED,
            this.lives
        );
    }

    loseLife(amount) {

        this.lives -= amount;

        if (this.lives <= 0) {

            this.lives = 0;

            this.emitChange();

            this.scene.scene.start('GameOver');

            return;
        }

        this.emitChange();
    }
}
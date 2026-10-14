import * as Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {

    constructor() {
        super('GameOver');
    }

    create() {

        this.add.text(
            400,
            180,
            'GAME OVER',
            {
                fontSize: '64px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);

        const restartText = this.add.text(
            400,
            320,
            'REINICIAR',
            {
                fontSize: '28px',
                color: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setInteractive();

        restartText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const menuText = this.add.text(
            400,
            400,
            'MENU PRINCIPAL',
            {
                fontSize: '28px',
                color: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setInteractive();

        menuText.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
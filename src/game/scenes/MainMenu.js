import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.cameras.main.setBackgroundColor('#222222');

        this.add.text(
            centerX,
            centerY - 50,
            'KINGDOM DEFENSE',
            {
                fontSize: '48px',
                color: '#ffffff'
            })
        .setOrigin(0.5);

        const startText = this.add.text(
            centerX,
            centerY + 50,
            'CLIQUE PARA INICIAR',
            {
                fontSize: '28px',
                color: '#00ff00'
            })
        .setOrigin(0.5)
        .setInteractive();

        startText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
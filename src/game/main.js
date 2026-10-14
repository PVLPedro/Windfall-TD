import * as Phaser from 'phaser';

import MainMenu from './scenes/MainMenu';
import GameScene from './scenes/GameScene';
import GameOver from './scenes/GameOver';
import HudScene from './scenes/HudScene';

export default function StartGame(parent) {

    const config = {
        type: Phaser.AUTO,

        width: 1920,
        height: 1080,

        backgroundColor: '#423130',
        
        parent: parent,

        scale: {
            mode: Phaser.Scale.EXPAND,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [
            MainMenu,
            GameScene,
            GameOver,
            HudScene,
        ]
    };

    return new Phaser.Game(config);
}
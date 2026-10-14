import * as Phaser from 'phaser';

export default class RunInfoDisplay extends Phaser.GameObjects.Container {

    constructor(scene, x, y, initialLives, initialMoney, currentWave, totalWaves) {
        
        super(scene, x, y);

        this.width = 500;
        this.height = 80;

        scene.add.existing(this);

        this.background = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0x151515,
            0.5
        )

        this.moneyIcon = this.scene.add.image(
            0,
            0,
            'money-icon'
        ).setOrigin(0.5).setScale(0.1);

        this.moneyText = this.scene.add.text(
            0,
            0,
            `${initialMoney}`,
            {
                fontSize: '30px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.livesIcon = this.scene.add.image(
            0,
            0,
            'lives-icon'
        ).setOrigin(0.5).setScale(0.1);
        
        this.livesText = this.scene.add.text(
            0,
            0,
            `${initialLives}`,
            {
                fontSize: '30px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        this.wavesIcon = this.scene.add.image(
            0,
            0,
            'waves-icon'
        ).setOrigin(0.5).setScale(0.1);

        this.wavesText = this.scene.add.text(
            0,
            0,
            `${currentWave}/${totalWaves}`,
            {
                fontSize: '30px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.add([
            this.background,
            this.moneyIcon,
            this.moneyText,
            this.livesIcon,
            this.livesText,
            this.wavesIcon,
            this.wavesText
        ]);

        this.layoutElements();
    }

    
    layoutElements() {

        const columnWidth = this.width / 3;

        const groups = [
            [this.moneyIcon, this.moneyText],
            [this.livesIcon, this.livesText],
            [this.wavesIcon, this.wavesText]
        ];

        groups.forEach((group, index) => {

            const centerX = -this.width / 2 + columnWidth * (index + 0.5);

            const icon = group[0];
            const text = group[1];

            const gap = 6;

            const iconWidth = icon.displayWidth;
            const textWidth = text.width;

            const totalWidth = iconWidth + gap + textWidth;
            const startX = centerX - totalWidth / 2;

            icon.setPosition(
                startX + iconWidth / 2,
                0
            );

            text.setPosition(
                startX + iconWidth + gap + textWidth / 2,
                0
            );
        });
    }

    updateMoney(money) {

        this.moneyText.setText(`${money}`);
    }

    updateLives(lives) {

        this.livesText.setText(`${lives}`);
    }

    updateWaves(info) {

        console.log(info);
        
        this.wavesText.setText(`${info.currentWave}/${info.totalWaves}`);
    }
}

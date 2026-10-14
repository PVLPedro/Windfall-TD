export default class WaveOptions {

    constructor(scene, waveManager) {

        this.scene = scene;

        this.waveManager = waveManager;

        this.container = null;

        this.create();
    }

    create() {

        const info = this.waveManager.getWavesInfo();
        
        if (!info) {
            return;
        }

        this.container = this.scene.add.container(
            0,
            0
        ).setDepth(100);

        const waypoints = [
            { x: this.scene.scale.width * 0.20, y: -20 },
        ];

        const initialPoint = waypoints[0];

        if (initialPoint.x <= 0) {
            initialPoint.x += 200;
        }

        if (initialPoint.y <= 0) {
            initialPoint.y += 200;
        }

        this.button = this.scene.add.text(
            initialPoint.x,
            initialPoint.y,
            `Começar Onda ${info.currentWave}/${info.totalWaves}`,
            {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#555555',
                padding: {
                    x: 10,
                    y: 8
                },
                align: 'center'
            }
        );

        this.button.setOrigin(0.5)
            .setDepth(100)
            .setInteractive();

        this.button.on('pointerdown', () => {

            this.waveManager.startNextWaveEarly();
        });

        this.container.add(this.button);
    }

    show() {

        const info = this.waveManager.getWavesInfo();

        if (!info || info.currentWave >= info.totalWaves) {

            console.log(info);
            
            return;
        }

        this.container.setVisible(true);
    }

    hide() {

        this.container.setVisible(false);
    }

    update() {

        const info = this.waveManager.getEarlyStartInfo();

        if (!info) {
            return;
        }

        this.button.setText(
            `Adiantar Onda ${info.currentWave}/${info.totalWaves} por bônus $\n` +
            `Tempo: ${(
                (info.remainingTime / 1000)
            ).toFixed(0)}s`
        );
    }
}
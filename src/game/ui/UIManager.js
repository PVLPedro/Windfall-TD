import WaveOptions from './WaveOptions';

export default class UIManager {

    constructor(scene, towerManager, waveManager) {

        this.scene = scene;

        this.towerManager = towerManager;

        this.waveManager = waveManager;

        this.waveOptions = new WaveOptions(
            scene,
            waveManager
        );

        this.waveOptions.update();
        
        this.create();
    }

    create() {

        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.update();
            }
        });
    }

    showStartWaveBtn() {

        this.waveOptions.show();
    }

    hideStartWaveBtn() {

        this.waveOptions.hide();
    }

    update() {

        this.waveOptions.update();
    }
}
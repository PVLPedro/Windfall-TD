import * as Phaser from 'phaser';

import { GameEvents } from '../constants/events';

import RunInfoDisplay from '../ui/RunInfoDisplay';
import SelectionPanel from '../ui/SelectionPanel';
import WaveOptions from '../ui/WaveOptions';

export default class HudScene extends Phaser.Scene {

    constructor() {
        super('HudScene');
    }

    init(data) {

        this.gameScene = data.gameScene;
    }

    preload() {

        this.load.path = 'assets/icons/';

        this.load.image('money-icon', 'money-icon.png');
        this.load.image('lives-icon', 'lives-icon.png');
        this.load.image('waves-icon', 'waves-icon.png');

        this.load.path = 'assets/images/';

        this.load.image('run-info-bg', 'run-info-bg.png');
    }

    create() {

        const {
            lifeSystem,
            moneySystem,
            towerManager,
            waveManager
        } = this.gameScene;

        const centerX = this.scale.width / 2;

        this.add.text(
            centerX,
            50,
            'FASE 1',
            {
                fontSize: '32px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.avaliableTroops = this.add.text(
            centerX,
            80,
            `Tropas disponíveis ${this.gameScene.avaliableTroops}`,
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.troopsPositionInfo = this.add.text(
            centerX,
            100,
            `Clique no caminho para posicionar`,
            {
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.troopsRepositionInfo = this.add.text(
            centerX,
            120,
            `Clique nelas para reposicionar`,
            {
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        const info = waveManager.getWavesInfo();

        this.runInfoDisplay = new RunInfoDisplay(
            this,
            this.scale.width - 300,
            100,
            lifeSystem.lives,
            moneySystem.money,
            info.currentWave,
            info.totalWaves
        );

        this.waveOptions = new WaveOptions(
            this,
            waveManager
        );

        this.selectionPanel = new SelectionPanel(
            this,
            towerManager
        );

        this.bindGameEvents();
    }

    bindGameEvents() {

        const gameEvents = this.gameScene.events;

        const listeners = {

            [GameEvents.LIVES_CHANGED]: lives =>
                this.runInfoDisplay.updateLives(lives),

            [GameEvents.MONEY_CHANGED]: money =>
                this.runInfoDisplay.updateMoney(money),

            [GameEvents.SLOT_CLICKED]: slot =>
                this.selectionPanel.showSlot(slot),

            [GameEvents.TOWER_CLICKED]: tower =>
                this.selectionPanel.showTower(tower),

            [GameEvents.ENTITY_CLICKED]: entity =>
                this.selectionPanel.showEntity(entity),

            [GameEvents.WAVE_STARTED]: info => {
                this.runInfoDisplay.updateWaves(info);
                this.waveOptions.hide();
            },

            [GameEvents.WAVE_FINISHED]: () =>
                this.waveOptions.show(),
        };

        Object.entries(listeners).forEach(([event, listener]) => {
            gameEvents.on(event, listener);
        });

        this.events.once('shutdown', () => {

            Object.entries(listeners).forEach(([event, listener]) => {
                gameEvents.off(event, listener);
            });

        });
    }

    update() {

        this.selectionPanel.update();

        this.waveOptions.update();

        this.avaliableTroops.setText(
            `Tropas disponíveis ${this.gameScene.avaliableTroops}`
        )
    }
}
import EnemySpawner from './EnemySpawner';
import { GameEvents } from '../constants/events';

export default class WaveManager {

    constructor(scene, gamePath, waves) {

        this.scene = scene;
        this.waves = waves;
        this.gamePath = gamePath;

        this.currentWave = 0;

        this.enemySpawner = new EnemySpawner(
            this.scene,
            this.gamePath
        );

        this.nextWaveTimer = null;

        this.defaultEarlyStartReward = 25;
        this.minimumEarlyStartReward = 3;
        this.currentEarlyStartReward = 0;

        this.nextWaveStartTime = null;
        this.nextWaveDelay = 0;
    }

    startWave() {

        if (this.currentWave >= this.waves.length) {
            return;
        }

        const wave = this.waves[this.currentWave];

        this.enemySpawner.spawnGroups(
            wave.groups,
            wave.groupInterval * 1000,
            wave.repeats,
            () => {
                this.finishWave();
            },
            wave.lanesOrder ?? []
        );

        const info = this.getWavesInfo();

        info.currentWave++

        this.scene.events.emit(
            GameEvents.WAVE_STARTED,
            info
        );
    }

    finishWave() {

        if (this.currentWave >= this.waves.length) {
            return;
        }

        const wave = this.waves[this.currentWave];

        const info = this.getEarlyStartInfo();

        this.currentWave++;

        this.nextWaveStartTime =
            this.scene.time.now;

        this.nextWaveDelay =
            wave.nextWaveDelay * 1000;

        this.scene.events.emit(
            GameEvents.WAVE_FINISHED,
            info,
        );

        this.nextWaveTimer =
            this.scene.time.delayedCall(
                this.nextWaveDelay,
                () => {

                    this.nextWaveTimer = null;

                    this.startWave();
                }
            );
    }

    startNextWaveEarly() {

        if (!this.nextWaveTimer) {
            this.startWave();
            return;
        }

        const info = this.getEarlyStartInfo();
        
        this.nextWaveTimer.remove();

        this.nextWaveTimer = null;

        this.scene.moneySystem.gainMoney(
            info.reward
        );

        this.startWave();
    }

    getWavesInfo() {

        return {
            currentWave: this.currentWave,
            totalWaves: this.waves.length
        };
    }

    getEarlyStartInfo() {

        if (!this.nextWaveTimer) {
            return null;
        }

        const wave = this.waves[
            this.currentWave - 1
        ];

        const initialReward =
            wave.earlyStartReward ??
            this.defaultEarlyStartReward;

        const elapsed =
            this.scene.time.now -
            this.nextWaveStartTime;

        const remaining =
            Math.max(
                0,
                this.nextWaveDelay - elapsed
            );

        const reward = Math.floor(
            initialReward *
            (remaining / this.nextWaveDelay)
        );

        const finalReward = Math.max(
            this.minimumEarlyStartReward,
            reward
        );

        return {
            reward: finalReward,
            remainingTime: remaining,
            currentWave: this.currentWave,
            totalWaves: this.waves.length
        };
    }

    update(delta) {

        this.enemySpawner.update(delta);
    }
}
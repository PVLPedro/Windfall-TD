import * as Phaser from 'phaser';

import LifeSystem from '../systems/LifeSystem';
import MoneySystem from '../systems/MoneySystem';
import WaveManager from '../systems/WaveManager';
import SlotManager from '../systems/SlotManager';
import ProjectileManager from '../systems/ProjectileManager';
import TowerManager from '../systems/TowerManager';
import CombatSystem from '../systems/CombatSystem';
import GamePath from '../paths/GamePath';
import Troop from '../entities/Troop';
import CommandPoint from '../entities/CommandPoint';

import { waves } from '../data/waves';
// import { slots } from '../data/levels';
import { slotSpecs, generateSlots } from '../data/levels';
import { drawPath } from '../utils/drawPath';
import { createPathBoundsPolygon } from '../utils/createPathBoundsPolygon';
import { buildRoundedPath } from '../utils/buildRoundedPath';

export default class GameScene extends Phaser.Scene {

    constructor() {

        super('GameScene');
    }

    preload() {

        this.load.path = 'assets/icons/';

        this.load.image('nature', 'nature-icon.png');
        this.load.image('magic', 'magic-icon.png');
        this.load.image('industrial', 'industrial-icon.png');
        this.load.image('alchemy', 'alchemy-icon.png');
        this.load.image('resistence', 'resistence-icon.png');
        this.load.image('mad', 'mad-icon.png');

        this.load.path = 'assets/images/';

        this.load.image('slot', 'slot.webp');
    }

    create() {

        this.cameras.main.setBackgroundColor('#423130');

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.width = this.scale.width;
        this.height = this.scale.height;

        // =========================
        // CAMINHO
        // =========================

        const W = this.scale.width;
        const H = this.scale.height;

        const waypoints = [
            { x: W * 0.20, y: -20 },
            { x: W * 0.20, y: H * 0.25 },
            { x: W * 0.75, y: H * 0.25, radius: 120 },
            { x: W * 0.75, y: H * 0.50 },
            { x: W * 0.30, y: H * 0.50 },
            { x: W * 0.30, y: H * 0.75, radius: 60 },
            { x: W * 0.60, y: H * 0.75 },
            { x: W * 0.85, y: H * 0.60 },
            { x: W + 20,   y: H * 0.60 }
        ];

        
        const gamePath = new GamePath(this, waypoints, {
            width: 44,
            hitAreaPadding: 5,
            defaultRadius: 90,
            drawPoints: 64,
            hitAreaDivisions: 64,
            color: 0x8a6d46,
            alpha: 1,
            depth: 0
        });

        gamePath.setInteractive();

        this.path = gamePath.path;
        this.gamePath = gamePath;

        const distance = gamePath.getLength() * 0.5;

        // Posição no centro da estrada
        const center = gamePath.getPointAtDistance(distance);

        // Posições nas três linhas
        const laneA = gamePath.getLanePosition(distance, -1, 12);
        const laneB = gamePath.getLanePosition(distance, 0, 12);
        const laneC = gamePath.getLanePosition(distance, 1, 12);

        console.log('Comprimento:', gamePath.getLength());
        console.log('Centro:', center);
        console.log('Linha -1:', laneA);
        console.log('Linha 0:', laneB);
        console.log('Linha 1:', laneC);

        this.avaliableTroops = 4;

        this.commandPoints = [];
        this.troops = [];

        this.gamePath.on('pointerdown', pointer => {

            if (this.avaliableTroops > 0) {

                const commandPoint = new CommandPoint(
                    this,
                    pointer.worldX,
                    pointer.worldY,
                    80
                );

                const troop = new Troop(this, commandPoint);

                this.commandPoints.push(commandPoint);
                this.troops.push(troop);

                troop.setInteractive(
                    new Phaser.Geom.Rectangle(0, 0, troop.width, troop.height), 
                    Phaser.Geom.Rectangle.Contains
                );
                
                troop.on('pointerdown', () => {

                    troop.destroy();
                    commandPoint.destroy();

                    ++this.avaliableTroops;
                })

                --this.avaliableTroops;
            }
        });

        // Debug: marca os pontos de virada
        // const DEBUG_PATH = true;

        // if (DEBUG_PATH) {
        //     waypoints.forEach((point, index) => {
        //         this.add.circle(point.x, point.y, 8, 0x00ff00).setDepth(1);

        //         this.add.text(point.x, point.y - 25, `${index}`, {
        //             fontSize: '16px',
        //             color: '#ffffff'
        //         }).setOrigin(0.5).setDepth(1);
        //     });
        // }

        // VIDAS

        this.lifeSystem = new LifeSystem(
            this,
            20
        );

        // DINHEIRO

        this.moneySystem = new MoneySystem(
            this,
            225,
            0.75
        );

        // WAVES

        this.waveManager = new WaveManager(
            this,
            this.gamePath,
            waves,
        );

        // COMBATE

        this.combatSystem = new CombatSystem(
            this,
            this.waveManager.enemySpawner.enemies
        );

        // TORRES e PROJÉTEIS

        this.projectileManager = new ProjectileManager(
            this,
            this.combatSystem
        );

        this.towerManager = new TowerManager(
            this,
            this.waveManager.enemySpawner.enemies,
            this.projectileManager
        );

        // SLOTS

        const slots = generateSlots(this.path, slotSpecs, {
            width: this.scale.width,
            height: this.scale.height
        });

        this.slotManager = new SlotManager(
            this,
            slots,
            this.towerManager
        );

        this.towerManager.setSlotManager(
            this.slotManager
        );

        // HUD

        this.scene.launch('HudScene', { 
            gameScene: this
        });

        this.events.once('shutdown', () => {
            this.scene.stop('HudScene');
        });
    }


    update(time, delta) {

        this.waveManager.update(delta);

        this.towerManager.update(delta);

        this.projectileManager.update(delta);

        const enemies = this.waveManager.enemySpawner.enemies;

        this.troops.forEach(troop => {
            troop.update(enemies);
        });
    }
}
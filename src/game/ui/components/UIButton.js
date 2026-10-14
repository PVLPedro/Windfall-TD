import * as Phaser from 'phaser';

export default class UIButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, width, height, text, options = {}) {

        super(scene, x, y);

        this.scene = scene;

        this.buttonWidth = width;
        this.buttonHeight = height;

        this.enabled = true;
        this.selected = false;
        this.isPointerDown = false;

        this.options = {
            backgroundColor: 0x34414a,
            hoverColor: 0x465660,
            pressedColor: 0x26343b,
            selectedColor: 0x547943,

            textColor: '#ffffff',
            fontSize: '16px',
            fontStyle: 'bold',

            disabledAlpha: 0.45,

            onClick: null,

            ...options
        };

        scene.add.existing(this);

        this.create(text);
    }

    create(text) {

        this.background = this.scene.add.rectangle(
            0,
            0,
            this.buttonWidth,
            this.buttonHeight,
            this.options.backgroundColor
        );

        this.label = this.scene.add.text(
            0,
            0,
            text,
            {
                fontSize: this.options.fontSize,
                fontStyle: this.options.fontStyle,
                color: this.options.textColor,
                align: 'center',
                wordWrap: {
                    width: this.buttonWidth - 12
                }
            }
        ).setOrigin(0.5);

        this.add([
            this.background,
            this.label
        ]);

        this.hitArea = new Phaser.Geom.Rectangle(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight
        );

        this.setInteractive(
            this.hitArea,
            Phaser.Geom.Rectangle.Contains
        );

        if (this.input) {
            this.input.cursor = 'pointer';
        }

        this.bindEvents();
    }

    bindEvents() {

        this.on('pointerover', () => {

            if (!this.enabled) return;

            this.background.setFillStyle(
                this.options.hoverColor
            );
        });

        this.on('pointerout', () => {

            this.isPointerDown = false;

            if (!this.enabled) return;

            this.updateAppearance();
        });

        this.on('pointerdown', () => {

            if (!this.enabled) return;

            this.isPointerDown = true;

            this.background.setFillStyle(
                this.options.pressedColor
            );
        });

        this.on('pointerup', () => {

            const wasPressed = this.isPointerDown;

            this.isPointerDown = false;

            if (!this.enabled) return;

            this.background.setFillStyle(
                this.selected
                    ? this.options.selectedColor
                    : this.options.hoverColor
            );

            if (
                wasPressed &&
                typeof this.options.onClick === 'function'
            ) {
                this.options.onClick();
            }
        });
    }

    updateAppearance() {

        const color = this.selected
            ? this.options.selectedColor
            : this.options.backgroundColor;

        this.background.setFillStyle(color);
    }

    setSelected(selected) {

        this.selected = selected;

        if (this.enabled) {
            this.updateAppearance();
        }

        return this;
    }

    setEnabled(enabled) {

        this.enabled = enabled;

        if (enabled) {

            this.setInteractive(
                this.hitArea,
                Phaser.Geom.Rectangle.Contains
            );

            if (this.input) {
                this.input.cursor = 'pointer';
            }

            this.setAlpha(1);

            this.updateAppearance();

        } else {

            this.disableInteractive();

            this.setAlpha(this.options.disabledAlpha);
        }

        return this;
    }

    setText(text) {

        this.label.setText(text);

        return this;
    }
}
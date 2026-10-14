
export default class SelectionHighlight {

    constructor(scene) {

        this.scene = scene;
        this.selectedObject = null;
        this.shape = 'rectangle';

        this.padding = 5;
        this.color = 0x7CDE54;
        this.lineWidth = 3;

        this.graphics = scene.add.graphics()
            .setDepth(90)
            .setVisible(false);
    }

    select(object, shape = 'rectangle') {

        this.selectedObject = object;
        this.shape = shape;

        this.graphics.setVisible(true);

        this.update();
    }

    update() {

        const object = this.selectedObject;

        if (!object || !object.active) {
            this.clear();
            return;
        }

        const graphics = this.graphics;

        graphics.clear();

        graphics.lineStyle(
            this.lineWidth,
            this.color,
            1
        );

        graphics.setPosition(object.x, object.y);

        if (this.shape === 'circle') {

            const radius =
                (object.displayWidth || 32) / 2;

            graphics.strokeCircle(
                0,
                0,
                radius + this.padding
            );

        } else {

            const width =
                object.displayWidth || 32;

            const height =
                object.displayHeight || 32;

            graphics.strokeRect(
                -width / 2 - this.padding,
                -height / 2 - this.padding,
                width + this.padding * 2,
                height + this.padding * 2
            );
        }
    }

    clear() {

        this.selectedObject = null;

        this.graphics.clear();
        this.graphics.setVisible(false);
    }

    destroy() {

        this.graphics.destroy();

        this.selectedObject = null;
    }
}

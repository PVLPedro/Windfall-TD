
import * as Phaser from 'phaser';

export default class GamePath {
    constructor(scene, waypoints, options = {}) {
        this.scene = scene;
        this.waypoints = waypoints;

        this.width = options.width ?? 44;
        this.hitAreaPadding = options.hitAreaPadding ?? 5;
        this.defaultRadius = options.defaultRadius ?? 90;

        this.drawPoints = options.drawPoints ?? 64;
        this.hitAreaDivisions = options.hitAreaDivisions ?? 64;

        this.color = options.color ?? 0x8a6d46;
        this.alpha = options.alpha ?? 1;
        this.depth = options.depth ?? 0;

        this.cacheDivisions = options.cacheDivisions ?? 512;

        this.path = this.buildGeometry();

        this.buildGeometryCache();

        this.graphics = this.draw();

        this.hitPolygon = this.createHitArea();
    }

    buildGeometry() {
        const points = this.waypoints;

        if (!points || points.length < 2) {
            throw new Error(
                'GamePath precisa de pelo menos dois waypoints.'
            );
        }

        const path = new Phaser.Curves.Path(
            points[0].x,
            points[0].y
        );

        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];

            const toPrev = new Phaser.Math.Vector2(
                prev.x - curr.x,
                prev.y - curr.y
            );

            const toNext = new Phaser.Math.Vector2(
                next.x - curr.x,
                next.y - curr.y
            );

            const radius = Math.min(
                curr.radius ?? this.defaultRadius,
                toPrev.length() / 2,
                toNext.length() / 2
            );

            const start = new Phaser.Math.Vector2(
                curr.x,
                curr.y
            ).add(toPrev.normalize().scale(radius));

            const end = new Phaser.Math.Vector2(
                curr.x,
                curr.y
            ).add(toNext.normalize().scale(radius));

            path.lineTo(start.x, start.y);

            path.quadraticBezierTo(
                end.x,
                end.y,
                curr.x,
                curr.y
            );
        }

        const last = points[points.length - 1];

        path.lineTo(last.x, last.y);

        return path;
    }

    buildGeometryCache() {
        const divisions = Math.max(
            2,
            Math.floor(this.cacheDivisions)
        );

        this.samples = [];
        let cumulativeDistance = 0;
        let previousPoint = null;

        for (let i = 0; i <= divisions; i++) {
            const t = i / divisions;
            const point = this.path.getPoint(t);

            if (previousPoint) {
                cumulativeDistance += Phaser.Math.Distance.Between(
                    previousPoint.x,
                    previousPoint.y,
                    point.x,
                    point.y
                );
            }

            this.samples.push({
                t,
                x: point.x,
                y: point.y,
                distance: cumulativeDistance
            });

            previousPoint = point;
        }

        this.length = cumulativeDistance;

        for (let i = 0; i < this.samples.length; i++) {
            const previous = this.samples[
                Math.max(0, i - 1)
            ];

            const next = this.samples[
                Math.min(this.samples.length - 1, i + 1)
            ];

            const tangent = new Phaser.Math.Vector2(
                next.x - previous.x,
                next.y - previous.y
            );

            if (tangent.lengthSq() > 0) {
                tangent.normalize();
            } else {
                tangent.set(0, 0);
            }

            const normal = new Phaser.Math.Vector2(
                -tangent.y,
                tangent.x
            );

            this.samples[i].tangent = tangent;
            this.samples[i].normal = normal;
        }
    }

    getSamplesAtDistance(distance) {
        const target = Phaser.Math.Clamp(
            distance,
            0,
            this.length
        );

        let low = 0;
        let high = this.samples.length - 1;

        while (low < high) {
            const middle = Math.floor((low + high) / 2);

            if (this.samples[middle].distance < target) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }

        const nextIndex = low;
        const previousIndex = Math.max(0, nextIndex - 1);

        const a = this.samples[previousIndex];
        const b = this.samples[nextIndex];

        const segmentLength = b.distance - a.distance;

        const t = segmentLength > 0
            ? (target - a.distance) / segmentLength
            : 0;

        return { a, b, t };
    }

    getPointAtDistance(distance) {
        const { a, b, t } = this.getSamplesAtDistance(distance);

        return new Phaser.Math.Vector2(
            Phaser.Math.Linear(a.x, b.x, t),
            Phaser.Math.Linear(a.y, b.y, t)
        );
    }

    getTangentAtDistance(distance) {
        const { a, b, t } = this.getSamplesAtDistance(distance);

        const tangent = new Phaser.Math.Vector2(
            Phaser.Math.Linear(
                a.tangent.x,
                b.tangent.x,
                t
            ),
            Phaser.Math.Linear(
                a.tangent.y,
                b.tangent.y,
                t
            )
        );

        if (tangent.lengthSq() > 0) {
            tangent.normalize();
        }

        return tangent;
    }

    getNormalAtDistance(distance) {
        const tangent = this.getTangentAtDistance(distance);

        return new Phaser.Math.Vector2(
            -tangent.y,
            tangent.x
        );
    }

    // lane: -1 (esquerda), 0 (centro), 1 (direita).
    getLanePosition(distance, lane = 0, laneSpacing = 12) {
        const point = this.getPointAtDistance(distance);
        const normal = this.getNormalAtDistance(distance);

        return point.add(
            normal.scale(lane * laneSpacing)
        );
    }

    getLength() {
        return this.length;
    }

    draw() {
        const graphics = this.scene.add.graphics();

        graphics.setDepth(this.depth);

        graphics.lineStyle(
            this.width,
            this.color,
            this.alpha
        );

        this.path.draw(graphics, this.drawPoints);

        return graphics;
    }

    createHitArea() {
        const halfWidth = (
            this.width + this.hitAreaPadding
        ) / 2;

        const leftPoints = [];
        const rightPoints = [];

        for (
            let i = 0;
            i <= this.hitAreaDivisions;
            i++
        ) {
            const t = i / this.hitAreaDivisions;

            const point = this.path.getPoint(t);
            const tangent = this.path.getTangent(t);

            const normal = new Phaser.Math.Vector2(
                -tangent.y,
                tangent.x
            ).normalize();

            leftPoints.push(
                new Phaser.Math.Vector2(
                    point.x + normal.x * halfWidth,
                    point.y + normal.y * halfWidth
                )
            );

            rightPoints.unshift(
                new Phaser.Math.Vector2(
                    point.x - normal.x * halfWidth,
                    point.y - normal.y * halfWidth
                )
            );
        }

        return new Phaser.Geom.Polygon([
            ...leftPoints,
            ...rightPoints
        ]);
    }

    containsPoint(x, y) {
        return Phaser.Geom.Polygon.Contains(
            this.hitPolygon,
            x,
            y
        );
    }

    setInteractive() {
        this.graphics.setInteractive(
            this.hitPolygon,
            Phaser.Geom.Polygon.Contains
        );

        return this;
    }

    on(event, callback, context) {
        this.graphics.on(event, callback, context);

        return this;
    }

    off(event, callback, context) {
        this.graphics.off(event, callback, context);

        return this;
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }

        this.samples = [];
        this.hitPolygon = null;
        this.path = null;
    }
}

import * as Phaser from 'phaser';

export function buildRoundedPath(points, defaultRadius = 80) {
    const path = new Phaser.Curves.Path(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const toPrev = new Phaser.Math.Vector2(prev.x - curr.x, prev.y - curr.y);
        const toNext = new Phaser.Math.Vector2(next.x - curr.x, next.y - curr.y);

        const radius = Math.min(
            curr.radius ?? defaultRadius,
            toPrev.length() / 2,
            toNext.length() / 2
        );

        const start = new Phaser.Math.Vector2(curr.x, curr.y)
            .add(toPrev.normalize().scale(radius));
        const end = new Phaser.Math.Vector2(curr.x, curr.y)
            .add(toNext.normalize().scale(radius));

        path.lineTo(start.x, start.y);
        path.quadraticBezierTo(end.x, end.y, curr.x, curr.y);
    }

    const last = points[points.length - 1];
    path.lineTo(last.x, last.y);

    return path;
}
import * as Phaser from 'phaser';

export function createPathBoundsPolygon(path, width, divisions = 64) {

    const halfWidth = width / 2;
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i <= divisions; i++) {
        const t = i / divisions;
        
        const point = path.getPoint(t);
        
        const tangent = path.getTangent(t);

        const normal = new Phaser.Math.Vector2(-tangent.y, tangent.x).normalize();

        const leftX = point.x + normal.x * halfWidth;
        const leftY = point.y + normal.y * halfWidth;
        
        const rightX = point.x - normal.x * halfWidth;
        const rightY = point.y - normal.y * halfWidth;

        leftPoints.push(new Phaser.Math.Vector2(leftX, leftY));
        
        rightPoints.unshift(new Phaser.Math.Vector2(rightX, rightY));
    }

    const allPoints = leftPoints.concat(rightPoints);

    return new Phaser.Geom.Polygon(allPoints);
}

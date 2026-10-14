import * as Phaser from 'phaser';

export function drawPath(visualPath, path, pointsTotal, specs ){

    visualPath.lineStyle(specs.width, specs.color, specs.alpha);
    
    path.draw(visualPath, pointsTotal);
}
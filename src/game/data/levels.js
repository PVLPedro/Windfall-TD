// export const slots = [
//     {
//         x: 250,
//         y: 200,
//     },
//     {
//         x: 550,
//         y: 350,
//     }
// ]

import * as Phaser from 'phaser';

export const slotSpecs = [
    { t: 0.1, side: 1 },
    { t: 0.14, side: -1 },
    { t: 0.2, side: -1 },
    { t: 0.25, side: 1 },
    { t: 0.3, side: -1, },
    { t: 0.35, side: 1, },
    { t: 0.4, side: -1 },
    { t: 0.45, side: 1 },
    { t: 0.5, side: -1 },
    { t: 0.55, side: 1 },
    { t: 0.6, side: -1 },
    { t: 0.65, side: -1 },
    { t: 0.7, side: 1 },
    { t: 0.75, side: 1 },
    { t: 0.8, side: -1 },
    { t: 0.85, side: 1 },
    { t: 0.9, side:-1 },
    { t: 0.95, side: -1 },
];

export function generateSlots(path, specs, {
    width,
    height,
    defaultOffset = 70,   // distância do centro da estrada até o slot
    roadHalfWidth = 22,   // metade da largura da estrada (44 / 2)
    slotRadius = 22,      // "tamanho" do slot
    margin = 30,          // distância mínima das bordas da tela
    minSlotGap = 70       // distância mínima entre slots
} = {}) {
    const roadPoints = path.getPoints(300);
    const minRoadDist = roadHalfWidth + slotRadius + 6;
    const result = [];

    const isValid = (x, y) => {
        // dentro da tela
        if (x < margin || x > width - margin || y < margin || y > height - margin) return false;

        // longe o bastante de qualquer trecho da estrada (inclusive de outras partes dela)
        for (const p of roadPoints) {
            if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < minRoadDist) return false;
        }

        // longe de outros slots
        for (const s of result) {
            if (Phaser.Math.Distance.Between(x, y, s.x, s.y) < minSlotGap) return false;
        }

        return true;
    };

    specs.forEach(spec => {
        const point = path.getPoint(spec.t);
        const tangent = path.getTangent(spec.t);

        // normal = tangente rotacionada 90°
        const nx = -tangent.y;
        const ny = tangent.x;

        const offset = spec.offset ?? defaultOffset;

        // tenta o lado pedido; se não couber, tenta o outro
        for (const side of [spec.side, -spec.side]) {
            const x = point.x + nx * side * offset;
            const y = point.y + ny * side * offset;

            if (isValid(x, y)) {
                result.push({ x: Math.round(x), y: Math.round(y) });
                return;
            }
        }

        console.warn(`Slot em t=${spec.t} não coube em nenhum lado, ignorado.`);
    });

    return result;
}
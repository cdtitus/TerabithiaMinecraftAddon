import {
    VECTOR3_UP,
    Vector3Utils,
} from '@minecraft/math';
import {
    Block,
    BlockPermutation,
    Dimension,
    ItemComponentCompleteUseEvent,
    ItemCustomComponent,
    MolangVariableMap,
    Vector3
} from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

export class SnowBlowerComponent implements ItemCustomComponent {
    constructor() {
        this.onCompleteUse = this.onCompleteUse.bind(this);
    }

    onCompleteUse(event: ItemComponentCompleteUseEvent): void {
        const dimension = event.source.dimension;
        const viewDir = event.source.getViewDirection();
        const forward: Vector3 = { x: viewDir.x, y: 0, z: viewDir.z };
        const variables = new MolangVariableMap();
        let origin = event.source.getHeadLocation();
        origin.y -= 2;
    
        this._playAnimation(dimension, this._getConePoints(origin, forward, 15, 10, 2), 'minecraft:snowflake_particle', variables);
        this._removeSnow(dimension, this._getConePoints(origin, forward, 15, 10, 10));
    }

    private _getConePoints(origin: Vector3, forward: Vector3, distance: number, spread: number, density: number) {
        const right = Vector3Utils.cross(forward, VECTOR3_UP);
        const points: Vector3[] = [];

        for (let row = 0; row <= distance * density; row++) {
            for (let column = 0; column <= spread * density; column++) {
                const rowOffset = row / density;
                let point = Vector3Utils.add(origin, Vector3Utils.scale(forward, rowOffset));
                const columnWidth = rowOffset / distance;
                const columnOffset = ((spread - 1) / -2) * columnWidth + (column / density) * columnWidth;

                point = Vector3Utils.add(point, Vector3Utils.scale(right, columnOffset));

                points.push(point);
            }
        }

        return points;
    }
      
    private _getBlocksBelowPoints(dimension: Dimension, points: Vector3[], maxOffset: number) {
        const blocks: Block[] = [];

        for (const point of points) {
            let offset = 0;
            let block = dimension.getBlock(point);

            while (block && block.matches(MinecraftBlockTypes.Air) && offset < 10) {
                offset++;
                const offsetPoint = Vector3Utils.add(point, { x: 0, y: -offset, z: 0 });
                block = dimension.getBlock(offsetPoint);
            }

            if (!block)
                continue;

            blocks.push(block);
        }

        return blocks.values();
      }
      
    private _playAnimation(dimension: Dimension, points: Vector3[], particle: string, variables: MolangVariableMap) {
        points.forEach((point) => dimension.spawnParticle(particle, point, variables));
    }
      
    private _removeSnow(dimension: Dimension, points: Vector3[]) {
        const blocks = this._getBlocksBelowPoints(dimension, points, 10);
        for (const block of blocks) {
            if (block && block.permutation.matches(MinecraftBlockTypes.SnowLayer))
                block.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Air));
        }    
    }
}

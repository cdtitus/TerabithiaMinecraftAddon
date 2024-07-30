import { BlockComponentStepOnEvent, BlockCustomComponent, BlockPermutation } from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

export class TestComponent implements BlockCustomComponent {
    constructor() {
        this.onStepOn = this.onStepOn.bind(this);
    }

    onStepOn(e: BlockComponentStepOnEvent): void {
        e.block.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Air));
    }
}

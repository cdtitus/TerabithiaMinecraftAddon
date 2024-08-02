import {
    Block,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';
import { BlockService } from './block.service';

export class TableComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    onPlace(event: BlockComponentOnPlaceEvent): void {
        const permutation = event.block.permutation;
        const direction = <string>permutation.getState('minecraft:cardinal_direction');

        this._setBlockPermutation(event.block, direction);
        this._setAdjacentBlockPermutations(event.block, permutation.type.id, direction);
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const permutation = event.destroyedBlockPermutation;
        const direction = <string>permutation.getState('minecraft:cardinal_direction');

        this._setAdjacentBlockPermutations(event.block, permutation.type.id, direction);
    }

    private _setBlockPermutation(block: Block, blockDirection: string): void {
        const states = {
            'tma:table_state': this._resolveTableState(block, blockDirection),
            'minecraft:cardinal_direction': blockDirection,
        };
        block.setPermutation(BlockPermutation.resolve(block.typeId, states));
    }

    private _setAdjacentBlockPermutations(block: Block, blockType: string, blockDirection: string): void {
        const leftBlock = BlockService.getLeftBlock(block, blockDirection);
        if (leftBlock?.typeId === blockType)
            this._setBlockPermutation(leftBlock, blockDirection);

        const rightBlock = BlockService.getRightBlock(block, blockDirection);
        if (rightBlock?.typeId === blockType)
            this._setBlockPermutation(rightBlock, blockDirection);
    }

    private _resolveTableState(block: Block, blockDirection: string): string {
        const leftBlock = BlockService.getLeftBlock(block, blockDirection);
        const rightBlock = BlockService.getRightBlock(block, blockDirection);
        
        let state = 'single';
        if (rightBlock?.typeId === block.typeId)
            state = 'left';
        if (leftBlock?.typeId === block.typeId)
            state = 'right';

        return state;
    }
}

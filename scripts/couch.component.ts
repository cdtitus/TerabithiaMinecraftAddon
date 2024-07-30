import {
    Block,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';

export class CouchComponent implements BlockCustomComponent {
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
            'tma:couch_state': this._resolveCouchState(block, blockDirection),
            'minecraft:cardinal_direction': blockDirection,
        };
        block.setPermutation(BlockPermutation.resolve(block.typeId, states));
    }

    private _setAdjacentBlockPermutations(block: Block, blockType: string, blockDirection: string): void {
        const leftBlock = this._getLeftBlock(block, blockDirection);
        if (leftBlock?.typeId === blockType)
            this._setBlockPermutation(leftBlock, blockDirection);

        const rightBlock = this._getRightBlock(block, blockDirection);
        if (rightBlock?.typeId === blockType)
            this._setBlockPermutation(rightBlock, blockDirection);
    }

    private _resolveCouchState(block: Block, blockDirection: string): string {
        const leftBlock = this._getLeftBlock(block, blockDirection);
        const rightBlock = this._getRightBlock(block, blockDirection);
        
        let state = 'left';
        if (leftBlock?.typeId === block.typeId && rightBlock?.typeId === block.typeId)
            state = 'middle';
        if (leftBlock?.typeId === block.typeId && rightBlock?.typeId !== block.typeId)
            state = 'right';

        return state;
    }

    private _getLeftBlock(block: Block, blockDirection: string): Block | undefined {
        switch (blockDirection) {
            case 'north':
                return block.west();
            case 'east':
                return block.north();
            case 'south':
                return block.east();
            case 'west':
                return block.south();
        }
    }

    private _getRightBlock(block: Block, blockDirection: string): Block | undefined {
        switch (blockDirection) {
            case 'north':
                return block.east();
            case 'east':
                return block.south();
            case 'south':
                return block.west();
            case 'west':
                return block.north();
        }
    }
}

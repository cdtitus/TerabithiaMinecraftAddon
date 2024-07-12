import {
    Block,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';

const COUCH: string = 'tma:couch';

export class CouchBlockComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    onPlace(event: BlockComponentOnPlaceEvent): void {
        const permutation = event.block.permutation;
        const direction = <string>permutation.getState('minecraft:cardinal_direction');

        this._setBlockPermutation(event.block, direction);
        this._setAdjacentBlockPermutations(event.block, direction);
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const permutation = event.destroyedBlockPermutation;
        const direction = <string>permutation.getState('minecraft:cardinal_direction');

        this._setAdjacentBlockPermutations(event.block, direction);
    }

    private _setBlockPermutation(block: Block, blockDirection: string): void {
        if (block.typeId === COUCH) {   
            const states = {
                'tma:couch_state': this._resolveCouchState(block, blockDirection),
                'minecraft:cardinal_direction': blockDirection,
            };
            block.setPermutation(BlockPermutation.resolve(COUCH, states));
        }
    }

    private _setAdjacentBlockPermutations(block: Block, blockDirection: string): void {
        const leftBlock = this._getLeftBlock(block, blockDirection);
        const rightBlock = this._getRightBlock(block, blockDirection);

        this._setBlockPermutation(<Block>leftBlock, blockDirection);
        this._setBlockPermutation(<Block>rightBlock, blockDirection);
    }

    private _resolveCouchState(block: Block, blockDirection: string): string {
        const leftBlock = this._getLeftBlock(block, blockDirection);
        const rightBlock = this._getRightBlock(block, blockDirection);
        
        let state = 'left';
        if (leftBlock?.typeId === COUCH && rightBlock?.typeId === COUCH)
            state = 'middle';
        if (leftBlock?.typeId === COUCH && rightBlock?.typeId !== COUCH)
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

import { Block } from '@minecraft/server';

export class BlockService {
    static getLeftBlock(block: Block, blockDirection: string): Block | undefined {
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

    static getRightBlock(block: Block, blockDirection: string): Block | undefined {
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

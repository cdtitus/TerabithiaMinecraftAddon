import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';

const NUMBER_OF_CHANNELS = 3;

export class TelevisionComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const permutation = event.block.permutation;
        const curState = <number>permutation.getState('tma:television_state');
        const direction = <string>permutation.getState('minecraft:cardinal_direction');

        const newState = (curState + 1) > (NUMBER_OF_CHANNELS - 1) ? 0 : curState + 1;

        const states = {
            'tma:television_state': newState,
            'minecraft:cardinal_direction': direction
        };
        event.block.setPermutation(BlockPermutation.resolve(event.block.typeId, states));

        event.player?.playSound('tma.television');
    }
}

import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';

export class LightComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const permutation = event.block.permutation;
        const curState = <string>permutation.getState('tma:light_state');

        let newState = '';
        if (curState === 'off')
            newState = 'low';
        if (curState === 'low')
            newState = 'high';
        if (curState === 'high')
            newState = 'off';

        const states = {'tma:light_state': newState};
        event.block.setPermutation(BlockPermutation.resolve(event.block.typeId, states));

        event.player?.playSound('tma.light_switch');
    }
}

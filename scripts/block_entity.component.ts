import {
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerDestroyEvent,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    Vector3,
    Dimension,
    Player
} from '@minecraft/server';

export class BlockEntityComponent implements BlockCustomComponent {
    
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlace(event: BlockComponentOnPlaceEvent): void {
        const dimension = <Dimension>event.dimension;
        const location = <Vector3>event.block.center();
        dimension.spawnEntity('tma:block_entity', location);
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const dimension = <Dimension>event.dimension;
        const location = <Vector3>event.block.center();
        dimension.getEntitiesAtBlockLocation(location).forEach((entity) => {
            if (entity.typeId == "tma:block_entity") {
                    entity.remove();
            }
        });
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = <Player>event.player;
    }
}

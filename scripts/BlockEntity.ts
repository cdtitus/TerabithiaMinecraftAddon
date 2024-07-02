import {
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerDestroyEvent,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    Entity,
    EntityComponentTypes,
    EntityInventoryComponent,
    Vector3,
    WorldInitializeBeforeEvent,
    world,
    Dimension,
    Player
} from '@minecraft/server';

let blockEntity: Entity;

export class BlockEntity implements BlockCustomComponent {
    
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlace(event: BlockComponentOnPlaceEvent): void {
        const dimension = <Dimension>event.dimension;
        const location = <Vector3>event.block.bottomCenter();
        blockEntity = dimension.spawnEntity('tma:block_entity', location);
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        blockEntity.remove();
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = <Player>event.player;
        const blockInventory = <EntityInventoryComponent>blockEntity.getComponent(EntityComponentTypes.Inventory);
    }
}

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockComponentRegistry.registerCustomComponent('tma:block_entity', new BlockEntity());
});

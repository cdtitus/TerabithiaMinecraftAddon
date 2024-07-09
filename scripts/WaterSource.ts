import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EntityComponentTypes,
    EntityInventoryComponent,
    ItemStack,
} from '@minecraft/server';

const BUCKET: string = 'minecraft:bucket';
const WATER_BUCKET: string = 'minecraft:water_bucket';

export class WaterSource implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = event.player;
        const inventory = <EntityInventoryComponent>player?.getComponent(EntityComponentTypes.Inventory);
        const selectedSlotIndex = <number>player?.selectedSlotIndex;
        const selectedItem = inventory?.container?.getSlot(selectedSlotIndex);

        if (selectedItem?.type.id === BUCKET) {
            const waterBucket = new ItemStack(WATER_BUCKET, 1);

            if (selectedItem?.amount > 1) {
                selectedItem.amount -= 1;
                inventory?.container?.addItem(waterBucket);
            } else {
                inventory?.container?.setItem(selectedSlotIndex, waterBucket);
            }

            player?.playSound('bucket.fill_water');
        }
    }
}

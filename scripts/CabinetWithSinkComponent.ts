import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EntityComponentTypes,
    ItemStack
} from '@minecraft/server';

const BUCKET: string = 'minecraft:bucket';
const WATER_BUCKET: string = 'minecraft:water_bucket';

export class CabinetWithSinkComponent implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = event.player;
        const inventory = player?.getComponent(EntityComponentTypes.Inventory);
        const selectedSlotIndex = <number>player?.selectedSlotIndex;
        const selectedItem = inventory?.container?.getSlot(selectedSlotIndex);

        if (selectedItem?.type.id === BUCKET) {
            selectedItem.amount -= 1;

            const waterBucket = new ItemStack(WATER_BUCKET, 1);

            if (selectedItem?.amount > 1) {
                inventory?.container?.addItem(waterBucket);
            } else {
                inventory?.container?.setItem(selectedSlotIndex, waterBucket);
            }

            player?.playSound('bucket.fill_water');
        }
    }
}

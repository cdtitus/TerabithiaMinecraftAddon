import { Vector3Utils } from '@minecraft/math';
import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentPlayerDestroyEvent,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    Player,
    Vector3,
    world
} from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';

export class TeleporterComponent implements BlockCustomComponent {

    locations: Vector3[] = []
    names: string[] = []

    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        const player = <Player>event.player;
        const location = <Vector3>event.block.above();
        const additionForm = new ModalFormData();

        if (world.getDynamicProperty("tma:teleporter_locations") == undefined || world.getDynamicProperty("tma:teleporter_names") == undefined) {
            world.setDynamicProperty("tma:teleporter_locations", JSON.stringify(this.locations));
            world.setDynamicProperty("tma:teleporter_names", JSON.stringify(this.names));
        }
        this.locations = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_locations"));
        this.names = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_names"));

        additionForm.title('Add Location');
        additionForm.textField('Name this location', 'Name');
        additionForm.submitButton('Add');
        additionForm.show(player).then(response => {
            if (response.canceled) return;

            const name = <string>response.formValues?.toString();

            this.locations.push(location);
            this.names.push(name);

            world.setDynamicProperty("tma:teleporter_locations", JSON.stringify(this.locations));
            world.setDynamicProperty("tma:teleporter_names", JSON.stringify(this.names));
        })
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const location = <Vector3>event.block.above();

        if (world.getDynamicProperty("tma:teleporter_locations") == undefined || world.getDynamicProperty("tma:teleporter_names") == undefined) {
            world.setDynamicProperty("tma:teleporter_locations", JSON.stringify(this.locations));
            world.setDynamicProperty("tma:teleporter_names", JSON.stringify(this.names));
        }
        this.locations = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_locations"));
        this.names = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_names"));

        const index = this.locations.findIndex(vec => vec.x == location.x && vec.y == location.y && vec.z == location.z);
        if (index > -1) {
            this.locations.splice(index, 1);
            this.names.splice(index, 1);

            world.setDynamicProperty("tma:teleporter_locations", JSON.stringify(this.locations));
            world.setDynamicProperty("tma:teleporter_names", JSON.stringify(this.names));
        }
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = <Player>event.player;
        const selectionForm: ActionFormData = new ActionFormData;

        if (world.getDynamicProperty("tma:teleporter_locations") == undefined || world.getDynamicProperty("tma:teleporter_names") == undefined) {
            world.setDynamicProperty("tma:teleporter_locations", JSON.stringify(this.locations));
            world.setDynamicProperty("tma:teleporter_names", JSON.stringify(this.names));
        }
        this.locations = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_locations"));
        this.names = JSON.parse(<string>world.getDynamicProperty("tma:teleporter_names"));

        selectionForm.title('Choose Location');
        if (this.names.length <= 0) {
            selectionForm.body('No Locations Added');
            selectionForm.button('Exit');
            selectionForm.show(player);
        }
        else {
            this.names.forEach((name: string) => {
                selectionForm.button(name);
            })
            selectionForm.show(player).then(response => {
                if (response.canceled) return;

                const index = <number>response.selection;
                player.tryTeleport(this.locations[index]);
            })
        }
    }
}

import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockComponentPlayerDestroyEvent,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    Player,
    Vector3
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

        additionForm.title('Add Location');
        additionForm.textField('Name this location', 'Name');
        additionForm.submitButton('Add');
        additionForm.show(player).then(response => {
            if (response.canceled) return;

            const name = <string>response.formValues?.toString();

            this.locations.push(location);
            this.names.push(name);
        })
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const location = <Vector3>event.block.above();
        const index = this.locations.indexOf(location);
        
        if (index > -1) {
            this.locations.splice(index, 1);
            this.names.splice(index, 1);
        }
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const player = <Player>event.player;

        const selectionForm: ActionFormData = new ActionFormData;

        selectionForm.title('Choose Location');
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

import { world, system, WorldInitializeBeforeEvent } from '@minecraft/server';

// custom components
import { CouchBlockComponent } from './CouchComponent';
import { TestBlockComponent } from './TestBlockComponent';
import { WaterSource } from './WaterSource';
import { Teleporter } from './Teleporter';

import './BlockEntity';
import './DeathBoard';

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockComponentRegistry
        .registerCustomComponent('content:couch_component', new CouchBlockComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('content:test_component', new TestBlockComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('tma:water_source', new WaterSource());
    initEvent.blockComponentRegistry
        .registerCustomComponent('tma:teleporter', new Teleporter());
});

function mainTick() {
    if (system.currentTick % 100 === 0) {
        world.sendMessage('Hello Terabithia! Tick: ' + system.currentTick);
    }

    system.run(mainTick);
}

//system.run(mainTick);

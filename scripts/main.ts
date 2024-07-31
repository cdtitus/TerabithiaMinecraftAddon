import { world, system, WorldInitializeBeforeEvent } from '@minecraft/server';

import { BlockEntityComponent } from './block_entity.component';
import { CouchComponent } from './couch.component';
import { LightComponent } from './light.component';
import { SnowBlowerComponent } from './snow_blower.component';
import { TeleporterComponent } from './teleporter.component';
import { TestComponent } from './test.component';
import { WaterSource } from './water_source.component';

import './DeathBoard';

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockComponentRegistry
        .registerCustomComponent('tma:block_entity', new BlockEntityComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('content:couch_component', new CouchComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('content:light_component', new LightComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('tma:teleporter', new TeleporterComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('content:test_component', new TestComponent());
    initEvent.blockComponentRegistry
        .registerCustomComponent('tma:water_source', new WaterSource());

    initEvent.itemComponentRegistry
        .registerCustomComponent("tma:snow_blower_component", new SnowBlowerComponent());
});

function mainTick() {
    if (system.currentTick % 100 === 0) {
        world.sendMessage('Hello Terabithia! Tick: ' + system.currentTick);
    }

    system.run(mainTick);
}

//system.run(mainTick);

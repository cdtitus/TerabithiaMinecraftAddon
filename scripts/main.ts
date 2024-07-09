import { world, system, WorldInitializeBeforeEvent } from '@minecraft/server';
import { WaterSource } from './WaterSource';
import { TestBlockComponent } from './TestBlockComponent';
import './BlockEntity';
import './DeathBoard';

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockComponentRegistry.registerCustomComponent(
        'tma:water_source', new WaterSource());
    initEvent.blockComponentRegistry.registerCustomComponent(
        'content:test_component', new TestBlockComponent());
});

function mainTick() {
    if (system.currentTick % 100 === 0) {
        world.sendMessage('Hello Terabithia! Tick: ' + system.currentTick);
    }

    system.run(mainTick);
}

//system.run(mainTick);

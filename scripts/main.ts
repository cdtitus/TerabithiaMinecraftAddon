import { world, system, WorldInitializeBeforeEvent } from '@minecraft/server';
import { TestBlockComponent } from './TestBlockComponent';

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockTypeRegistry.registerCustomComponent('content:test_component', new TestBlockComponent());
});

function mainTick() {
    if (system.currentTick % 100 === 0) {
        world.sendMessage('Hello Terabithia! Tick: ' + system.currentTick);
    }

    system.run(mainTick);
}

system.run(mainTick);

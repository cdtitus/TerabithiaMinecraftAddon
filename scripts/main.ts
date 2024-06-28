import { world, system, WorldInitializeBeforeEvent } from '@minecraft/server';
import { CabinetWithSinkComponent } from './CabinetWithSinkComponent';
import { TestBlockComponent } from './TestBlockComponent';
import './DeathBoard'

world.beforeEvents.worldInitialize.subscribe((initEvent: WorldInitializeBeforeEvent) => {
    initEvent.blockComponentRegistry.registerCustomComponent(
        'content:cabinet_with_sink_component', new CabinetWithSinkComponent());
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

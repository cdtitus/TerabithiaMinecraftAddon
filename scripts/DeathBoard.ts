import { world, system, Player, DisplaySlotId } from "@minecraft/server";

let deathBoard = world.scoreboard.getObjective("deathBoard");

system.run(() => {
    if (!deathBoard) {
        deathBoard = world.scoreboard.addObjective("deathBoard", "Deaths");
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.List, {objective: deathBoard});
    }
});

world.afterEvents.entityDie.subscribe(deathEvent => {
    if (deathEvent.deadEntity instanceof Player) {
        let player = deathEvent.deadEntity as Player;

        deathBoard?.addScore(player, 1);
    }
});

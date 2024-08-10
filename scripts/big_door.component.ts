import { Vector3Builder, Vector3Utils } from '@minecraft/math';
import {
    BlockCustomComponent,
    BlockComponentPlayerDestroyEvent,
    BlockComponentPlayerInteractEvent,
    BlockPermutation,
    Dimension,
    Vector3,
    BlockComponentPlayerPlaceBeforeEvent,
    Block,
} from '@minecraft/server';

export class BigDoorComponent implements BlockCustomComponent {
    hight = 3;
    width = 2;

    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        let permutation = event.permutationToPlace;

        if (this._hasNeighbor(event.block, permutation, event.dimension)) {
            const direction = <string>permutation.getState('minecraft:cardinal_direction');
            const states = {'minecraft:cardinal_direction': direction, 'tma:door_open': false, 'tma:door_mirrored': true};
            permutation = BlockPermutation.resolve(event.permutationToPlace.type.id, states);
            event.permutationToPlace = permutation
        }

        if (this._areaClear(event.block, permutation, event.dimension, 0))
            this._setAdjacent(event.block, permutation, event.dimension);
        else 
            event.cancel = true;
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const rootBlock = this._getRootBlock(event.block, event.destroyedBlockPermutation, event.dimension);
        this._removeAdjacent(<Block>rootBlock, event.destroyedBlockPermutation, event.dimension);
    }

    onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const oldPermutation = event.block.permutation;
        const direction = <string>oldPermutation.getState('minecraft:cardinal_direction');
        let open = <boolean>oldPermutation.getState('tma:door_open');
        const mirrored = <boolean>oldPermutation.getState('tma:door_mirrored');
        const rootBlock = this._getRootBlock(event.block, oldPermutation, event.dimension);

        open = !open;

        let sound = '';
        if (open) {
            sound = 'random.door_open';
        }
        else {
            sound = 'random.door_close';
        }

        const states = {'minecraft:cardinal_direction': direction, 'tma:door_open': open, 'tma:door_mirrored': mirrored};
        const newPermutation = BlockPermutation.resolve(event.block.typeId, states);

        if (this._areaClear(rootBlock, newPermutation, event.dimension, 1)) {
            rootBlock.setPermutation(newPermutation);
            this._removeAdjacent(rootBlock, oldPermutation, event.dimension);
            this._setAdjacent(rootBlock, newPermutation, event.dimension);
            event.player?.playSound(sound);
        }
    }

    private _getDirectionVector(permutation: BlockPermutation): Vector3 {
        const direction = <string>permutation.getState('minecraft:cardinal_direction');
        const open = <boolean>permutation.getState('tma:door_open');
        const mirrored = <boolean>permutation.getState('tma:door_mirrored');

        if (open) {
            switch (direction) {
                case 'north':
                    return <Vector3> new Vector3Builder(0, 0, -1);
                    break;
                case 'east':
                    return <Vector3> new Vector3Builder(1, 0, 0);
                    break;
                case 'south':
                    return <Vector3> new Vector3Builder(0, 0, 1);
                    break;
                case 'west':
                    return <Vector3> new Vector3Builder(-1, 0, 0);
                    break;
            }
        }
        else {
            if (mirrored) {
                switch (direction) {
                    case 'north':
                        return <Vector3> new Vector3Builder(-1, 0, 0);
                        break;
                    case 'east':
                        return <Vector3> new Vector3Builder(0, 0, -1);
                        break;
                    case 'south':
                        return <Vector3> new Vector3Builder(1, 0, 0);
                        break;
                    case 'west':
                        return <Vector3> new Vector3Builder(0, 0, 1);
                        break;
                }
            }
            else {
                switch (direction) {
                    case 'north':
                        return <Vector3> new Vector3Builder(1, 0, 0);
                        break;
                    case 'east':
                        return <Vector3> new Vector3Builder(0, 0, 1);
                        break;
                    case 'south':
                        return <Vector3> new Vector3Builder(-1, 0, 0);
                        break;
                    case 'west':
                        return <Vector3> new Vector3Builder(0, 0, -1);
                        break;
                }
            }
        }
        return <Vector3> new Vector3Builder(0, 0, 0);
    }

    private _getRootBlock(block: Block, permutation: BlockPermutation, dimension: Dimension): Block {
        const direction = <string>permutation.getState('minecraft:cardinal_direction');
        const open = <boolean>permutation.getState('tma:door_open');
        const mirrored = <boolean>permutation.getState('tma:door_mirrored');

        if (block.below()?.typeId == "tma:big_door") {
            return this._getRootBlock(<Block>block.below(), permutation, dimension);
        }
        if (open) {
            switch (direction) {
                case 'north':
                    if (block.south()?.typeId == "tma:big_door")
                        return this._getRootBlock(<Block>block.south(), permutation, dimension);
                    else
                        break;
                case 'east':
                    if (block.west()?.typeId == "tma:big_door")
                        return this._getRootBlock(<Block>block.west(), permutation, dimension);
                    else
                        break;
                case 'south':
                    if (block.north()?.typeId == "tma:big_door")
                        return this._getRootBlock(<Block>block.north(), permutation, dimension);
                    else
                        break;
                case 'west':
                    if (block.east()?.typeId == "tma:big_door")
                        return this._getRootBlock(<Block>block.east(), permutation, dimension);
                    else
                        break;
            }
        }
        else {
            if (mirrored) {
                switch (direction) {
                    case 'north':
                        if (block.east()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.east(), permutation, dimension);
                        else
                            break;
                    case 'east':
                        if (block.south()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.south(), permutation, dimension);
                        else
                            break;
                    case 'south':
                        if (block.west()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.west(), permutation, dimension);
                        else
                            break;
                    case 'west':
                        if (block.north()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.north(), permutation, dimension);
                        else
                            break;
                }
            }
            else {
                switch (direction) {
                    case 'north':
                        if (block.west()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.west(), permutation, dimension);
                        else
                            break;
                    case 'east':
                        if (block.north()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.north(), permutation, dimension);
                        else
                            break;
                    case 'south':
                        if (block.east()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.east(), permutation, dimension);
                        else
                            break;
                    case 'west':
                        if (block.south()?.typeId == "tma:big_door")
                            return this._getRootBlock(<Block>block.south(), permutation, dimension);
                        else
                            break;
                }
            }
        }
        return block;
    }

    private _areaClear(block: Block, permutation: BlockPermutation, dimension: Dimension, widthShunt: number): boolean {
        const location = <Vector3>block.location;
        const direction = this._getDirectionVector(permutation);

        for (let h = 0; h < this.hight; h++) {
            for (let w = widthShunt; w < this.width; w++) {
                const offset = <Vector3> new Vector3Builder(direction.x * w, h, direction.z * w);
                const block = <Block>dimension.getBlock(Vector3Utils.add(location, offset));
                if (!block.isAir) 
                    return false;
            }
        }
        return true;
    }

    private _hasNeighbor(block: Block, permutation: BlockPermutation, dimension: Dimension): boolean {
        const location = <Vector3>block.location;
        const direction = this._getDirectionVector(permutation);

        const lastBlock = <Block>dimension.getBlock(Vector3Utils.add(location, new Vector3Builder(-direction.x * this.width, 0, -direction.z * this.width)));

        if (lastBlock.typeId == "tma:big_door") {
            for (let w = 1; w < this.width; w++) {
                const nblock = <Block>dimension.getBlock(Vector3Utils.add(location, new Vector3Builder(-direction.x * w, 0, -direction.z * w)));
                if (!nblock.isAir)
                    return false;
            }
            return true;
        }
        return false;
    }

    private _setAdjacent(block: Block, permutation: BlockPermutation, dimension: Dimension): void {
        const location = <Vector3>block.location;
        const direction = this._getDirectionVector(permutation);

        for (let h = 0; h < this.hight; h++) {
            for (let w = 0; w < this.width; w++) {
                const offset = <Vector3> new Vector3Builder(direction.x * w, h, direction.z * w);
                const block = <Block>dimension.getBlock(Vector3Utils.add(location, offset));
                block.setType("tma:big_door");
                block.setPermutation(permutation);
            }
        }
    }

    private _removeAdjacent(block: Block, permutation: BlockPermutation, dimension: Dimension): void {
        const location = <Vector3>block.location;
        const direction = this._getDirectionVector(permutation);

        for (let h = 0; h < this.hight; h++) {
            for (let w = 0; w < this.width; w++) {
                const offset = <Vector3> new Vector3Builder(direction.x * w, h, direction.z * w);
                const block = <Block>dimension.getBlock(Vector3Utils.add(location, offset));
                if (block.typeId == "tma:big_door")
                    block.setType("minecraft:air");
            }
        }
    }
}

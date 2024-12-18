import { addEntity, addComponent, IWorld } from 'bitecs';
import { PositionComponent, FishComponent, Animation, CollisionComponent, MovementComponent, ObstacleComponent } from './components';
import Phaser from 'phaser';

// Map to store Phaser sprites associated with ECS entities
const obstacleSprites = new Map<number, Phaser.GameObjects.Image>();

const spriteMap = new Map<number, Phaser.GameObjects.Image>();

// Helper function to retrieve the sprite
export const getObstacleSprite = (eid: number) => obstacleSprites.get(eid);


export const createFishEntity = (world: IWorld, x: number, y: number, speed: number, scene: Phaser.Scene) => {
    const eid = addEntity(world);
    addComponent(world, PositionComponent, eid);
    addComponent(world, FishComponent, eid);

    PositionComponent.x[eid] = x;
    PositionComponent.y[eid] = y;
    FishComponent.baseY[eid] = y;
    FishComponent.speed[eid] = speed;
    FishComponent.collisionRadius[eid] = 50;

    console.log(`Fish Created: Entity ID=${eid}, Position=(${x}, ${y})`);
    return eid;
};

export const createObstacleEntity = (
    world: any,
    scene: Phaser.Scene,
    x: number,
    y: number
) => {
    const eid = addEntity(world); // Create ECS entity
    addComponent(world, PositionComponent, eid);

    // Set position in ECS
    PositionComponent.x[eid] = x;
    PositionComponent.y[eid] = y;

    // Add Phaser visual representation
    const obstacle = scene.add.image(x, y, 'rockObstacle');
    obstacle.setName(`obstacle_${eid}`); // Tag for debugging
    obstacle.setCrop(0, 1,obstacle.width, obstacle.height -1);

    // Store reference to Phaser object for syncing
    scene.data.set(`obstacle_${eid}`, obstacle);

    console.log(`Obstacle Created: Entity ID=${eid}, Position=(${x}, ${y})`);
    return eid;
};

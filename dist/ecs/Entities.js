import { addEntity, addComponent } from 'bitecs';
import { PositionComponent, FishComponent } from './components';
// export const createFishEntity = (world: any, scene: Phaser.Scene, x: number, y: number, speed: number) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, FishComponent, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     FishComponent.baseY[eid] = y;
//     FishComponent.speed[eid] = speed;
//     FishComponent.collisionRadius[eid] = 100;
//     // Add Phaser sprite and name it
//     const fish = scene.add.image(x, y, 'fish').setName(`fish_${eid}`);
//     fish.setDepth(1);
//     console.log(`Fish Created: Entity ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// };
// Map to store Phaser sprites associated with ECS entities
const obstacleSprites = new Map();
const spriteMap = new Map();
// export const createObstacleEntity = (world: IWorld, x: number, y: number, scene: Phaser.Scene) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, ObstacleComponent, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//      const obstacleSprite = scene.add.image(x, y, 'obstacle').setName(`obstacle_${eid}`);
//      obstacleSprite.setOrigin(0.5, 0.5);
//     // spriteMap.set(eid, obstacleSprite); // Store sprite in the map
//     // ObstacleComponent.spriteId[eid] = eid; // Link eid as spriteId
//     console.log(`Obstacle Created: Entity ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// };
// Helper function to retrieve the sprite
export const getObstacleSprite = (eid) => obstacleSprites.get(eid);
export const createFishEntity = (world, x, y, speed, scene) => {
    const eid = addEntity(world);
    addComponent(world, PositionComponent, eid);
    addComponent(world, FishComponent, eid);
    PositionComponent.x[eid] = x;
    PositionComponent.y[eid] = y;
    // const fishSprite = scene.add.image(x, y, 'fish').setName(`fish_${eid}`);
    // fishSprite.setOrigin(0.5, 0.5);
    // spriteMap.set(eid, fishSprite); // Store sprite in the map
    // FishComponent.spriteId[eid] = eid; // Link eid as spriteId
    FishComponent.baseY[eid] = y;
    FishComponent.speed[eid] = speed;
    FishComponent.collisionRadius[eid] = 50;
    console.log(`Fish Created: Entity ID=${eid}, Position=(${x}, ${y})`);
    return eid;
};
// export const createFishEntity = (world: any, x: number, y: number, speed: number, scene: Phaser.Scene) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, FishComponent, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     FishComponent.collisionRadius[eid] = 100; // Ensure this is set
//     // Create a Phaser sprite and name it based on the entity ID
//     //const fishSprite = scene.add.image(x, y, 'fish').setName(`fish_${eid}`);
//     //fishSprite.setDepth(1); // Set depth for rendering
//     console.log(`Fish Created: Entity ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// };
// export const createFishEntity = (world: any, x: number, y: number, speed: number) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, FishComponent, eid);
//     addComponent(world, MovementComponent, eid);
//     addComponent(world, CollisionComponent, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     FishComponent.baseY[eid] = y;
//     FishComponent.speed[eid] = speed;
//     FishComponent.sineWaveDisabled[eid] = 0;
//     CollisionComponent.radius[eid] = 100; // Set collision radius
//     console.log(`Fish Created: Entity ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// };
export const createObstacleEntity = (world, scene, x, y) => {
    const eid = addEntity(world); // Create ECS entity
    addComponent(world, PositionComponent, eid);
    // Set position in ECS
    PositionComponent.x[eid] = x;
    PositionComponent.y[eid] = y;
    // Add Phaser visual representation
    const obstacle = scene.add.image(x, y, 'rockObstacle');
    obstacle.setName(`obstacle_${eid}`); // Tag for debugging
    obstacle.setCrop(0, 1, obstacle.width, obstacle.height - 1);
    // Store reference to Phaser object for syncing
    scene.data.set(`obstacle_${eid}`, obstacle);
    console.log(`Obstacle Created: Entity ID=${eid}, Position=(${x}, ${y})`);
    return eid;
};
// let obstacleCreated = false; // Flag to ensure only one obstacle is created
// export const createObstacleEntity = (
//     world: any,
//     scene: Phaser.Scene,
//     x: number,
//     y: number,
//     angleRange: [number, number],
//     duration: number
// ) => {
//     const eid = addEntity(world);
//     // Add ECS components
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, Animation, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     Animation.angleMin[eid] = angleRange[0];
//     Animation.angleMax[eid] = angleRange[1];
//     Animation.duration[eid] = duration;
//     // Ensure only one Phaser GameObject is created
//     const existingObstacle = scene.children.getByName('rockObstacle');
//     if (!existingObstacle) {
//         const obstacle = scene.add.image(x, y, 'rockObstacle');
//         obstacle.setName('rockObstacle');
//         obstacle.setDepth(2); // Ensure visibility
//         console.log(`Created a single obstacle at (${x}, ${y})`);
//     } else {
//         console.warn('Obstacle already exists. Skipping creation.');
//     }
//     return eid;
// };
// export const createFishEntity = (world: any, x: number, y: number, speed: number) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, FishComponent, eid);
//     addComponent(world, MovementComponent, eid);
//     addComponent(world, CollisionComponent, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     FishComponent.baseY[eid] = y;
//     FishComponent.speed[eid] = speed;
//     CollisionComponent.radius[eid] = 50; // Define a collision radius
//     return eid;
// };
// export const createObstacleEntity = (
//     world: any, 
//     scene: Phaser.Scene, 
//     x: number, 
//     y: number, 
//     angleRange: [number, number], 
//     duration: number
// ) => {
//     const eid = addEntity(world);
//     addComponent(world, PositionComponent, eid);
//     addComponent(world, Animation, eid);
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     Animation.angleMin[eid] = angleRange[0];
//     Animation.angleMax[eid] = angleRange[1];
//     Animation.duration[eid] = duration;
//     // Add visual representation
//     const obstacle = scene.add.image(x, y, 'rockObstacle');
//     obstacle.name = 'rockObstacle';
//     obstacle.setDepth(10);
//     // Add collider for debugging
//     scene.physics.world.enable(obstacle);
//     (obstacle.body as Phaser.Physics.Arcade.Body).setImmovable(true);
//     console.log(`Obstacle Created: ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// };
// export function createObstacleEntity(world: any, x: number, y: number, angleRange: [number, number], duration: number) {
//     const eid = addEntity(world);
//     // Position
//     PositionComponent.x[eid] = x;
//     PositionComponent.y[eid] = y;
//     // Animation
//     Animation.angleMin[eid] = angleRange[0];
//     Animation.angleMax[eid] = angleRange[1];
//     Animation.duration[eid] = duration;
//     console.log(`Obstacle Entity Created: ID=${eid}, Position=(${x}, ${y})`);
//     return eid;
// }

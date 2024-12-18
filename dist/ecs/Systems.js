import { defineSystem, defineQuery, enterQuery } from 'bitecs';
import Phaser from 'phaser';
import { PositionComponent, FishComponent, Animation, ObstacleComponent } from './components';
export const createFishRenderSystem = (scene) => {
    const fishQuery = defineQuery([PositionComponent, FishComponent]);
    return (world) => {
        fishQuery(world).forEach((fishEntity) => {
            // Get the Phaser sprite by entity name
            const fishSprite = scene.children.getByName(`fish_${fishEntity}`);
            // Sync sprite position with ECS PositionComponent
            if (fishSprite) {
                fishSprite.x = PositionComponent.x[fishEntity];
                fishSprite.y = PositionComponent.y[fishEntity];
            }
        });
        return world;
    };
};
// Fish Movement System
export function createFishMovementSystem(scene) {
    const query = defineQuery([PositionComponent, FishComponent]);
    return (world) => {
        const time = scene.time.now;
        query(world).forEach((eid) => {
            if (FishComponent.sineWaveDisabled[eid] === 1)
                return;
            const baseY = FishComponent.baseY[eid];
            const speed = FishComponent.speed[eid];
            // Update X position with wrapping
            PositionComponent.x[eid] += speed * 0.016;
            if (PositionComponent.x[eid] > scene.cameras.main.width) {
                PositionComponent.x[eid] = 0; // Reset position to the left
            }
            // Sine wave Y movement
            PositionComponent.y[eid] = baseY + Math.sin((time + PositionComponent.x[eid] * 100) / 3000) * 10;
        });
        return world;
    };
}
// export function createFishMovementSystem(scene: Phaser.Scene) {
//     const query = defineQuery([PositionComponent, FishComponent]);
//     return (world: IWorld) => {
//         const time = scene.time.now;
//         query(world).forEach((eid) => {
//             if (FishComponent.sineWaveDisabled[eid] === 1) return;
//             const baseY = FishComponent.baseY[eid];
//             const speed = FishComponent.speed[eid];
//             // Update ECS position with wrapping logic to prevent infinite values
//             PositionComponent.x[eid] += speed * 0.016;
//             if (PositionComponent.x[eid] > scene.cameras.main.width + 50) {
//                 PositionComponent.x[eid] = -50; // Reset X position if it goes off-screen
//             }
//             // Smooth sine wave movement on the Y-axis
//             PositionComponent.y[eid] = baseY + Math.sin((time + PositionComponent.x[eid] * 100) / 3000) * 10;
//             // Update the corresponding Phaser sprite position
//             const fishSprite = scene.children.getByName(`fish_${eid}`) as Phaser.GameObjects.Image;
//             if (fishSprite) {
//                 fishSprite.x = PositionComponent.x[eid];
//                 fishSprite.y = PositionComponent.y[eid];
//             }
//         });
//         return world;
//     };
// }
// Obstacle Animation System
export const createObstacleAnimationSystem = (scene) => {
    const query = defineQuery([PositionComponent, Animation]);
    const enter = enterQuery(query);
    return defineSystem((world) => {
        enter(world).forEach((eid) => {
            const obstacle = scene.add.image(PositionComponent.x[eid], PositionComponent.y[eid], 'rockObstacle').setDepth(1);
            scene.tweens.add({
                targets: obstacle,
                angle: { from: Animation.angleMin[eid], to: Animation.angleMax[eid] },
                duration: Animation.duration[eid],
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        });
        return world;
    });
};
// Fish Collision System
export const createFishCollisionSystem = (scene) => {
    const fishQuery = defineQuery([PositionComponent, FishComponent]);
    const obstacleQuery = defineQuery([PositionComponent, ObstacleComponent]);
    return defineSystem((world) => {
        const fishEntities = fishQuery(world);
        const obstacleEntities = obstacleQuery(world);
        for (const fishEntity of fishEntities) {
            const fishX = PositionComponent.x[fishEntity];
            const fishY = PositionComponent.y[fishEntity];
            const collisionRadius = 400; // Adjust collision radius as needed
            for (const obstacleEntity of obstacleEntities) {
                if (fishEntity === obstacleEntity)
                    continue;
                const obsX = PositionComponent.x[obstacleEntity];
                const obsY = PositionComponent.y[obstacleEntity];
                const distance = Phaser.Math.Distance.Between(fishX, fishY, obsX, obsY);
                // console.log(
                //     `Fish ${fishEntity} Position: (${fishX}, ${fishY}), Obstacle ${obstacleEntity} Position: (${obsX}, ${obsY}), Distance=${distance}`
                // );
                if (distance < collisionRadius) {
                    console.error(`Collision! Fish ${fishEntity} and Obstacle ${obstacleEntity}`);
                    const moveDistance = 150; // Distance to move
                    const targetX = fishX + moveDistance; // Move horizontally
                    const targetY = fishY < obsY ? fishY - moveDistance : fishY + moveDistance; // Move up or down
                    scene.tweens.add({
                        targets: {},
                        duration: 1000,
                        ease: 'Power2',
                        onUpdate: (tween) => {
                            const progress = tween.progress;
                            // Update ECS Position Components
                            PositionComponent.x[fishEntity] = Phaser.Math.Linear(fishX, targetX, progress);
                            PositionComponent.y[fishEntity] = Phaser.Math.Linear(fishY, targetY, progress);
                            // Sync FishComponent.baseY for sine wave animation
                            FishComponent.baseY[fishEntity] = PositionComponent.y[fishEntity];
                        },
                        onComplete: () => {
                            //console.log(`Fish ${fishEntity} moved to (${targetX}, ${targetY}).`);
                        },
                    });
                    break; // Stop further checks for this fish
                }
            }
        }
        return world;
    });
};
// export function createFishCollisionSystem(scene: Phaser.Scene) {
//     const fishQuery = defineQuery([PositionComponent, FishComponent]);
//     const obstacleQuery = defineQuery([PositionComponent, ObstacleComponent]);
//     return defineSystem((world: IWorld) => {
//         const fishEntities = fishQuery(world);
//         const obstacleEntities = obstacleQuery(world);
//         for (const fishEntity of fishEntities) {
//             const fishX = PositionComponent.x[fishEntity];
//             const fishY = PositionComponent.y[fishEntity];
//             const collisionRadius = FishComponent.collisionRadius[fishEntity] || 100;
//             for (const obstacleEntity of obstacleEntities) {
//                 if (fishEntity === obstacleEntity) continue; // Skip self-check
//                 const obsX = PositionComponent.x[obstacleEntity];
//                 const obsY = PositionComponent.y[obstacleEntity];
//                 const distance = Phaser.Math.Distance.Between(fishX, fishY, obsX, obsY);
//                 console.log(
//                     `Fish ${fishEntity} Position: (${fishX}, ${fishY}), Obstacle ${obstacleEntity} Position: (${obsX}, ${obsY}), Distance=${distance}`
//                 );
//                 if (distance < collisionRadius) {
//                     console.log(`Collision! Fish ${fishEntity} and Obstacle ${obstacleEntity}`);
//                     // Move the fish away
//                     const targetY = fishY < obsY ? fishY - 150 : fishY + 150;
//                     const targetX = fishX + 150;
//                     const tweenTarget = { progress: 0 };
//                     scene.tweens.add({
//                         targets: tweenTarget, // Use a valid object
//                         progress: 1, // Animate the progress value from 0 to 1
//                         duration: 1000, // Duration of the movement
//                         ease: 'Power2',
//                         onUpdate: () => {
//                             const progress = tweenTarget.progress;
//                             // Calculate the new position
//                             const moveDistance = 200; // How far to move the fish
//                             const directionY = fishY < obsY ? -1 : 1; // Move up or down
//                             PositionComponent.x[fishEntity] = Phaser.Math.Linear(fishX, fishX + moveDistance, progress);
//                             PositionComponent.y[fishEntity] = Phaser.Math.Linear(fishY, fishY + directionY * moveDistance, progress);
//                             FishComponent.baseY[fishEntity] = PositionComponent.y[fishEntity]; // Update baseY
//                         },
//                         onComplete: () => {
//                             console.log(`Fish ${fishEntity} moved away from obstacle ${obstacleEntity}`);
//                         },
//                     });
//                     break; // Stop checking other obstacles for this fish
//                 }
//             }
//         }
//         return world;
//     });
// }
// export function createFishCollisionSystem(scene: Phaser.Scene) {
//     const fishQuery = defineQuery([PositionComponent, FishComponent]);
//     const obstacleQuery = defineQuery([PositionComponent]);
//     return defineSystem((world: IWorld) => {
//         const fishEntities = fishQuery(world);
//         const obstacleEntities = obstacleQuery(world);
//         for (const fishEntity of fishEntities) {
//             const fishX = PositionComponent.x[fishEntity];
//             const fishY = PositionComponent.y[fishEntity];
//             const collisionRadius = FishComponent.collisionRadius[fishEntity] || 100;
//             for (const obstacleEntity of obstacleEntities) {
//                 // Skip checking collision against itself
//                 if (fishEntity === obstacleEntity) continue;
//                 const obsX = PositionComponent.x[obstacleEntity];
//                 const obsY = PositionComponent.y[obstacleEntity];
//                 // Calculate distance
//                 const distance = Phaser.Math.Distance.Between(fishX, fishY, obsX, obsY);
//                 if (distance < collisionRadius) {
//                     console.log(
//                         `Fish ${fishEntity} collides with Obstacle ${obstacleEntity}: Distance=${distance}`
//                     );
//                     // Move fish away from the obstacle
//                     const targetY = fishY < obsY ? fishY - 150 : fishY + 150;
//                     const targetX = fishX + 150;
//                     scene.tweens.add({
//                         targets: {},
//                         duration: 1000,
//                         ease: 'Power2',
//                         onUpdate: (tween) => {
//                             const progress = tween.progress;
//                             PositionComponent.x[fishEntity] = Phaser.Math.Linear(fishX, targetX, progress);
//                             PositionComponent.y[fishEntity] = Phaser.Math.Linear(fishY, targetY, progress);
//                             FishComponent.baseY[fishEntity] = PositionComponent.y[fishEntity];
//                         },
//                         onComplete: () => {
//                             console.log(
//                                 `Fish ${fishEntity} moved to (${targetX}, ${targetY}) to avoid collision.`
//                             );
//                         },
//                     });
//                     break; // Stop checking other obstacles for this fish
//                 }
//             }
//         }
//         return world;
//     });
// }
// export function createFishCollisionSystem(scene: Phaser.Scene, obstacle: Phaser.GameObjects.Image) {
//     const positionQuery = defineQuery([PositionComponent, FishComponent]);
//     return defineSystem((world: IWorld) => {
//         const fishEntities = positionQuery(world);
//         fishEntities.forEach((fishEntity) => {
//             const fishSprite = scene.children.getByName(`fish_${fishEntity}`) as Phaser.GameObjects.Image;
//             if (!fishSprite) return; // Skip if sprite is missing
//             // Sync Phaser sprite with ECS position
//             fishSprite.x = PositionComponent.x[fishEntity];
//             fishSprite.y = PositionComponent.y[fishEntity];
//             const collisionRadius = FishComponent.collisionRadius[fishEntity] || 100;
//             const distance = Phaser.Math.Distance.Between(fishSprite.x, fishSprite.y, obstacle.x, obstacle.y);
//             console.log(`Fish Position: (${fishSprite.x}, ${fishSprite.y}), Obstacle Position: (${obstacle.x}, ${obstacle.y})`);
//             console.log(`Distance between fish and obstacle: ${distance}`);
//             if (distance < collisionRadius && FishComponent.collided[fishEntity] !== 1) {
//                 console.log(`Fish ${fishEntity} collides with obstacle at (${obstacle.x}, ${obstacle.y})`);
//                 FishComponent.collided[fishEntity] = 1;
//                 const targetY = fishSprite.y < obstacle.y
//                     ? Math.max(50, fishSprite.y - 200) // Move up
//                     : Math.min(scene.cameras.main.height - 50, fishSprite.y + 200); // Move down
//                 const targetX = fishSprite.x + 200;
//                 scene.tweens.add({
//                     targets: fishSprite,
//                     x: targetX,
//                     y: targetY,
//                     duration: 1000,
//                     ease: 'Power2',
//                     onUpdate: () => {
//                         // Sync ECS positions with Phaser sprite
//                         PositionComponent.x[fishEntity] = fishSprite.x;
//                         PositionComponent.y[fishEntity] = fishSprite.y;
//                     },
//                     onComplete: () => {
//                         console.log(`Fish ${fishEntity} moved to (${targetX}, ${targetY}).`);
//                         FishComponent.collided[fishEntity] = 0; // Reset collision flag
//                     },
//                 });
//             }
//         });
//         return world;
//     });
// }
// export function createFishCollisionSystem(scene: Phaser.Scene, obstacle: Phaser.GameObjects.Image) {
//     const positionQuery = defineQuery([PositionComponent, FishComponent]);
//     console.log('Hello World');
//     return defineSystem((world: IWorld) => {
//         const fishEntities = positionQuery(world);
//         for (const fishEntity of fishEntities) {
//             const fishX = PositionComponent.x[fishEntity];
//             const fishY = PositionComponent.y[fishEntity];
//             const collisionRadius = FishComponent.collisionRadius[fishEntity] || 150;
//             console.log(`Collision radius for Fish ${fishEntity}: ${collisionRadius}`);
//             // Check distance between fish and obstacle
//             const distance = Phaser.Math.Distance.Between(fishX, fishY, obstacle.x, obstacle.y);
//             console.log(`Distance between Fish ${fishEntity} and Obstacle: ${distance}`);
//             if (distance < 40000) {
//                 console.log(`Fish ${fishEntity} collides with obstacle at (${obstacle.x}, ${obstacle.y})`);
//                 // Move the fish away
//                 let targetY: number;
//                 // Decide to move up or down
//                 if (fishY < obstacle.y) {
//                     targetY = Math.max(50, fishY - 150); // Move upwards
//                 } else {
//                     targetY = Math.min(scene.cameras.main.height - 50, fishY + 150); // Move downwards
//                 }
//                 const targetX = fishX + 150; // Move forward horizontally
//                 // Smooth movement using a tween
//                 scene.tweens.add({
//                     targets: {},
//                     duration: 1000,
//                     ease: 'Power2',
//                     onUpdate: (tween) => {
//                         const progress = tween.progress;
//                         // Interpolate position
//                         PositionComponent.x[fishEntity] = Phaser.Math.Linear(fishX, targetX, progress);
//                         PositionComponent.y[fishEntity] = Phaser.Math.Linear(fishY, targetY, progress);
//                         FishComponent.baseY[fishEntity] = PositionComponent.y[fishEntity]; // Sync baseY
//                     },
//                     onComplete: () => {
//                         console.log(`Fish ${fishEntity} moved to (${targetX}, ${targetY}).`);
//                     },
//                 });
//             }
//         }
//         return world;
//     });
// }
// export function createFishMovementSystem(scene: Phaser.Scene) {
//     const query = defineQuery([PositionComponent, FishComponent]);
//     return (world: any) => {
//         const time = scene.time.now; // Get the current time
//         query(world).forEach((entity) => {
//             // Skip sine wave logic if disabled
//             if (FishComponent.sineWaveDisabled[entity] === 1) {
//                 return;
//             }
//             // Get the baseY and speed
//             const baseY = FishComponent.baseY[entity];
//             const speed = FishComponent.speed[entity];
//             // Update the position using sine wave logic
//             PositionComponent.x[entity] += speed * 0.016; // Simulate forward movement
//             PositionComponent.y[entity] =
//                 baseY + Math.sin((time + PositionComponent.x[entity] * 100) / 3000) * 10;
//         });
//         return world;
//     };
// }
// export const createObstacleAnimationSystem = (scene: Phaser.Scene) => {
//     const query = defineQuery([PositionComponent, Animation]);
//     const enter = enterQuery(query);
//     // Map to track obstacle sprites by entity ID
//     const obstacleMap = new Map<number, Phaser.GameObjects.Image>();
//     return defineSystem((world) => {
//         // Handle newly added obstacles
//         enter(world).forEach((eid) => {
//             const x = PositionComponent.x[eid]; 
//             const y = PositionComponent.y[eid];
//             // Check if the sprite already exists
//             if (!obstacleMap.has(eid)) {
//                 const obstacle = scene.add.image(x, y, 'rockObstacle').setName('rockObstacle');
//                 obstacle.setDepth(1); // Ensure it renders above background
//                 // Store reference to sprite
//                 obstacleMap.set(eid, obstacle);
//                 // Add animation to the obstacle
//                 scene.tweens.add({
//                     targets: obstacle,
//                     angle: { from: Animation.angleMin[eid], to: Animation.angleMax[eid] },
//                     duration: Animation.duration[eid],
//                     yoyo: true,
//                     repeat: -1,
//                     ease: 'Sine.easeInOut',
//                 });
//                 console.log(`Obstacle Created: Entity ID=${eid}, Position=(${x}, ${y})`);
//             }
//         });
//         // Update obstacle positions based on PositionComponent
//         query(world).forEach((eid) => {
//             const obstacle = obstacleMap.get(eid);
//             if (obstacle) {
//                 obstacle.x = PositionComponent.x[eid];
//                 obstacle.y = PositionComponent.y[eid];
//             }
//         });
//         return world;
//     });
// };
// export function createFishCollisionSystem(scene: Phaser.Scene) {
//     const positionQuery = defineQuery([PositionComponent, MovementComponent, CollisionComponent]);
//     return defineSystem((world: IWorld) => {
//         const entities = positionQuery(world);
//         // Fetch all obstacles from the scene
//         const obstacles = scene.children.getAll().filter(child => child.name === 'rockObstacle') as Phaser.GameObjects.Image[];
//         for (const eid of entities) {
//             const fishX = PositionComponent.x[eid];
//             const fishY = PositionComponent.y[eid];
//             const radius = CollisionComponent.radius[eid];
//             for (const obstacle of obstacles) {
//                 const distance = Phaser.Math.Distance.Between(fishX, fishY, obstacle.x, obstacle.y);
//                 if (distance < radius) {
//                     console.log(`Fish ${eid} collides with OBSTACLE at (${obstacle.x}, ${obstacle.y})`);
//                     // Temporarily disable sine wave movement
//                     MovementComponent.sineWaveDisabled[eid] = 1;
//                     let targetY: number;
//                     // Decide to move up or down
//                     if (fishY < obstacle.y) {
//                         targetY = Math.max(50, fishY - 150); // Move up
//                         console.log('Moving fish UP to avoid obstacle.');
//                     } else {
//                         targetY = Math.min(scene.cameras.main.height - 50, fishY + 150); // Move down
//                         console.log('Moving fish DOWN to avoid obstacle.');
//                     }
//                     const targetX = fishX + 150; // Move forward horizontally
//                     const startY = fishY;
//                     scene.tweens.add({
//                         targets: {},
//                         duration: 1000,
//                         ease: 'Power2',
//                         onUpdate: (tween) => {
//                             const progress = tween.progress;
//                             const currentY = Phaser.Math.Linear(startY, targetY, progress);
//                             const currentX = Phaser.Math.Linear(fishX, targetX, progress);
//                             // Update ECS Position
//                             PositionComponent.x[eid] = currentX;
//                             PositionComponent.y[eid] = currentY;
//                             MovementComponent.baseY[eid] = currentY;
//                         },
//                         onComplete: () => {
//                             MovementComponent.sineWaveDisabled[eid] = 0; // Re-enable sine wave logic
//                             console.log(`Fish ${eid} moved to (${targetX}, ${targetY})`);
//                         },
//                     });
//                     break; // Stop checking other obstacles
//                 }
//             }
//         }
//         return world;
//     });
// }

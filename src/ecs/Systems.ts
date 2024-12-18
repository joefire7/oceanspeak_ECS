import { defineSystem, defineQuery, enterQuery, IWorld } from 'bitecs';
import Phaser from 'phaser';
import { PositionComponent, FishComponent, Animation, CollisionComponent, MovementComponent, ObstacleComponent } from './components';


// Fish Movement System
export function createFishMovementSystem(scene: Phaser.Scene) {
    const query = defineQuery([PositionComponent, FishComponent]);

    return (world: IWorld) => {
        const time = scene.time.now;

        query(world).forEach((eid) => {
            if (FishComponent.sineWaveDisabled[eid] === 1) return;

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

// Fish Collision System
export const createFishCollisionSystem = (scene: Phaser.Scene) => {
    const fishQuery = defineQuery([PositionComponent, FishComponent]);
    const obstacleQuery = defineQuery([PositionComponent, ObstacleComponent]);

    return defineSystem((world: IWorld) => {
        const fishEntities = fishQuery(world);
        const obstacleEntities = obstacleQuery(world);

        for (const fishEntity of fishEntities) {
            const fishX = PositionComponent.x[fishEntity];
            const fishY = PositionComponent.y[fishEntity];
            const collisionRadius = 400; // Adjust collision radius as needed

            for (const obstacleEntity of obstacleEntities) {
                if (fishEntity === obstacleEntity) continue;

                const obsX = PositionComponent.x[obstacleEntity];
                const obsY = PositionComponent.y[obstacleEntity];

                const distance = Phaser.Math.Distance.Between(fishX, fishY, obsX, obsY);
                console.log(
                    `Fish ${fishEntity} Position: (${fishX}, ${fishY}), Obstacle ${obstacleEntity} Position: (${obsX}, ${obsY}), Distance=${distance}`
                );

                if (distance < collisionRadius) {
                    console.error(`Collision! Fish ${fishEntity} and Obstacle ${obstacleEntity}`);
                
                    const moveDistance = 150; // Distance to move
                    const targetX = fishX + moveDistance; // Move horizontally
                    const targetY = fishY < obsY ? fishY - moveDistance : fishY + moveDistance; // Move up or down
                
                    scene.tweens.add({
                        targets: {}, // No direct target sprite
                        duration: 1000, // Smooth animation over 1 second
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
                            console.log(`Fish ${fishEntity} moved to (${targetX}, ${targetY}).`);
                        },
                    });
                
                    break; // Stop further checks for this fish
                }
                
            }
        }

        return world;
    });
};

// Create Fish Render System
export const createFishRenderSystem = (scene: Phaser.Scene) => {
    const fishQuery = defineQuery([PositionComponent, FishComponent]);

    return (world: IWorld) => {
        fishQuery(world).forEach((fishEntity) => {
            // Get the Phaser sprite by entity name
            const fishSprite = scene.children.getByName(`fish_${fishEntity}`) as Phaser.GameObjects.Image;

            // Sync sprite position with ECS PositionComponent
            if (fishSprite) {
                fishSprite.x = PositionComponent.x[fishEntity];
                fishSprite.y = PositionComponent.y[fishEntity];
            }
        });

        return world;
    };
};


// Obstacle Animation System
export const createObstacleAnimationSystem = (scene: Phaser.Scene) => {
    const query = defineQuery([PositionComponent, Animation]);
    const enter = enterQuery(query);

    return defineSystem((world: IWorld) => {
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

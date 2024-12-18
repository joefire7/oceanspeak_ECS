import { defineComponent, Types } from 'bitecs';

// Position Component
export const PositionComponent = defineComponent({
    x: Types.f32,
    y: Types.f32,
});

// Fish Component
export const FishComponent = defineComponent({
    baseY: Types.f32,
    speed: Types.f32,
    sineWaveDisabled: Types.ui8,
    collisionRadius: Types.f32,
    collided: Types.ui8,
    isAvoiding: Types.ui8, // New property to temporarily disable sine wave logic
    spriteId: Types.ui32, // Use an index or a direct reference placeholder
});

// Animation Component
export const Animation = defineComponent({
    angleMin: Types.f32,          // Minimum rotation angle
    angleMax: Types.f32,          // Maximum rotation angle
    duration: Types.ui16,         // Duration of the tween animation
});

// Collision Component
export const CollisionComponent = defineComponent({
    radius: Types.f32,            // Collision radius
});

// Movement Component
export const MovementComponent = defineComponent({
    sineWaveDisabled: Types.ui8, // 0 = enabled, 1 = disabled
    baseY: Types.f32,            // Base Y position for sine wave logic
    velocityX: Types.f32,        // Horizontal velocity
    velocityY: Types.f32,        // Vertical velocity
});

export const ObstacleComponent = defineComponent({
    spriteId: Types.ui32, // Store sprite or a placeholder index
});


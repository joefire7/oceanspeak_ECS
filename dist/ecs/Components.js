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
    isAvoiding: Types.ui8,
    spriteId: Types.ui32, // Use an index or a direct reference placeholder
});
// Animation Component
export const Animation = defineComponent({
    angleMin: Types.f32,
    angleMax: Types.f32,
    duration: Types.ui16, // Duration of the tween animation
});
// Collision Component
export const CollisionComponent = defineComponent({
    radius: Types.f32, // Collision radius
});
// Movement Component
export const MovementComponent = defineComponent({
    sineWaveDisabled: Types.ui8,
    baseY: Types.f32,
    velocityX: Types.f32,
    velocityY: Types.f32, // Vertical velocity
});
export const ObstacleComponent = defineComponent({
    spriteId: Types.ui32, // Store sprite or a placeholder index
});

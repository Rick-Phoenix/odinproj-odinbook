import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

function FloatingDiv({ children, maxRange = 8 }: { children: ReactNode; maxRange?: number }) {
  const [scope, animate] = useAnimate();
  const isHovered = useRef(false);
  const animationRef = useRef<number | null>(null);

  // Physics parameters
  const currentPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

  // Constants for extremely slow, gentle movement
  const acceleration = 0.0003; // Ultra-low acceleration (3.3x slower than before)
  const damping = 0.995; // Even higher damping for smoother movement
  const maxVelocity = 0.04; // Half the previous max velocity
  const jitter = 0.005; // Reduced jitter for even more subtle effects

  // Choose a new random target position (very infrequently)
  const updateTargetPosition = () => {
    if (!isHovered.current) return;

    // Generate random target, but keep it within the maxRange
    // Using a smaller value than maxRange for targets to account for overshoot
    const targetRange = maxRange * 0.7;
    const randomX = (Math.random() * 2 - 1) * targetRange;
    const randomY = (Math.random() * 2 - 1) * targetRange;

    targetPosition.current = {
      x: randomX,
      y: randomY,
    };

    // Set timeout for next target update (longer intervals)
    setTimeout(updateTargetPosition, 6000 + Math.random() * 4000);
  };

  // Enforce boundary constraints
  const enforceConstraints = () => {
    // Get distance from center
    const distance = Math.sqrt(
      currentPosition.current.x * currentPosition.current.x +
        currentPosition.current.y * currentPosition.current.y
    );

    // If outside boundary, scale back position and reduce velocity
    if (distance > maxRange) {
      const scale = maxRange / distance;

      // Scale position back to boundary
      currentPosition.current.x *= scale;
      currentPosition.current.y *= scale;

      // Reduce velocity (simulate hitting a soft boundary)
      velocity.current.x *= 0.8;
      velocity.current.y *= 0.8;
    }
  };

  const applyPhysics = () => {
    if (!isHovered.current) {
      // When not hovered, immediately start moving back to origin
      animate(scope.current, { x: 0, y: 0 }, { duration: 1, ease: "easeOut" });

      // Reset physics variables
      currentPosition.current = { x: 0, y: 0 };
      velocity.current = { x: 0, y: 0 };
      targetPosition.current = { x: 0, y: 0 };

      // Stop the animation loop
      animationRef.current = null;
      return;
    }

    // Calculate acceleration toward target (with tiny random jitter)
    const accX = (targetPosition.current.x - currentPosition.current.x) * acceleration;
    const accY = (targetPosition.current.y - currentPosition.current.y) * acceleration;

    // Add a tiny bit of randomness for natural movement
    velocity.current.x += accX + (Math.random() * 2 - 1) * jitter;
    velocity.current.y += accY + (Math.random() * 2 - 1) * jitter;

    // Apply damping
    velocity.current.x *= damping;
    velocity.current.y *= damping;

    // Limit maximum velocity for gentler movement
    velocity.current.x = Math.max(Math.min(velocity.current.x, maxVelocity), -maxVelocity);
    velocity.current.y = Math.max(Math.min(velocity.current.y, maxVelocity), -maxVelocity);

    // Update position
    currentPosition.current.x += velocity.current.x;
    currentPosition.current.y += velocity.current.y;

    // Enforce boundary constraints
    enforceConstraints();

    // Apply the position to the element
    animate(
      scope.current,
      { x: currentPosition.current.x, y: currentPosition.current.y },
      { duration: 0, ease: "linear" }
    );

    // Continue animation
    animationRef.current = requestAnimationFrame(applyPhysics);
  };

  const handleHoverStart = () => {
    isHovered.current = true;

    // Start physics if not already running
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(applyPhysics);
    }

    // Set initial target position
    updateTargetPosition();
  };

  const handleHoverEnd = () => {
    isHovered.current = false;
    // In applyPhysics, we'll detect this and return to center
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={scope}
      className="z-10 bg-transparent"
      whileHover={{ scale: 1.5, zIndex: 20 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {children}
    </motion.div>
  );
}

export default FloatingDiv;

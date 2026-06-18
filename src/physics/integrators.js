const SOFTENING = 20;

export function computeAccelerations(bodies, gravitationalConstant) {
  for (const body of bodies) {
    body.acceleration.x = 0;
    body.acceleration.y = 0;
  }

  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const first = bodies[i];
      const second = bodies[j];
      const dx = second.position.x - first.position.x;
      const dy = second.position.y - first.position.y;
      const distanceSquared = dx * dx + dy * dy + SOFTENING * SOFTENING;
      const distance = Math.sqrt(distanceSquared);
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;

      const firstAcceleration = (gravitationalConstant * second.mass) / distanceSquared;
      const secondAcceleration = (gravitationalConstant * first.mass) / distanceSquared;

      first.acceleration.x += forceDirectionX * firstAcceleration;
      first.acceleration.y += forceDirectionY * firstAcceleration;
      second.acceleration.x -= forceDirectionX * secondAcceleration;
      second.acceleration.y -= forceDirectionY * secondAcceleration;
    }
  }
}

export function stepSemiImplicitEuler(bodies, dt, gravitationalConstant) {
  computeAccelerations(bodies, gravitationalConstant);

  for (const body of bodies) {
    body.velocity.x += body.acceleration.x * dt;
    body.velocity.y += body.acceleration.y * dt;
    body.position.x += body.velocity.x * dt;
    body.position.y += body.velocity.y * dt;
  }
}


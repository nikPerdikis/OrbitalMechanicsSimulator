export function createBody({ name, mass, radius, position, velocity, color }) {
  return {
    name,
    mass,
    radius,
    position: { ...position },
    velocity: { ...velocity },
    acceleration: { x: 0, y: 0 },
    color,
    trail: [],
  };
}

export function cloneBody(body) {
  return createBody({
    name: body.name,
    mass: body.mass,
    radius: body.radius,
    position: body.position,
    velocity: body.velocity,
    color: body.color,
  });
}


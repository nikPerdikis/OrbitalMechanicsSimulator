import { cloneBody } from "./body.js";
import { stepSemiImplicitEuler } from "./integrators.js";

const MAX_TRAIL_POINTS = 900;

export class Simulation {
  constructor(scenario) {
    this.gravitationalConstant = 0.08;
    this.loadScenario(scenario);
  }

  loadScenario(scenario) {
    this.scenario = scenario;
    this.bodies = scenario.bodies.map(cloneBody);
    this.elapsedDays = 0;
  }

  reset() {
    this.loadScenario(this.scenario);
  }

  step(dt) {
    stepSemiImplicitEuler(this.bodies, dt, this.gravitationalConstant);
    this.elapsedDays += dt;

    for (const body of this.bodies) {
      body.trail.push({ x: body.position.x, y: body.position.y });
      if (body.trail.length > MAX_TRAIL_POINTS) {
        body.trail.shift();
      }
    }
  }
}


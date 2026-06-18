import { Simulation } from "./physics/simulation.js";
import { calculateHohmannTransfer } from "./physics/hohmann.js";
import { scenarios, getScenario } from "./scenarios/presets.js";
import { setupControls, updateMetrics } from "./ui/controls.js";

const canvas = document.querySelector("#orbit-canvas");
const context = canvas.getContext("2d");
const simulation = new Simulation(scenarios[0]);

let controls;
let currentTransfer = null;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawSpaceBackground(width, height) {
  context.fillStyle = "#03070c";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  for (let i = 0; i < 120; i += 1) {
    const x = (i * 97) % width;
    const y = (i * 193) % height;
    context.fillRect(x, y, 1, 1);
  }
}

function drawSimulation() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;

  drawSpaceBackground(width, height);
  context.save();
  context.translate(centerX, centerY);

  drawHohmannOverlay();

  for (const body of simulation.bodies) {
    if (body.trail.length > 1) {
      context.beginPath();
      context.strokeStyle = `${body.color}99`;
      context.lineWidth = 1.5;
      context.moveTo(body.trail[0].x, body.trail[0].y);

      for (const point of body.trail) {
        context.lineTo(point.x, point.y);
      }

      context.stroke();
    }
  }

  for (const body of simulation.bodies) {
    const glow = context.createRadialGradient(
      body.position.x,
      body.position.y,
      0,
      body.position.x,
      body.position.y,
      body.radius * 3,
    );
    glow.addColorStop(0, body.color);
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = glow;
    context.beginPath();
    context.arc(body.position.x, body.position.y, body.radius * 3, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = body.color;
    context.beginPath();
    context.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawHohmannOverlay() {
  const innerRadius = Number(document.querySelector("#inner-radius").value);
  const outerRadius = Number(document.querySelector("#outer-radius").value);
  const periapsis = Math.min(innerRadius, outerRadius);
  const apoapsis = Math.max(innerRadius, outerRadius);
  const semiMajorAxis = (periapsis + apoapsis) / 2;
  const semiMinorAxis = Math.sqrt(periapsis * apoapsis);
  const ellipseCenterX = (apoapsis - periapsis) / 2;

  context.strokeStyle = "rgba(255, 255, 255, 0.22)";
  context.lineWidth = 1;
  context.beginPath();
  context.arc(0, 0, innerRadius, 0, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.arc(0, 0, outerRadius, 0, Math.PI * 2);
  context.stroke();

  context.save();
  context.strokeStyle = "#70d6c8";
  context.lineWidth = 2;
  context.setLineDash([8, 8]);
  context.beginPath();
  context.ellipse(
    ellipseCenterX,
    0,
    semiMajorAxis,
    semiMinorAxis,
    0,
    Math.PI,
    0,
    true,
  );
  context.stroke();
  context.restore();
}

function updateHohmannPanel() {
  currentTransfer = calculateHohmannTransfer({
    mu: simulation.gravitationalConstant * simulation.bodies[0].mass,
    innerRadius: document.querySelector("#inner-radius").value,
    outerRadius: document.querySelector("#outer-radius").value,
  });

  if (!currentTransfer) {
    return;
  }

  document.querySelector("#burn-one").textContent = currentTransfer.firstBurn.toFixed(2);
  document.querySelector("#burn-two").textContent = currentTransfer.secondBurn.toFixed(2);
  document.querySelector("#total-delta-v").textContent = currentTransfer.totalDeltaV.toFixed(2);
  document.querySelector("#transfer-time").textContent = `${Math.round(currentTransfer.transferTime)} days`;
}

function tick() {
  if (controls.isRunning) {
    for (let i = 0; i < controls.speed; i += 1) {
      simulation.step(controls.timestep);
    }
  }

  drawSimulation();
  updateHohmannPanel();
  updateMetrics(simulation);
  requestAnimationFrame(tick);
}

controls = setupControls({
  scenarios,
  simulation,
  onScenarioChange: (scenarioId) => simulation.loadScenario(getScenario(scenarioId)),
});

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
document.querySelector("#inner-radius").addEventListener("input", updateHohmannPanel);
document.querySelector("#outer-radius").addEventListener("input", updateHohmannPanel);
requestAnimationFrame(tick);

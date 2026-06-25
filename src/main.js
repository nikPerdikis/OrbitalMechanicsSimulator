import { calculateHohmannTransfer } from "./physics/hohmann.js";
import { designStarshipMission, planets } from "./physics/starshipMissions.js";

const canvas = document.querySelector("#orbit-canvas");
const context = canvas.getContext("2d");
const SANDBOX_MU = 7200;

let currentTransfer = null;
let activeMissionTargetId = null;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawTransferBackground(width, height) {
  context.fillStyle = "#03070c";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(112, 214, 200, 0.08)";
  context.lineWidth = 1;
  for (let radius = 80; radius < Math.max(width, height); radius += 80) {
    context.beginPath();
    context.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    context.stroke();
  }
}

function drawTransferVisualization() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;

  drawTransferBackground(width, height);
  context.save();
  context.translate(centerX, centerY);

  drawHohmannOverlay();
  drawCentralBody();
  drawStarshipMarker();

  context.restore();
}

function drawCentralBody() {
  const glow = context.createRadialGradient(0, 0, 0, 0, 0, 54);
  glow.addColorStop(0, "#4cc9f0");
  glow.addColorStop(1, "rgba(76, 201, 240, 0)");

  context.fillStyle = glow;
  context.beginPath();
  context.arc(0, 0, 54, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#4cc9f0";
  context.beginPath();
  context.arc(0, 0, 14, 0, Math.PI * 2);
  context.fill();
}

function drawStarshipMarker() {
  const innerRadius = Number(document.querySelector("#inner-radius").value);

  context.save();
  context.translate(innerRadius, 0);
  context.fillStyle = "#eef5f8";
  context.beginPath();
  context.moveTo(12, 0);
  context.lineTo(-8, -6);
  context.lineTo(-4, 0);
  context.lineTo(-8, 6);
  context.closePath();
  context.fill();
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
    mu: SANDBOX_MU,
    innerRadius: document.querySelector("#inner-radius").value,
    outerRadius: document.querySelector("#outer-radius").value,
  });

  if (!currentTransfer) {
    return;
  }

  document.querySelector("#burn-one").textContent = `${currentTransfer.firstBurn.toFixed(2)} sim u/day`;
  document.querySelector("#burn-two").textContent = `${currentTransfer.secondBurn.toFixed(2)} sim u/day`;
  document.querySelector("#total-delta-v").textContent =
    `${currentTransfer.totalDeltaV.toFixed(2)} sim u/day`;
  document.querySelector("#transfer-time").textContent = `${Math.round(currentTransfer.transferTime)} days`;
}

function setupStarshipMissionPlanner() {
  const missionSelect = document.querySelector("#mission-select");

  for (const profile of planets) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    missionSelect.append(option);
  }

  missionSelect.addEventListener("change", handleMissionTargetChange);
  document.querySelector("#leo-altitude").addEventListener("input", updateStarshipMissionPanel);
  document.querySelector("#target-orbit-altitude").addEventListener("input", updateStarshipMissionPanel);
  document.querySelector("#refill-propellant").addEventListener("input", updateStarshipMissionPanel);
  document.querySelector("#tanker-delivery").addEventListener("input", updateStarshipMissionPanel);
  updateStarshipMissionPanel();
}

function handleMissionTargetChange() {
  const selectedPlanet = planets.find((planet) => planet.id === document.querySelector("#mission-select").value);

  if (selectedPlanet) {
    document.querySelector("#target-orbit-altitude").value = selectedPlanet.defaultOrbitAltitudeKm;
  }

  updateStarshipMissionPanel();
}

function updateStarshipMissionPanel() {
  const targetId = document.querySelector("#mission-select").value;
  const selectedPlanet = planets.find((planet) => planet.id === targetId);

  if (selectedPlanet && targetId !== activeMissionTargetId) {
    document.querySelector("#target-orbit-altitude").value = selectedPlanet.defaultOrbitAltitudeKm;
    activeMissionTargetId = targetId;
  }

  const selectedMission = designStarshipMission({
    targetId,
    leoAltitudeKm: Number(document.querySelector("#leo-altitude").value),
    targetOrbitAltitudeKm: Number(document.querySelector("#target-orbit-altitude").value),
    propellantNeededAfterRefuelT: Number(document.querySelector("#refill-propellant").value),
    tankerDeliveryT: Number(document.querySelector("#tanker-delivery").value),
  });

  document.querySelector("#mission-launch").textContent =
    `${selectedMission.launchToLeoDeltaV.toFixed(1)} km/s`;
  document.querySelector("#mission-tankers").textContent =
    selectedMission.tankerLaunches.toLocaleString();
  document.querySelector("#mission-launches").textContent =
    selectedMission.totalLaunches.toLocaleString();
  document.querySelector("#mission-departure").textContent =
    `${selectedMission.transPlanetInjectionDeltaV.toFixed(2)} km/s`;
  document.querySelector("#mission-arrival").textContent =
    `${selectedMission.arrivalCaptureDeltaV.toFixed(2)} km/s`;
  document.querySelector("#mission-total-dv").textContent =
    `${selectedMission.missionDeltaVFromSurface.toFixed(2)} km/s`;
  document.querySelector("#mission-time").textContent =
    `${Math.round(selectedMission.transferDays).toLocaleString()} days`;
  document.querySelector("#mission-phase").textContent =
    `${selectedMission.phaseAngleDeg.toFixed(1)} deg`;
  document.querySelector("#mission-window").textContent =
    `${Math.round(selectedMission.synodicPeriodDays).toLocaleString()} days`;
  document.querySelector("#mission-architecture").textContent = selectedMission.architecture;
  document.querySelector("#mission-assumptions").textContent = selectedMission.assumptions;
  document.querySelector("#mission-caveat").textContent = selectedMission.caveat;
}

function tick() {
  drawTransferVisualization();
  updateHohmannPanel();
  requestAnimationFrame(tick);
}

setupStarshipMissionPlanner();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
document.querySelector("#inner-radius").addEventListener("input", updateHohmannPanel);
document.querySelector("#outer-radius").addEventListener("input", updateHohmannPanel);
requestAnimationFrame(tick);

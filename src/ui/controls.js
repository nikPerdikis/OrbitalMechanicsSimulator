export function setupControls({ scenarios, simulation, onScenarioChange }) {
  const scenarioSelect = document.querySelector("#scenario-select");
  const playToggle = document.querySelector("#play-toggle");
  const resetButton = document.querySelector("#reset-button");
  const speedSlider = document.querySelector("#speed-slider");
  const speedOutput = document.querySelector("#speed-output");
  const timestepSlider = document.querySelector("#timestep-slider");
  const timestepOutput = document.querySelector("#timestep-output");

  const state = {
    isRunning: true,
    speed: Number(speedSlider.value),
    timestep: Number(timestepSlider.value),
  };

  for (const scenario of scenarios) {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.append(option);
  }

  scenarioSelect.value = simulation.scenario.id;

  scenarioSelect.addEventListener("change", () => {
    onScenarioChange(scenarioSelect.value);
  });

  playToggle.addEventListener("click", () => {
    state.isRunning = !state.isRunning;
    playToggle.textContent = state.isRunning ? "Pause" : "Play";
  });

  resetButton.addEventListener("click", () => {
    simulation.reset();
  });

  speedSlider.addEventListener("input", () => {
    state.speed = Number(speedSlider.value);
    speedOutput.textContent = `${state.speed.toFixed(1)}x`;
  });

  timestepSlider.addEventListener("input", () => {
    state.timestep = Number(timestepSlider.value);
    timestepOutput.textContent = state.timestep.toFixed(1);
  });

  return state;
}

export function updateMetrics(simulation) {
  document.querySelector("#body-count").textContent = simulation.bodies.length;
  document.querySelector("#elapsed-days").textContent = Math.floor(simulation.elapsedDays).toLocaleString();
}


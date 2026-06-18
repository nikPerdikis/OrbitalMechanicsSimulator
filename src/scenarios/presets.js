import { createBody } from "../physics/body.js";

export const scenarios = [
  {
    id: "sun-earth-moon",
    name: "Sun, Earth, Moon",
    bodies: [
      createBody({
        name: "Sun",
        mass: 90000,
        radius: 18,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        color: "#ffd166",
      }),
      createBody({
        name: "Earth",
        mass: 90,
        radius: 7,
        position: { x: 260, y: 0 },
        velocity: { x: 0, y: 5.25 },
        color: "#4cc9f0",
      }),
      createBody({
        name: "Moon",
        mass: 2,
        radius: 3,
        position: { x: 286, y: 0 },
        velocity: { x: 0, y: 6.55 },
        color: "#d7dee8",
      }),
    ],
  },
  {
    id: "binary-stars",
    name: "Binary Stars",
    bodies: [
      createBody({
        name: "Star A",
        mass: 52000,
        radius: 15,
        position: { x: -120, y: 0 },
        velocity: { x: 0, y: -3.1 },
        color: "#ff8fab",
      }),
      createBody({
        name: "Star B",
        mass: 52000,
        radius: 15,
        position: { x: 120, y: 0 },
        velocity: { x: 0, y: 3.1 },
        color: "#70d6c8",
      }),
      createBody({
        name: "Outer Planet",
        mass: 40,
        radius: 6,
        position: { x: 0, y: 360 },
        velocity: { x: -4.7, y: 0 },
        color: "#f4a261",
      }),
    ],
  },
  {
    id: "three-body",
    name: "Chaotic Three-Body",
    bodies: [
      createBody({
        name: "A",
        mass: 25000,
        radius: 12,
        position: { x: -150, y: -40 },
        velocity: { x: 1.3, y: -1.6 },
        color: "#e9c46a",
      }),
      createBody({
        name: "B",
        mass: 25000,
        radius: 12,
        position: { x: 140, y: 35 },
        velocity: { x: -1.2, y: 1.7 },
        color: "#2a9d8f",
      }),
      createBody({
        name: "C",
        mass: 25000,
        radius: 12,
        position: { x: 20, y: 190 },
        velocity: { x: 2.1, y: -0.2 },
        color: "#f77f00",
      }),
    ],
  },
];

export function getScenario(id) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}


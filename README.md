# OrbitLab

OrbitLab is an interactive orbital mechanics simulator built for learning, experimenting, and demonstrating real-time N-body physics in the browser.

## Project Goal

This project is designed to be strong enough for a resume and simple enough to grow in stages. The first version focuses on a polished 2D simulator with:

- Newtonian gravity between multiple bodies
- Orbit trails
- A Hohmann transfer calculator for planning two-burn transfers between circular orbits
- Pause, reset, speed, and timestep controls
- Preset systems such as Sun-Earth-Moon and binary stars
- A clean structure that can later support RK4, Velocity Verlet, energy graphs, and 3D rendering

## Live Demo

After this repository is pushed to GitHub, enable GitHub Pages from the repository settings and choose the `main` branch root folder.

The site will be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## File Structure

```text
Orbit Simulations/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   └── README.md
├── docs/
│   └── project-plan.md
└── src/
    ├── main.js
    ├── styles.css
    ├── physics/
    │   ├── body.js
    │   ├── integrators.js
    │   └── simulation.js
    ├── scenarios/
    │   └── presets.js
    └── ui/
        └── controls.js
```

## Resume Description

**OrbitLab** - Built an interactive N-body orbital mechanics simulator using JavaScript Canvas, numerical integration, and real-time visualization of gravitational systems. Designed preset orbital scenarios, orbit trails, simulation controls, and a Hohmann transfer calculator for estimating two-burn orbital maneuvers.

## Next Milestones

1. Animate the Hohmann transfer spacecraft along the transfer ellipse.
2. Add selectable Euler, RK4, and Velocity Verlet integrators.
3. Add energy and momentum diagnostics.
4. Add click-and-drag body creation.
5. Add scenario sharing through URL parameters.
6. Add a short demo GIF to this README.

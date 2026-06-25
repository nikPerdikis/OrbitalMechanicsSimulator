# Starship Mission Lab

Starship Mission Lab is an interactive mission-planning simulator built for learning, experimenting, and modeling Starship-inspired missions from Earth's surface to planetary orbit across the solar system.

## Project Goal

This project is designed to be strong enough for a resume and simple enough to grow in stages. The first version focuses on a polished Starship transfer planner with:

- Starship mission profiles for Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune
- Launch-to-LEO, orbital refueling, transfer injection, and arrival capture estimates
- Launch-window phase angle and synodic-period geometry
- Real-unit mission estimates in `km/s`, metric tons, launch count, degrees, and days
- A Hohmann transfer calculator for planning two-burn transfers between circular orbits
- A focused transfer visualization without the earlier generic star-system sandbox
- A clean structure that can later support refueling estimates, launch windows, and mission sequence diagrams

## Live Demo

After this repository is pushed to GitHub, enable GitHub Pages from the repository settings and choose the `main` branch root folder.

The site will be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## File Structure

```text
OrbitalMechanicsSimulator/
|-- index.html
|-- README.md
|-- .gitignore
|-- assets/
|   `-- README.md
|-- docs/
|   |-- orbital-mechanics-notes.md
|   `-- project-plan.md
`-- src/
    |-- main.js
    |-- styles.css
    `-- physics/
        |-- hohmann.js
        `-- starshipMissions.js
```

## Resume Description

**Starship Mission Lab** - Built an interactive orbital mechanics simulator for modeling Starship-inspired missions from Earth's surface to planetary orbit. Implemented patched-conics transfer estimates, launch-to-orbit and refueling assumptions, arrival capture delta-v, launch-window geometry, Canvas transfer visualization, and learning notes that connect the UI to orbital mechanics concepts.

## Next Milestones

1. Add a visual Starship marker traveling along selected planetary transfers.
2. Add mission sequence diagrams for launch, refueling, transfer, capture, and landing.
3. Add aerocapture and direct-entry options where appropriate.
4. Add real ephemeris data instead of circular coplanar orbit assumptions.
5. Add scenario sharing through URL parameters.
6. Add a short demo GIF to this README.

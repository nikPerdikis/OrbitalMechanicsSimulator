# Starship Mission Lab Notes

This file is the study guide for the simulator. The goal is not just to make planets move, but to understand how a Starship-like spacecraft could use orbital mechanics to explore the solar system.

## Starship Focus

NASA describes the Human Landing System as the transportation mode that takes astronauts to the lunar surface during Artemis missions. NASA also identifies SpaceX's Starship HLS as a lunar lander concept for carrying astronauts from lunar orbit to the surface and back.

For this project, Starship is modeled as a mission architecture idea:

- Launch to Earth orbit
- Refuel in orbit for high-energy missions
- Perform a transfer burn
- Coast along an orbital transfer
- Match velocity and capture into orbit around the destination planet

The simulator now estimates launch to low Earth orbit, orbital refueling count, heliocentric transfer, launch-window geometry, and arrival capture. It still does not model detailed ascent guidance, atmospheric entry, propellant boiloff, life support, engine throttling, payload mass coupling, aerocapture, or landing dynamics.

## Core Ideas

### Gravity

Every body pulls every other body. Newton's law of gravitation says:

```text
F = G * m1 * m2 / r^2
```

For simulation code, force usually becomes acceleration:

```text
a = G * otherMass / r^2
```

That is why a heavy star strongly accelerates a planet, while the planet barely accelerates the star.

### Circular Orbit Speed

For a small spacecraft orbiting a much heavier central body:

```text
v = sqrt(mu / r)
```

where:

- `v` is circular orbital speed
- `r` is orbital radius from the center of the body
- `mu` is the standard gravitational parameter, equal to `G * centralMass`

Higher orbits are slower. Lower orbits are faster.

## Hohmann Transfers

A Hohmann transfer is a fuel-efficient way to move between two circular orbits around the same central body.

It uses two burns:

1. Burn at the starting orbit to enter an elliptical transfer orbit.
2. Burn at the target orbit to circularize again.

The transfer ellipse touches both circular orbits. Its semi-major axis is:

```text
a_transfer = (r1 + r2) / 2
```

The vis-viva equation gives the speed at any point on an orbit:

```text
v = sqrt(mu * (2 / r - 1 / a))
```

For the first burn:

```text
deltaV1 = transferSpeedAtR1 - circularSpeedAtR1
```

For the second burn:

```text
deltaV2 = circularSpeedAtR2 - transferSpeedAtR2
```

The transfer time is half the period of the transfer ellipse:

```text
t_transfer = pi * sqrt(a_transfer^3 / mu)
```

## Full Planetary Mission Model

The planetary mission planner uses a patched-conics approximation. That means it breaks one complicated mission into simpler pieces:

1. Earth launch to low Earth orbit.
2. Tanker launches to refill Starship in orbit.
3. Earth departure burn from parking orbit.
4. Heliocentric coast around the Sun.
5. Arrival capture burn into a circular orbit around the target planet.

### Launch To Orbit

The project uses a rough launch-to-LEO delta-v of:

```text
9.3 km/s
```

That includes orbital speed plus approximate gravity and drag losses. It is a simplified value, not a simulated ascent trajectory.

### Refueling Count

The tanker count is estimated with:

```text
tankerLaunches = ceil(refillTarget / propellantDeliveredPerTanker)
```

For example, a `1200 t` refill target and `100 t` per tanker gives:

```text
ceil(1200 / 100) = 12 tanker launches
```

The total launch count shown in the UI is:

```text
1 Starship mission launch + tanker launches
```

### Launch-Window Geometry

For a Hohmann transfer, the target planet needs to be at the right angle ahead of or behind Earth at departure. The app estimates the phase angle as:

```text
phaseAngle = 180 deg - targetMeanMotion * transferTime
```

The repeat time for similar opportunities is the synodic period:

```text
synodicPeriod = 360 deg / abs(EarthMeanMotion - targetMeanMotion)
```

This is useful for learning why Mars missions do not launch every month. The planets have to line up.

## Units In This Simulator

The sandbox transfer uses scaled, made-up units so the transfer shape looks good on screen.

- Distance is measured in `sim u`, meaning simulation distance units.
- Time is shown as `days`, but it is still scaled simulation time.
- Burns are shown as `sim u/day`, meaning simulation distance units per simulation day.

The Starship mission planner uses real orbital units:

- Distances are in `km`.
- Velocity changes are in `km/s`.
- Transfer time and launch-window repeat time are in `days`.

## What To Learn Next

1. Why lower orbits move faster than higher orbits.
2. Why a Hohmann transfer is tangent to both circular orbits.
3. How delta-v works like a "fuel budget" for spacecraft.
4. How patched conics approximate interplanetary missions.
5. How real missions use gravity assists, aerocapture, and launch windows.

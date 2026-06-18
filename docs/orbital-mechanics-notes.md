# Orbital Mechanics Notes

This file is the study guide for the simulator. The goal is not just to make planets move, but to understand why they move.

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

## What To Learn Next

1. Why lower orbits move faster than higher orbits.
2. Why a Hohmann transfer is tangent to both circular orbits.
3. How delta-v works like a "fuel budget" for spacecraft.
4. Why numerical integrators affect orbit stability.
5. How real missions use patched conics, gravity assists, and launch windows.


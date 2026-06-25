const DAY_SECONDS = 86400;
const SUN_MU = 132712440018;
const AU_KM = 149597870.7;
const EARTH_ORBIT_RADIUS_AU = 1;
const LAUNCH_TO_LEO_DELTA_V = 9.3;
const STARSHIP_PROPELLANT_CAPACITY_T = 1200;

export const planets = [
  {
    id: "mercury",
    name: "Mercury",
    radiusAu: 0.387098,
    mu: 22032,
    radiusKm: 2440,
    orbitPeriodDays: 87.969,
    defaultOrbitAltitudeKm: 300,
    useCase: "Solar science, high-temperature systems, and inner solar system cargo studies.",
  },
  {
    id: "venus",
    name: "Venus",
    radiusAu: 0.723332,
    mu: 324859,
    radiusKm: 6052,
    orbitPeriodDays: 224.701,
    defaultOrbitAltitudeKm: 300,
    useCase: "Atmospheric probes, aerobraking studies, and gravity-assist practice.",
  },
  {
    id: "mars",
    name: "Mars",
    radiusAu: 1.523679,
    mu: 42828,
    radiusKm: 3390,
    orbitPeriodDays: 686.98,
    defaultOrbitAltitudeKm: 300,
    useCase: "Cargo, surface hardware, propellant plant equipment, and future crew mission rehearsals.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radiusAu: 5.2044,
    mu: 126686534,
    radiusKm: 69911,
    orbitPeriodDays: 4332.59,
    defaultOrbitAltitudeKm: 10000,
    useCase: "Outer planet cargo concepts, large telescope deployment studies, and moon-system mission planning.",
  },
  {
    id: "saturn",
    name: "Saturn",
    radiusAu: 9.5826,
    mu: 37931187,
    radiusKm: 58232,
    orbitPeriodDays: 10759.22,
    defaultOrbitAltitudeKm: 10000,
    useCase: "Ring-system science, moon mission concepts, and long-duration cryogenic mission studies.",
  },
  {
    id: "uranus",
    name: "Uranus",
    radiusAu: 19.2184,
    mu: 5793939,
    radiusKm: 25362,
    orbitPeriodDays: 30685.4,
    defaultOrbitAltitudeKm: 5000,
    useCase: "Ice giant orbiter concepts and deep-space logistics studies.",
  },
  {
    id: "neptune",
    name: "Neptune",
    radiusAu: 30.1104,
    mu: 6836529,
    radiusKm: 24622,
    orbitPeriodDays: 60189,
    defaultOrbitAltitudeKm: 5000,
    useCase: "Deep-space cargo architecture and outer solar system exploration studies.",
  },
];

export const defaultMissionAssumptions = {
  leoAltitudeKm: 400,
  targetOrbitAltitudeKm: 300,
  propellantNeededAfterRefuelT: 1200,
  tankerDeliveryT: 100,
  launchToLeoDeltaV: LAUNCH_TO_LEO_DELTA_V,
};

function circularSpeed(mu, radiusKm) {
  return Math.sqrt(mu / radiusKm);
}

function transferSpeeds(mu, r1Km, r2Km) {
  const semiMajorAxis = (r1Km + r2Km) / 2;

  return {
    semiMajorAxis,
    speedAtR1: Math.sqrt(mu * ((2 / r1Km) - (1 / semiMajorAxis))),
    speedAtR2: Math.sqrt(mu * ((2 / r2Km) - (1 / semiMajorAxis))),
    transferDays: (Math.PI * Math.sqrt((semiMajorAxis ** 3) / mu)) / DAY_SECONDS,
  };
}

function normalizeDegrees(angle) {
  return ((angle % 360) + 360) % 360;
}

export function estimateRefuelingLaunches({
  propellantNeededAfterRefuelT = defaultMissionAssumptions.propellantNeededAfterRefuelT,
  tankerDeliveryT = defaultMissionAssumptions.tankerDeliveryT,
} = {}) {
  if (propellantNeededAfterRefuelT <= 0 || tankerDeliveryT <= 0) {
    return 0;
  }

  return Math.ceil(propellantNeededAfterRefuelT / tankerDeliveryT);
}

export function designStarshipMission({
  targetId,
  leoAltitudeKm = defaultMissionAssumptions.leoAltitudeKm,
  targetOrbitAltitudeKm,
  propellantNeededAfterRefuelT = defaultMissionAssumptions.propellantNeededAfterRefuelT,
  tankerDeliveryT = defaultMissionAssumptions.tankerDeliveryT,
} = {}) {
  const target = planets.find((planet) => planet.id === targetId) ?? planets[2];
  const resolvedTargetOrbitAltitudeKm =
    Number.isFinite(targetOrbitAltitudeKm) ? targetOrbitAltitudeKm : target.defaultOrbitAltitudeKm;

  const earthOrbitRadiusKm = EARTH_ORBIT_RADIUS_AU * AU_KM;
  const targetOrbitRadiusAroundSunKm = target.radiusAu * AU_KM;
  const earthCircularHeliocentricSpeed = circularSpeed(SUN_MU, earthOrbitRadiusKm);
  const targetCircularHeliocentricSpeed = circularSpeed(SUN_MU, targetOrbitRadiusAroundSunKm);
  const heliocentricTransfer = transferSpeeds(SUN_MU, earthOrbitRadiusKm, targetOrbitRadiusAroundSunKm);

  const departureVInfinity = Math.abs(heliocentricTransfer.speedAtR1 - earthCircularHeliocentricSpeed);
  const arrivalVInfinity = Math.abs(heliocentricTransfer.speedAtR2 - targetCircularHeliocentricSpeed);

  const earthParkingRadiusKm = 6378 + leoAltitudeKm;
  const earthParkingSpeed = circularSpeed(398600.4418, earthParkingRadiusKm);
  const earthEscapeSpeed = Math.sqrt((2 * 398600.4418) / earthParkingRadiusKm);
  const transPlanetInjectionDeltaV =
    Math.sqrt(departureVInfinity ** 2 + earthEscapeSpeed ** 2) - earthParkingSpeed;

  const targetParkingRadiusKm = target.radiusKm + resolvedTargetOrbitAltitudeKm;
  const targetParkingSpeed = circularSpeed(target.mu, targetParkingRadiusKm);
  const targetEscapeSpeed = Math.sqrt((2 * target.mu) / targetParkingRadiusKm);
  const arrivalCaptureDeltaV =
    Math.sqrt(arrivalVInfinity ** 2 + targetEscapeSpeed ** 2) - targetParkingSpeed;

  const targetMeanMotionDegPerDay = 360 / target.orbitPeriodDays;
  const earthMeanMotionDegPerDay = 360 / 365.256;
  const phaseAngleDeg = normalizeDegrees(180 - (targetMeanMotionDegPerDay * heliocentricTransfer.transferDays));
  const synodicPeriodDays =
    360 / Math.abs(earthMeanMotionDegPerDay - targetMeanMotionDegPerDay);
  const tankerLaunches = estimateRefuelingLaunches({
    propellantNeededAfterRefuelT,
    tankerDeliveryT,
  });

  return {
    target,
    architecture:
      "Earth surface launch -> low Earth orbit -> orbital refueling -> heliocentric transfer injection -> interplanetary coast -> target orbit capture.",
    assumptions:
      `Assumes ${leoAltitudeKm.toLocaleString()} km LEO, ${resolvedTargetOrbitAltitudeKm.toLocaleString()} km ${target.name} parking orbit, ${propellantNeededAfterRefuelT.toLocaleString()} t refill target, and ${tankerDeliveryT.toLocaleString()} t delivered per tanker.`,
    caveat:
      "Educational patched-conics estimate. It does not model ascent guidance, launch-site latitude, boiloff, engine throttling, aerocapture, landing, payload mass coupling, gravity assists, or real ephemerides.",
    useCase: target.useCase,
    launchToLeoDeltaV: LAUNCH_TO_LEO_DELTA_V,
    tankerLaunches,
    totalLaunches: 1 + tankerLaunches,
    transPlanetInjectionDeltaV,
    arrivalCaptureDeltaV,
    interplanetaryDeltaV: transPlanetInjectionDeltaV + arrivalCaptureDeltaV,
    missionDeltaVFromSurface:
      LAUNCH_TO_LEO_DELTA_V + transPlanetInjectionDeltaV + arrivalCaptureDeltaV,
    departureVInfinity,
    arrivalVInfinity,
    transferDays: heliocentricTransfer.transferDays,
    phaseAngleDeg,
    synodicPeriodDays,
    targetOrbitAltitudeKm: resolvedTargetOrbitAltitudeKm,
    leoAltitudeKm,
    propellantNeededAfterRefuelT,
    tankerDeliveryT,
    starshipPropellantCapacityT: STARSHIP_PROPELLANT_CAPACITY_T,
  };
}


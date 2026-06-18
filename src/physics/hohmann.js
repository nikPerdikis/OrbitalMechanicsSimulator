export function calculateHohmannTransfer({ mu, innerRadius, outerRadius }) {
  const r1 = Number(innerRadius);
  const r2 = Number(outerRadius);
  const standardGravitationalParameter = Number(mu);

  if (r1 <= 0 || r2 <= 0 || standardGravitationalParameter <= 0 || r1 === r2) {
    return null;
  }

  const transferSemiMajorAxis = (r1 + r2) / 2;
  const circularSpeed1 = Math.sqrt(standardGravitationalParameter / r1);
  const circularSpeed2 = Math.sqrt(standardGravitationalParameter / r2);
  const transferSpeedAtR1 = Math.sqrt(
    standardGravitationalParameter * ((2 / r1) - (1 / transferSemiMajorAxis)),
  );
  const transferSpeedAtR2 = Math.sqrt(
    standardGravitationalParameter * ((2 / r2) - (1 / transferSemiMajorAxis)),
  );

  const isRaisingOrbit = r2 > r1;
  const firstBurn = transferSpeedAtR1 - circularSpeed1;
  const secondBurn = circularSpeed2 - transferSpeedAtR2;
  const transferTime = Math.PI * Math.sqrt(
    (transferSemiMajorAxis ** 3) / standardGravitationalParameter,
  );

  return {
    isRaisingOrbit,
    transferSemiMajorAxis,
    circularSpeed1,
    circularSpeed2,
    transferSpeedAtR1,
    transferSpeedAtR2,
    firstBurn,
    secondBurn,
    totalDeltaV: Math.abs(firstBurn) + Math.abs(secondBurn),
    transferTime,
  };
}


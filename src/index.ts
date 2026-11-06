export interface Lab {
  readonly L: number;
  readonly a: number;
  readonly b: number;
}
function checked(c: Lab): Lab {
  for (const v of [c.L, c.a, c.b])
    if (typeof v !== 'number' || !Number.isFinite(v))
      throw new TypeError('Expected finite CIELAB coordinates');
  return c;
}
export function deltaE2000(first: Lab, second: Lab): number {
  checked(first);
  checked(second);
  const { L: L1, a: a1, b: b1 } = first,
    { L: L2, a: a2, b: b2 } = second;
  const C1 = Math.hypot(a1, b1),
    C2 = Math.hypot(a2, b2),
    Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1,
    ap2 = (1 + G) * a2,
    Cp1 = Math.hypot(ap1, b1),
    Cp2 = Math.hypot(ap2, b2);
  const hp = (a: number, b: number) => {
    if (a === 0 && b === 0) return 0;
    const h = (Math.atan2(b, a) * 180) / Math.PI;
    return h < 0 ? h + 360 : h;
  };
  const h1 = hp(ap1, b1),
    h2 = hp(ap2, b2),
    dL = L2 - L1,
    dC = Cp2 - Cp1;
  let dh = h2 - h1;
  if (Cp1 * Cp2 === 0) dh = 0;
  else if (dh > 180) dh -= 360;
  else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dh * Math.PI) / 360);
  const Lbar = (L1 + L2) / 2,
    Cbarp = (Cp1 + Cp2) / 2;
  let hbar = h1 + h2;
  if (Cp1 * Cp2 === 0) hbar = h1 + h2;
  else if (Math.abs(h1 - h2) <= 180) hbar = (h1 + h2) / 2;
  else if (h1 + h2 < 360) hbar = (h1 + h2 + 360) / 2;
  else hbar = (h1 + h2 - 360) / 2;
  const T =
    1 -
    0.17 * Math.cos(((hbar - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbar * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbar + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbar - 63) * Math.PI) / 180);
  const dTheta = 30 * Math.exp(-(((hbar - 275) / 25) ** 2)),
    Rc = 2 * Math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbar - 50) ** 2) / Math.sqrt(20 + (Lbar - 50) ** 2),
    Sc = 1 + 0.045 * Cbarp,
    Sh = 1 + 0.015 * Cbarp * T;
  const Rt = -Math.sin((2 * dTheta * Math.PI) / 180) * Rc;
  const l = dL / Sl,
    c = dC / Sc,
    h = dH / Sh;
  return Math.sqrt(Math.max(0, l * l + c * c + h * h + Rt * c * h));
}

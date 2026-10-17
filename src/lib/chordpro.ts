// Utilidades ChordPro: parseo, transposición y conversión. Sin dependencias de servidor.

const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTE_INDEX: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6,
  G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

export const KEYS = [
  "C", "C#", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B",
  "Cm", "C#m", "Dm", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "Bbm", "Bm",
];

const CHORD_RE = /^([A-G])([#b]?)([^/\s]*)(?:\/([A-G])([#b]?))?$/;

export function isChord(token: string): boolean {
  const m = CHORD_RE.exec(token);
  if (!m) return false;
  // el sufijo debe parecer calidad de acorde (m, 7, maj7, sus4, dim, add9, +, etc.)
  return /^(m|M|maj|min|dim|aug|sus|add|\+|°|ø|-|\d|\(|\)|#|b)*$/.test(m[3]);
}

/** ¿El tono usa bemoles? (F, Bb, Eb, Ab, Db, Gb y sus relativos menores) */
export function keyPrefersFlats(key: string | null | undefined): boolean {
  if (!key) return false;
  const m = /^([A-G])([#b]?)(m?)/.exec(key);
  if (!m) return false;
  let idx = NOTE_INDEX[m[1] + m[2]];
  if (idx === undefined) return false;
  if (m[3] === "m") idx = (idx + 3) % 12; // relativo mayor
  return [5, 10, 3, 8, 1, 6].includes(idx);
}

function shiftNote(note: string, steps: number, flat: boolean): string {
  const i = NOTE_INDEX[note];
  if (i === undefined) return note;
  const n = (((i + steps) % 12) + 12) % 12;
  return (flat ? FLAT : SHARP)[n];
}

export function transposeChord(chord: string, steps: number, flat: boolean): string {
  const m = CHORD_RE.exec(chord);
  if (!m) return chord;
  const root = shiftNote(m[1] + m[2], steps, flat);
  const bass = m[4] ? "/" + shiftNote(m[4] + m[5], steps, flat) : "";
  return root + m[3] + bass;
}

export function transposeKey(key: string | null | undefined, steps: number): string | null {
  if (!key) return null;
  const m = /^([A-G][#b]?)(m?)$/.exec(key);
  if (!m) return key;
  const newRoot = shiftNote(m[1], steps, false);
  // elegir grafía (# o b) según el nuevo tono
  return shiftNote(m[1], steps, keyPrefersFlats(newRoot + m[2])) + m[2];
}

/** Transpone todos los [acordes] del texto. */
export function transposeContent(content: string, steps: number, flat: boolean): string {
  if (steps === 0) return content;
  return content.replace(/\[([^\]\n]+)\]/g, (all, c: string) =>
    isChord(c.trim()) ? `[${transposeChord(c.trim(), steps, flat)}]` : all,
  );
}

export type Segment = { chord?: string; text: string };
export type Line =
  | { type: "lyrics"; segments: Segment[] }
  | { type: "comment"; text: string }
  | { type: "chorus"; open: boolean }
  | { type: "blank" };

const DIRECTIVE_RE = /^\{\s*([a-z_]+)\s*(?::\s*(.*?))?\s*\}$/i;

export function parseChordPro(content: string): Line[] {
  const out: Line[] = [];
  for (const raw of content.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) { out.push({ type: "blank" }); continue; }
    const d = DIRECTIVE_RE.exec(line.trim());
    if (d) {
      const name = d[1].toLowerCase();
      if (name === "soc" || name === "start_of_chorus") out.push({ type: "chorus", open: true });
      else if (name === "eoc" || name === "end_of_chorus") out.push({ type: "chorus", open: false });
      else if (name === "c" || name === "comment" || name === "sov" || name === "start_of_verse")
        out.push({ type: "comment", text: d[2] ?? (name.startsWith("s") ? "Verso" : "") });
      continue; // title/key/etc. se ignoran en el cuerpo
    }
    const segments: Segment[] = [];
    const re = /\[([^\]]*)\]/g;
    let last = 0;
    let pendingChord: string | undefined;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) {
      const text = line.slice(last, m.index);
      if (text || pendingChord) segments.push({ chord: pendingChord, text });
      pendingChord = m[1].trim();
      last = m.index + m[0].length;
    }
    segments.push({ chord: pendingChord, text: line.slice(last) });
    // si la primera "pieza" está vacía y sin acorde, descartarla
    const clean = segments.filter((s, i) => !(i === 0 && !s.chord && !s.text));
    out.push({ type: "lyrics", segments: clean });
  }
  return out;
}

/**
 * Convierte texto con acordes en una línea y letra debajo
 * al formato ChordPro con [acordes] insertados en la posición.
 */
export function convertChordsOverLyrics(text: string): string {
  const lines = text.replace(/\r/g, "").split("\n");
  const isChordLine = (l: string) => {
    const toks = l.trim().split(/\s+/).filter(Boolean);
    return toks.length > 0 && toks.every(isChord);
  };
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!isChordLine(l)) { out.push(l); continue; }
    const next = lines[i + 1];
    const positions: { col: number; chord: string }[] = [];
    for (const m of l.matchAll(/\S+/g)) positions.push({ col: m.index!, chord: m[0] });
    if (next !== undefined && next.trim() && !isChordLine(next)) {
      let result = "";
      let cursor = 0;
      for (const p of positions) {
        const col = Math.min(p.col, next.length);
        result += next.slice(cursor, col) + `[${p.chord}]`;
        cursor = col;
      }
      result += next.slice(cursor);
      out.push(result);
      i++;
    } else {
      out.push(positions.map((p) => `[${p.chord}]`).join(" "));
    }
  }
  return out.join("\n");
}

/** Acordes diatónicos del tono (I ii iii IV V vi) para botones rápidos. */
export function diatonicChords(key: string | null | undefined): string[] {
  const m = key ? /^([A-G][#b]?)(m?)$/.exec(key) : null;
  const root = m ? m[1] : "C";
  const minor = m?.[2] === "m";
  const flat = keyPrefersFlats(key);
  const base = minor ? shiftNote(root, 3, flat) : root; // relativo mayor
  const deg = (s: number, q = "") => shiftNote(base, s, flat) + q;
  return [deg(0), deg(2, "m"), deg(4, "m"), deg(5), deg(7), deg(9, "m")];
}

/** Semitonos (-6..5) para pasar del tono rom al tono 	o. */
export function semitonesBetween(from: string | null | undefined, to: string | null | undefined): number {
  const a = from ? /^([A-G][#b]?)/.exec(from) : null;
  const b = to ? /^([A-G][#b]?)/.exec(to) : null;
  if (!a || !b) return 0;
  const d = (((NOTE_INDEX[b[1]] - NOTE_INDEX[a[1]]) % 12) + 12) % 12;
  return d > 6 ? d - 12 : d;
}

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

const CHORD_RE = /^([A-G])([#b]?)(.*?)(?:\/([A-G])([#b]?))?$/;

export function isChord(token: string): boolean {
  const clean = token.trim().replace(/^[()]+|[()]+$/g, "").trim();
  if (!clean) return false;
  // Soportar acordes compuestos tipo Asus4-A o G-F#m-Em
  if (clean.includes("-") && !clean.includes("(")) {
    const parts = clean.split("-").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1 && parts.every((p) => isSingleChord(p))) return true;
  }
  return isSingleChord(clean);
}

function isSingleChord(token: string): boolean {
  const m = CHORD_RE.exec(token);
  if (!m) return false;
  // el sufijo debe parecer calidad de acorde (m, 7, maj7, sus4, dim, add9, +, 9/11, etc.)
  return /^(m|M|maj|min|dim|aug|sus|add|\+|°|ø|-|\/|\d|\(|\)|#|b)*$/.test(m[3]);
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
  const trimmed = chord.trim();
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    return `(${transposeChord(trimmed.slice(1, -1), steps, flat)})`;
  }
  if (trimmed.includes("-") && !trimmed.includes("(")) {
    const parts = trimmed.split("-");
    if (parts.length > 1 && parts.every((p) => isSingleChord(p.trim()))) {
      return parts.map((p) => transposeSingleChord(p.trim(), steps, flat)).join("-");
    }
  }
  return transposeSingleChord(trimmed, steps, flat);
}

function transposeSingleChord(chord: string, steps: number, flat: boolean): string {
  const m = CHORD_RE.exec(chord);
  if (!m) return chord;
  const root = shiftNote(m[1] + m[2], steps, flat);
  const bass = m[4] ? "/" + shiftNote(m[4] + m[5], steps, flat) : "";
  return root + m[3] + bass;
}

export function transposeKey(key: string | null | undefined, steps: number): string | null {
  if (!key) return null;
  const clean = key.trim();
  const m = /^([A-G][#b]?)(m?)$/i.exec(clean);
  if (!m) return clean;
  const rootNote = m[1].toUpperCase();
  const isMinor = m[2].toLowerCase() === "m";
  const newRoot = shiftNote(rootNote, steps, false);
  // elegir grafía (# o b) según el nuevo tono
  return shiftNote(rootNote, steps, keyPrefersFlats(newRoot + (isMinor ? "m" : ""))) + (isMinor ? "m" : "");
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
  | { type: "blank" }
  | { type: "section_break"; text?: string };

const DIRECTIVE_RE = /^\{\s*([a-z_]+)\s*(?::\s*(.*?))?\s*\}$/i;
const SECTION_PREFIX_RE =
  /^(intro|int|verso|coro|puente|pre-coro|pre-estribillo|estribillo|estrofa|outro|solo|final|interludio|interl[uú]dio|instrumental|refr[aã]o|ponte|parte\s*\d*|primera\s+parte|segunda\s+parte|tercera\s+parte|cuarta\s+parte)\b/i;
const TAB_LINE_RE = /^[eEaAdDgGbB1-6]\|[-0-9pbrh~/\s|]+|^[-\s|0-9pbrh~]{10,}$/;

/**
 * Determina si los segmentos de una línea corresponden únicamente a acordes / anotaciones
 * sin letra cantable debajo.
 */
export function isLineChordOnly(segments: Segment[]): boolean {
  const rawText = segments
    .map((s) => s.text)
    .join("")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
  if (!rawText) return true;

  const hasAnyChord = segments.some((s) => s.chord && isChord(s.chord));
  if (!hasAnyChord) return false;

  // Limpiar anotaciones típicas en líneas de acordes: (2x), (riff 1), Intro:, paréntesis, guiones, barras
  const stripped = rawText
    .replace(/\(\s*(?:\d+\s*x|x\s*\d+|riff\s*\d*|solo\s*\d*|intro|passagem|instrumental|bis)\s*\)/gi, "")
    .replace(
      /^(?:intro|int|solo|puente|interludio|interl[uú]dio|final|outro|instrumental|coro|verso|estribillo|refr[aã]o|ponte)\s*:\s*/i,
      "",
    )
    .replace(/[()\-–.,/*|│=\s]+/g, "")
    .trim();

  if (!stripped) return true;

  // Si los tokens restantes fuera de corchetes son también acordes (ej. "[Intro] Em D C B")
  const remTokens = stripped.split(/\s+/).filter(Boolean);
  if (remTokens.length > 0 && remTokens.every((t) => isChord(t))) return true;

  return false;
}

function isPlainChordLine(line: string): boolean {
  const trimmed = line.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (!trimmed || trimmed.includes("[") || trimmed.includes("{")) return false;
  if (TAB_LINE_RE.test(trimmed) || SECTION_PREFIX_RE.test(trimmed)) return false;
  const cleaned = trimmed
    .replace(/\(\s*(?:\d+\s*x|x\s*\d+|riff\s*\d*|bis)\s*\)/gi, "")
    .replace(/[()\-–.,/*|│=]+/g, " ")
    .trim();
  const toks = cleaned.split(/\s+/).filter(Boolean);
  return toks.length > 0 && toks.every((t) => isChord(t));
}

function isAttachableChordLine(line: string): boolean {
  const trimmed = line.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (!trimmed) return false;
  if (DIRECTIVE_RE.test(trimmed) || /^---{2,}$|^==={2,}$/.test(trimmed)) return false;
  if (TAB_LINE_RE.test(trimmed)) return false;

  // Progresiones instrumentales encerradas completamente entre paréntesis: "( [C] [G] [F] )"
  if (trimmed.startsWith("(") && trimmed.endsWith(")") && trimmed.indexOf(")") === trimmed.length - 1) {
    return false;
  }

  // Líneas que empiezan con etiqueta de sección como "Intro: [D] [A]"
  if (SECTION_PREFIX_RE.test(trimmed)) return false;

  if (trimmed.includes("[")) {
    const bracketMatches = Array.from(trimmed.matchAll(/\[([^\]]*)\]/g));
    if (bracketMatches.length === 0) return false;
    // Todos los tokens entre corchetes deben ser acordes reales (no "[Intro]" ni "[Primera Parte]")
    if (!bracketMatches.every((m) => isChord(m[1].trim()))) return false;

    const outside = trimmed
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\(\s*(?:\d+\s*x|x\s*\d+|riff\s*\d*|solo\s*\d*|passagem|bis)\s*\)/gi, "")
      .replace(/[()\-–.,/*|│=\s]+/g, "")
      .trim();
    return outside.length === 0;
  }

  return isPlainChordLine(trimmed);
}

function isReceivableLyricLine(line: string | undefined): boolean {
  if (line === undefined) return false;
  const trimmed = line.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (!trimmed) return false;
  if (DIRECTIVE_RE.test(trimmed) || /^---{2,}$|^==={2,}$/.test(trimmed)) return false;
  if (TAB_LINE_RE.test(trimmed)) return false;
  if (trimmed.includes("[")) return false;
  if (isPlainChordLine(trimmed)) return false;
  if (/^(?:intro|int|solo|puente|interludio|interl[uú]dio|final|outro|instrumental|coro|verso|estribillo|refr[aã]o|ponte)\s*:/i.test(trimmed)) {
    return false;
  }
  return true;
}

function extractChordPositions(chordLine: string): { col: number; endCol: number; chord: string }[] {
  const positions: { col: number; endCol: number; chord: string }[] = [];
  if (chordLine.includes("[")) {
    const re = /\(\s*\[([^\]]+)\]\s*\)|\[([^\]]+)\]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(chordLine)) !== null) {
      const chord = m[1] ? `(${m[1].trim()})` : m[2].trim();
      if (chord) {
        positions.push({ col: m.index, endCol: m.index + m[0].length, chord });
      }
    }
  } else {
    for (const m of chordLine.matchAll(/\S+/g)) {
      const raw = m[0];
      const clean = raw.replace(/^[()\-.,]+|[()\-.,]+$/g, "");
      if (isChord(clean)) {
        positions.push({ col: m.index!, endCol: m.index! + raw.length, chord: clean });
      }
    }
  }
  return positions;
}

function mergeChordAndLyricLines(chordLine: string, lyricLine: string): Segment[] {
  const positions = extractChordPositions(chordLine);
  if (positions.length === 0) {
    return [{ text: lyricLine }];
  }

  const segments: Segment[] = [];
  const firstCol = positions[0].col;

  if (firstCol > 0) {
    const preText = lyricLine.slice(0, Math.min(firstCol, lyricLine.length));
    if (preText) {
      segments.push({ text: preText });
    }
    if (firstCol > lyricLine.length) {
      segments.push({ text: " ".repeat(firstCol - lyricLine.length) });
    }
  }

  for (let i = 0; i < positions.length; i++) {
    const cur = positions[i];
    const next = positions[i + 1];
    const start = cur.col;
    const end = next ? next.col : lyricLine.length;

    const lyricSlice = start < lyricLine.length ? lyricLine.slice(start, Math.min(end, lyricLine.length)) : "";
    segments.push({ chord: cur.chord, text: lyricSlice });

    if (next && next.col > lyricLine.length) {
      const gapStart = Math.max(lyricLine.length, start, cur.endCol);
      const extraSpaces = Math.max(0, next.col - gapStart);
      if (extraSpaces > 0) {
        segments.push({ text: " ".repeat(extraSpaces) });
      }
    }
  }

  return segments;
}

export function parseChordPro(content: string): Line[] {
  const out: Line[] = [];
  const rawLines = content
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r/g, "")
    .split("\n");

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx].trimEnd();
    if (!line.trim()) {
      if (out.length > 0 && out[out.length - 1].type === "blank") continue;
      // Evitar dejar hueco vacío justo debajo de un encabezado de sección ([Primera Parte], [Estribillo], etc.)
      if (out.length > 0 && isSectionHeaderLine(out[out.length - 1])) continue;
      out.push({ type: "blank" });
      continue;
    }
    const d = DIRECTIVE_RE.exec(line.trim());
    if (d) {
      const name = d[1].toLowerCase();
      if (name === "soc" || name === "start_of_chorus") out.push({ type: "chorus", open: true });
      else if (name === "eoc" || name === "end_of_chorus") out.push({ type: "chorus", open: false });
      else if (name === "c" || name === "comment" || name === "sov" || name === "start_of_verse")
        out.push({ type: "comment", text: d[2] ?? (name.startsWith("s") ? "Verso" : "") });
      else if (
        name === "colb" ||
        name === "column_break" ||
        name === "page_break" ||
        name === "np" ||
        name === "new_page" ||
        name === "salto" ||
        name === "salto_seccion"
      ) {
        out.push({ type: "section_break", text: d[2] || undefined });
      }
      continue; // title/key/etc. se ignoran en el cuerpo
    }

    if (/^---{2,}$|^==={2,}$/.test(line.trim())) {
      out.push({ type: "section_break" });
      continue;
    }

    // Si es una línea de acordes situada encima de una línea de letra, anclar los acordes a la posición exacta de la letra
    const nextRaw = idx + 1 < rawLines.length ? rawLines[idx + 1].trimEnd() : undefined;
    if (isAttachableChordLine(line) && isReceivableLyricLine(nextRaw)) {
      const merged = mergeChordAndLyricLines(line, nextRaw!);
      out.push({ type: "lyrics", segments: merged });
      idx++; // Consumir la línea de letra ya fusionada
      continue;
    }

    // Si es una línea de acordes planos sin corchetes (ej. pegada manualmente sin []), convertir sus acordes en segmentos
    if (isPlainChordLine(line)) {
      const segments: Segment[] = [];
      let last = 0;
      let pendingChord: string | undefined;
      for (const m of line.matchAll(/\S+/g)) {
        const text = line.slice(last, m.index!);
        if (text || pendingChord) segments.push({ chord: pendingChord, text });
        pendingChord = m[0];
        last = m.index! + m[0].length;
      }
      segments.push({ chord: pendingChord, text: line.slice(last) });
      const clean = segments.filter((s, i) => !(i === 0 && !s.chord && !s.text));
      out.push({ type: "lyrics", segments: clean });
      continue;
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
 * Detecta si una línea corresponde al inicio de una sección (Intro, Verso, Coro, Puente, etc.)
 */
export function isSectionHeaderLine(line: Line): boolean {
  if (line.type === "comment") return true;
  if (line.type === "lyrics") {
    if (line.segments.length === 1 && line.segments[0].chord && !isChord(line.segments[0].chord)) {
      return true;
    }
    if (
      line.segments.length > 0 &&
      line.segments[0].chord &&
      /^(intro|verso|coro|puente|pre-coro|estrofa|outro|solo|final|interludio)/i.test(
        line.segments[0].chord.trim(),
      )
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Divide las líneas de una canción en bloques equilibrados para el modo 2 columnas.
 * Evita que la 2ª columna muestre el final de la canción y permite que
 * la parte superior tenga 2 columnas (inicio y coro), y la inferior
 * 2 columnas (con el resto de la canción).
 */
export function partitionSongLines(lines: Line[], targetLinesPerBlock = 30): Line[][] {
  // 1. Si hay saltos de sección explícitos ({colb}, {salto}, etc.)
  const hasExplicitBreaks = lines.some((l) => l.type === "section_break");
  if (hasExplicitBreaks) {
    const blocks: Line[][] = [];
    let current: Line[] = [];
    for (const l of lines) {
      if (l.type === "section_break") {
        if (current.length) blocks.push(current);
        current = [];
      } else {
        current.push(l);
      }
    }
    if (current.length) blocks.push(current);
    return blocks.length ? blocks : [lines];
  }

  // 2. Conteo de líneas de contenido real
  const totalContentLines = lines.filter((l) => l.type !== "blank").length;

  // Si la canción es corta (<= 32 líneas), 1 solo bloque de 2 columnas basta y cabe de inmediato
  if (totalContentLines <= 32) {
    return [lines];
  }

  // Canciones medianas / largas: dividir en bloques equilibrados (mínimo 2 bloques: superior e inferior)
  const numBlocks = Math.max(2, Math.round(totalContentLines / targetLinesPerBlock));
  const targetPerBlock = Math.ceil(totalContentLines / numBlocks);

  const blocks: Line[][] = [];
  let currentBlock: Line[] = [];
  let currentCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    currentBlock.push(line);
    if (line.type !== "blank") currentCount++;

    // Verificar si es un punto natural para el salto de sección
    if (blocks.length < numBlocks - 1 && currentCount >= targetPerBlock - 4) {
      const isBlank = line.type === "blank";
      const nextIsHeader = i + 1 < lines.length && isSectionHeaderLine(lines[i + 1]);

      if (isBlank || nextIsHeader || currentCount >= targetPerBlock + 6) {
        blocks.push(currentBlock);
        currentBlock = [];
        currentCount = 0;
      }
    }
  }

  if (currentBlock.length) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Convierte texto con acordes en una línea y letra debajo
 * al formato ChordPro con [acordes] insertados en la posición.
 */
export function convertChordsOverLyrics(text: string): string {
  const lines = text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r/g, "")
    .split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trimEnd();
    const next = i + 1 < lines.length ? lines[i + 1].trimEnd() : undefined;
    if (isAttachableChordLine(l) && isReceivableLyricLine(next)) {
      const merged = mergeChordAndLyricLines(l, next!);
      const inline = merged
        .map((s) => `${s.chord ? `[${s.chord}]` : ""}${s.text}`)
        .join("");
      out.push(inline);
      i++;
      continue;
    }
    if (isPlainChordLine(l)) {
      const positions = extractChordPositions(l);
      let lineOut = "";
      for (const p of positions) {
        const spaces = Math.max(lineOut.length === 0 ? p.col : 1, p.col - lineOut.length);
        lineOut += " ".repeat(spaces) + `[${p.chord}]`;
      }
      out.push(lineOut);
      continue;
    }
    out.push(l);
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

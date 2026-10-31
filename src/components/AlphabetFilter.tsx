import Link from "next/link";

const LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"
];

interface AlphabetFilterProps {
  currentLetter?: string;
  baseUrl: string;
  preserveParams?: Record<string, string | undefined>;
  allLabel?: string;
}

export default function AlphabetFilter({
  currentLetter = "",
  baseUrl,
  preserveParams = {},
  allLabel = "Todas",
}: AlphabetFilterProps) {
  const normCurrent = currentLetter.trim().toUpperCase();

  const buildUrl = (letter?: string) => {
    const params = new URLSearchParams();

    // Preservar otros parámetros relevantes (por ejemplo, 'q' o 'artist')
    for (const [key, value] of Object.entries(preserveParams)) {
      if (value && value.trim() && key !== "letter" && key !== "page") {
        params.set(key, value.trim());
      }
    }

    if (letter && letter !== "ALL") {
      params.set("letter", letter);
    }

    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  };

  const isAllActive = !normCurrent || normCurrent === "ALL";

  return (
    <nav className="alphabet-bar" aria-label="Filtro alfabético">
      <Link
        href={buildUrl()}
        className={`alphabet-btn ${isAllActive ? "active" : ""}`}
        style={{ minWidth: "56px" }}
        title="Mostrar todas"
      >
        {allLabel}
      </Link>

      {LETTERS.map((letter) => {
        const isActive = normCurrent === letter;
        return (
          <Link
            key={letter}
            href={buildUrl(letter)}
            className={`alphabet-btn ${isActive ? "active" : ""}`}
            title={`Filtrar por letra ${letter}`}
          >
            {letter}
          </Link>
        );
      })}
    </nav>
  );
}

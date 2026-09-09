import Image from "next/image";
import { QueryCaseMarkdown } from "./QueryCaseMarkdown";
import type { QueryFigure } from "@/lib/query-case";

export function QueryCaseFigure({ figure, cover = false }: { figure: QueryFigure; cover?: boolean }) {
  const isResearch = figure.number === 4 || figure.number === 5;
  return (
    <figure className={`query-figure ${cover ? "query-cover" : ""} ${isResearch ? "query-research-figure" : ""}`} data-figure={figure.number}>
      <div className="query-image-frame">
        <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes={isResearch ? "(max-width: 760px) 90vw, 680px" : "(max-width: 760px) 94vw, 1120px"} priority={cover} unoptimized />
      </div>
      {figure.caption ? <figcaption><QueryCaseMarkdown>{figure.caption}</QueryCaseMarkdown></figcaption> : null}
    </figure>
  );
}


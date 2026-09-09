import snapshot from "@/content/from-query-to-quest.generated.json";

export type QueryFigure = { kind: "figure"; src: string; alt: string; caption: string; number: number; width: number; height: number };
export type QueryText = { kind: "text"; markdown: string };
export type QueryBlock = QueryFigure | QueryText;
export type QuerySection = { id: string; heading: string; blocks: QueryBlock[] };

function blocksFrom(markdown: string): QueryBlock[] {
  const paragraphs = markdown.trim().split(/\n\s*\n/).filter((part) => part.trim() !== "---");
  const blocks: QueryBlock[] = [];
  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index];
    const image = paragraph.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\n([\s\S]*))?$/);
    if (image) {
      const next = paragraphs[index + 1];
      // Captions may follow on the next line or after a blank line. Their copy
      // is independent of the stable media identity used by layout groupings.
      const inlineCaption = image[3] || "";
      const separateCaption = !inlineCaption && /^\*(?!\*)[^\n]+\*$/.test(next || "") ? next : "";
      const caption = inlineCaption || separateCaption;
      if (separateCaption) index++;
      const mediaIndex = snapshot.media.findIndex((item) => item.src === image[2]);
      const media = snapshot.media[mediaIndex];
      blocks.push({ kind: "figure", src: image[2], alt: image[1], caption, number: mediaIndex + 1, width: media?.width || 1920, height: media?.height || 1080 });
    } else {
      blocks.push({ kind: "text", markdown: paragraph });
    }
  }
  return blocks;
}

const parts = snapshot.markdown.split(/^## /m);
const opening = blocksFrom(parts[0]);
export const queryCase = {
  title: opening[0].kind === "text" ? opening[0].markdown.replace(/^# /, "") : "",
  opening: opening.slice(1),
  sections: parts.slice(1).map((part, index): QuerySection => {
    const lineEnd = part.indexOf("\n");
    return { id: `query-section-${index + 1}`, heading: part.slice(0, lineEnd), blocks: blocksFrom(part.slice(lineEnd + 1)) };
  }),
};


import snapshot from "@/content/livis.generated.json";

export type LivisBlock = { markdown: string; caption?: string; id?: string; heading?: string };

function blocksFrom(markdown: string): LivisBlock[] {
  const paragraphs = markdown.trim().split(/\n\s*\n/);
  const blocks: LivisBlock[] = [];
  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index];
    const next = paragraphs[index + 1];
    if ((paragraph.startsWith("![") || paragraph.startsWith("|")) && /^\*(?!\*)[^\n]+\*$/.test(next || "")) {
      blocks.push({ markdown: paragraph, caption: next });
      index++;
    } else blocks.push({ markdown: paragraph });
  }
  return blocks;
}

const parts = snapshot.markdown.split(/^## /m);
const opening = blocksFrom(parts[0]);
export const livisCase = {
  title: opening[0].markdown.replace(/^# /, ""),
  opening: opening.slice(1),
  media: snapshot.media,
  sections: parts.slice(1).map((part, index) => {
    const lineEnd = part.indexOf("\n");
    const id = `livis-section-${index + 1}`;
    let subsection = 0;
    const blocks = blocksFrom(part.slice(lineEnd + 1)).map((block) => block.markdown.startsWith("### ")
      ? { ...block, id: `${id}-subsection-${++subsection}`, heading: block.markdown.slice(4) }
      : block);
    return { id, heading: part.slice(0, lineEnd), blocks };
  }),
};

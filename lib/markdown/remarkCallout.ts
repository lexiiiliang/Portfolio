import { visit } from "unist-util-visit";
import type { Blockquote, Paragraph, Root } from "mdast";

const MARKER_PATTERN = /^\[!(\w+)\]\s*(.*)$/;

// Rewrites Obsidian's native `> [!type] Title` callout blockquotes into a
// `<callout type title>` hast node, so `MarkdownCase` can render them with a
// dedicated component instead of a plain blockquote. Blockquotes that don't
// start with a `[!type]` marker (ordinary quotes) are left untouched.
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph") return;
      const firstParagraph = firstChild as Paragraph;
      const firstText = firstParagraph.children[0];
      if (firstText?.type !== "text") return;

      const newlineIndex = firstText.value.indexOf("\n");
      const firstLine = newlineIndex >= 0 ? firstText.value.slice(0, newlineIndex) : firstText.value;
      const match = MARKER_PATTERN.exec(firstLine);
      if (!match) return;

      const [, type, title] = match;
      const remainder = newlineIndex >= 0 ? firstText.value.slice(newlineIndex + 1) : "";

      if (remainder) {
        firstText.value = remainder;
      } else if (firstParagraph.children.length > 1) {
        firstParagraph.children.shift();
      } else {
        node.children.shift();
      }

      node.data = {
        ...node.data,
        hName: "callout",
        hProperties: { type: type.toLowerCase(), title: title.trim() || undefined },
      };
    });
  };
}

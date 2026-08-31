import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Root, RootContent } from "mdast";
import type { ContainerDirective, LeafDirective } from "mdast-util-directive";

// `:::carousel ... :::` container directive -> a <carousel> hast node whose
// children are whatever markdown (usually one image per line) was nested
// inside it. Any other container directive name is left unrendered.
function remarkCarouselDirective() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node: ContainerDirective) => {
      if (node.name !== "carousel") return;
      node.data = { ...node.data, hName: "carousel", hProperties: {} };
    });
  };
}

// `::scroll{effect="fade-in"}` leaf directive -> wraps the *next* sibling
// block in a <scroll-section effect> hast node, then removes itself. Using a
// leaf directive (no closing marker) instead of a container directive means
// a missing/mismatched closer can't silently swallow the rest of the section
// — the same failure mode already ruled out when choosing markdown over MDX.
function remarkScrollDirective() {
  return (tree: Root) => {
    const targets: Array<{ parent: { children: RootContent[] }; index: number }> = [];
    visit(tree, "leafDirective", (node: LeafDirective, index, parent) => {
      if (node.name === "scroll" && parent && typeof index === "number") {
        targets.push({ parent: parent as { children: RootContent[] }, index });
      }
    });

    // Reverse order: splicing a later match first keeps earlier indices
    // within the same parent valid.
    for (const { parent, index } of targets.reverse()) {
      const directiveNode = parent.children[index] as LeafDirective;
      const target = parent.children[index + 1];
      if (!target) {
        parent.children.splice(index, 1);
        continue;
      }
      const effect = directiveNode.attributes?.effect || "fade-in";
      const wrapped = {
        type: "scrollSection",
        data: { hName: "scroll-section", hProperties: { effect } },
        children: [target],
      } as unknown as RootContent;
      parent.children.splice(index, 2, wrapped);
    }
  };
}

export const directiveMarkdownPlugins = [remarkDirective, remarkCarouselDirective, remarkScrollDirective];

import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

/** Render Markdown safely, even if submitted content contains raw HTML. */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return "";
  const rendered = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(rendered, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "strong", "em", "del",
      "ul", "ol", "li", "blockquote", "pre", "code", "table", "thead", "tbody", "tr", "th", "td", "a",
    ],
    allowedAttributes: { a: ["href", "title", "target", "rel"], th: ["align"], td: ["align"] },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer", target: "_blank" },
      }),
    },
  });
}

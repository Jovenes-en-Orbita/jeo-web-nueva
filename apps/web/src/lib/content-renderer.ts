import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Sanitiza HTML básico eliminando scripts, iframes, objetos embebidos y atributos de eventos.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(
      /<(object|embed|style|form|input|button)\b[^>]*>[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

/**
 * Detecta si el contenido ya es HTML enriquecido (por ejemplo, generado por TipTap)
 * o si está escrito en Markdown/texto plano, y devuelve HTML limpio listo para renderizar.
 */
export function renderArticleContentToHtml(rawContent?: string | null): string {
  if (!rawContent || rawContent.trim() === "") {
    return "";
  }

  const trimmed = rawContent.trim();
  const looksLikeHtml =
    /^<(p|h[1-6]|ul|ol|blockquote|div|figure|hr|pre)\b/i.test(trimmed);

  if (looksLikeHtml) {
    return sanitizeHtml(trimmed);
  }

  const parsed = marked.parse(trimmed, { async: false });
  return sanitizeHtml(typeof parsed === "string" ? parsed : "");
}

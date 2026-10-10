export function normalizeBase(value = '/') {
  const segment = value.trim().replace(/^\/+|\/+$/g, '');
  return segment ? `/${segment}/` : '/';
}

export function rewriteHtmlRoutes(html, base) {
  const prefix = normalizeBase(base);
  if (prefix === '/') return html;
  return html.replace(/\b(href|src)="(\/[^"\s]*)"/g, (match, attribute, path) => {
    if (path.startsWith('//') || path.startsWith(prefix)) return match;
    return `${attribute}="${prefix}${path.slice(1)}"`;
  });
}

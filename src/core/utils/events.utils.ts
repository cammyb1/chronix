export function isMounted(node: Node): boolean {
  if (node.nodeType === Node.DOCUMENT_NODE) return true;
  if (node.parentNode == undefined) return false;
  return isMounted(node.parentNode);
}

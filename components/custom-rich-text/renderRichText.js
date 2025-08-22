const getAttrString = (attrs) => {
  return Object.entries(attrs)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
};

const getHtml = (node) => {
  if (node.type === "text") {
    return node.content;
  }

  return `<${node.tagName} class="${node.tagName}" ${getAttrString(
    node.attributes
  )}>${node.children.map(getHtml).join("")}</${node.tagName}>`;
};

const hasSpecialNode = (node) => {
  if (checkSpecialNode(node)) return true;
  for (const child of node.children || []) {
    if (hasSpecialNode(child)) return true;
  }
  return false;
};

const checkSpecialNode = (node) => {
  return ["a", "video", "img"].includes(node.tagName);
};

const parseNode = (node) => {
  const isSpecialNode = hasSpecialNode(node);

  return isSpecialNode
    ? checkSpecialNode(node)
      ? node
      : {
          ...node,
          special: true,
          nodes: node.children.map((node) => parseNode(node)),
        }
    : {
        special: false,
        html: getHtml(node),
      };
};

export default function renderRichText(nodes) {
  return nodes.map(parseNode);
}

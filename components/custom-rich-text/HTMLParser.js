class HTMLParser {
  constructor(html) {
    this.html = html;
    this.index = 0;
    this.len = html.length;
  }

  // 解析HTML字符串为AST
  parse() {
    try {
      const nodes = this.parseNodes();
      return {
        type: "root",
        children: nodes,
      };
    } catch (error) {
      return {
        type: "root",
        children: [],
        error: error.message,
      };
    }
  }

  // 解析节点列表
  parseNodes() {
    const nodes = [];

    while (this.index < this.len) {
      // 跳过空白字符
      this.skipWhitespace();

      if (this.index >= this.len) break;

      // 检查是否是注释
      if (this.html.startsWith("<!--", this.index)) {
        const comment = this.parseComment();
        if (comment) {
          nodes.push(comment);
        }
        continue;
      }

      // 检查是否是结束标签
      if (this.html[this.index] === "<" && this.html[this.index + 1] === "/") {
        // 遇到结束标签，返回当前节点列表
        break;
      }

      // 检查是否是开始标签
      if (this.html[this.index] === "<") {
        const element = this.parseElement();
        if (element) {
          nodes.push(element);
        }
        continue;
      }

      // 否则解析为文本节点
      const text = this.parseText();
      if (text.trim().length > 0) {
        nodes.push({
          type: "text",
          content: text,
        });
      }
    }

    return nodes;
  }

  // 解析文本内容
  parseText() {
    let text = "";
    while (this.index < this.len && this.html[this.index] !== "<") {
      // 处理HTML实体
      if (this.html[this.index] === "&") {
        const entity = this.parseEntity();
        text += entity;
      } else {
        text += this.html[this.index];
        this.index++;
      }
    }
    return text;
  }

  // 解析HTML实体
  parseEntity() {
    const start = this.index;
    let end = this.index + 1;

    while (end < this.len && this.html[end] !== ";" && end - start < 10) {
      end++;
    }

    if (end < this.len && this.html[end] === ";") {
      const entity = this.html.substring(start, end + 1);
      this.index = end + 1;

      // 常见HTML实体转换
      const entityMap = {
        "&lt;": "<",
        "&gt;": ">",
        "&amp;": "&",
        "&quot;": '"',
        "&apos;": "'",
        "&nbsp;": " ",
      };

      return entityMap[entity] || entity;
    }

    // 如果不是有效的实体，则返回原字符
    this.index++;
    return "&";
  }

  // 解析注释
  parseComment() {
    if (!this.html.startsWith("<!--", this.index)) {
      return null;
    }

    this.index += 4; // 跳过 '<!--'

    const start = this.index;
    let content = "";

    while (this.index < this.len - 3) {
      if (this.html.startsWith("-->", this.index)) {
        content = this.html.substring(start, this.index);
        this.index += 3; // 跳过 '-->'
        break;
      }
      this.index++;
    }

    return {
      type: "comment",
      content: content,
    };
  }

  // 解析元素
  parseElement() {
    if (this.html[this.index] !== "<") {
      return null;
    }

    this.index++; // 跳过 '<'

    const tagName = this.parseTagName();
    if (!tagName) {
      throw new Error("Invalid tag name");
    }

    const attributes = this.parseAttributes();

    let selfClosing = false;

    // 检查自闭合标签
    if (this.html[this.index] === "/") {
      selfClosing = true;
      this.index++;
    }

    // 跳过 >
    if (this.html[this.index] === ">") {
      this.index++;
    } else {
      throw new Error("Expected > after tag");
    }

    let children = [];

    // 如果是自闭合标签或者某些特定标签，不需要解析子节点
    if (!selfClosing && !this.isVoidElement(tagName)) {
      children = this.parseNodes();

      // 尝试寻找结束标签
      if (this.html.startsWith("</", this.index)) {
        this.index += 2;
        // eslint-disable-next-line no-unused-vars
        const closingTag = this.parseTagName();

        // 跳过结束标签的 >
        if (this.html[this.index] === ">") {
          this.index++;
        }
      }
    }

    return {
      type: "element",
      tagName: tagName.toLowerCase(),
      attributes: attributes,
      children: children,
      selfClosing: selfClosing,
    };
  }

  // 判断是否是自闭合元素/空元素
  isVoidElement(tagName) {
    const voidElements = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];
    return voidElements.includes(tagName.toLowerCase());
  }

  // 解析标签名
  parseTagName() {
    let tagName = "";

    // 跳过开头的空白（如果有）
    this.skipWhitespace();

    while (this.index < this.len && /[a-zA-Z0-9]/.test(this.html[this.index])) {
      tagName += this.html[this.index];
      this.index++;
    }

    return tagName;
  }

  // 解析属性
  parseAttributes() {
    const attributes = {};

    while (this.index < this.len) {
      this.skipWhitespace();

      // 如果遇到标签结束，退出循环
      if (this.html[this.index] === ">" || this.html[this.index] === "/") {
        break;
      }

      const attribute = this.parseAttribute();
      if (attribute) {
        attributes[attribute.name] = attribute.value;
      }
    }

    return attributes;
  }

  // 解析单个属性
  parseAttribute() {
    let name = "";
    let value = null;

    // 解析属性名
    while (this.index < this.len && /[^\s=/>]/.test(this.html[this.index])) {
      name += this.html[this.index];
      this.index++;
    }

    if (!name) return null;

    this.skipWhitespace();

    // 如果没有等号，可能是布尔属性
    if (this.html[this.index] !== "=") {
      return { name, value: true };
    }

    this.index++; // 跳过等号
    this.skipWhitespace();

    // 解析属性值
    const quote = this.html[this.index];
    if (quote === '"' || quote === "'") {
      this.index++; // 跳过引号
      value = "";

      while (this.index < this.len && this.html[this.index] !== quote) {
        if (this.html[this.index] === "&") {
          value += this.parseEntity();
        } else {
          value += this.html[this.index];
          this.index++;
        }
      }

      if (this.html[this.index] === quote) {
        this.index++; // 跳过闭合引号
      }
    } else {
      // 无引号属性值
      value = "";
      while (this.index < this.len && /[^\s>]/.test(this.html[this.index])) {
        if (this.html[this.index] === "&") {
          value += this.parseEntity();
        } else {
          value += this.html[this.index];
          this.index++;
        }
      }
    }

    return { name, value };
  }

  // 跳过空白字符
  skipWhitespace() {
    while (this.index < this.len && /\s/.test(this.html[this.index])) {
      this.index++;
    }
  }
}

export default HTMLParser;

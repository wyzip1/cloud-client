<template>
  <view class="custom-rich-text">
    <view class="p" v-for="(node, index) in renderNodes" :key="index">
      <view
        :class="node.tagName"
        v-if="node.special && (node.tagName === 'ul' || node.tagName === 'ol')"
        :style="node.attributes.style"
      >
        <view class="li" v-for="(li, idx) in node.nodes" :key="idx">
          <special-node v-for="(item, i) in li.nodes" :key="i" :node="item" />
        </view>
      </view>
      <view v-else-if="node.special" :style="node.attributes.style">
        <special-node v-for="(item, i) in node.nodes" :key="i" :node="item" />
      </view>
      <rich-text v-else :nodes="node.html" />
    </view>
  </view>
</template>

<script>
import HTMLParser from "./HTMLParser";
import renderRichText from "./renderRichText";
import specialNode from "./special-node.vue";

export default {
  name: "custom-rich-text",
  components: { specialNode },
  props: {
    html: String,
    nodes: Array,
  },
  watch: {
    html() {
      this.parseHTML();
    },
  },
  data() {
    return {
      renderNodes: [],
    };
  },
  mounted() {
    this.parseHTML();
  },
  methods: {
    parseHTML() {
      const parser = new HTMLParser(this.html);
      const ast = parser.parse()?.children || [];

      this.renderNodes = renderRichText(ast);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-rich-text {
  ::v-deep {
    h1,
    .h1,
    h2,
    .h2,
    h3,
    .h3,
    h4,
    .h4,
    h5,
    .h5 {
      margin: 10px 0;
    }

    h1,
    .h1 {
      font-size: 2em;
    }

    h2,
    .h2 {
      font-size: 1.5em;
    }

    h3,
    .h3 {
      font-size: 1.17em;
    }

    h4,
    .h4 {
      font-size: 1em;
    }

    h5,
    .h5 {
      font-size: 0.83em;
    }

    p,
    .p {
      color: var(--color);
      word-break: break-all;
    }

    table,
    .table {
      border-collapse: collapse;
      border: 1px solid #ccc;

      td,
      .td,
      th,
      .th {
        border: 1px solid #ccc;
        padding: 3px 5px;
      }

      th,
      .th {
        background-color: #f5f2f0;
      }
    }

    code,
    .code {
      background-color: #eee;
      padding: 3px;
      border-radius: 3px;
    }

    blockquote,
    .blockquote {
      display: block;
      border-left: 8px solid #d0e5f2;
      padding: 10px 10px;
      margin: 10px 0;
      background-color: #f1f1f1;
    }

    ul,
    .ul,
    ol,
    .ol {
      padding-left: 20px;
    }

    ul,
    .ul {
      list-style-type: disc;
    }

    ol,
    .ol {
      list-style-type: decimal;
    }

    li,
    .li {
      display: list-item;
    }
  }
}
</style>

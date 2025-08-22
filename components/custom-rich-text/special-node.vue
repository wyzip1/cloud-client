<template>
  <view style="display: inline">
    <image
      v-if="node.tagName === 'img'"
      class="img"
      mode="widthFix"
      :style="node.attributes.style"
      :src="node.attributes.src"
      @click="previewImage(node.attributes.src)"
    />
    <text
      v-else-if="node.tagName === 'a'"
      class="link"
      @click="handleLink(node.attributes.href)"
    >
      {{ node.children[0].content }}
    </text>
    <view
      v-else-if="node.tagName === 'video'"
      class="video"
      :style="
        'width: ' +
        node.attributes.width +
        '; height: ' +
        node.attributes.height
      "
    >
      <custom-video
        :poster="node.attributes.poster"
        :src="node.children[0].attributes.src"
      />
    </view>
    <text v-else>
      <rich-text style="display: inline" :nodes="node.html" />
    </text>
  </view>
</template>

<script>
import customVideo from "./custom-video.vue";
export default {
  name: "special-node",
  components: { customVideo },
  props: {
    node: Object,
  },
  methods: {
    previewImage(url) {
      yz.previewImage({ urls: [url], current: 0 });
    },
    handleLink(href) {
      if (!href || yz.getEnvSync() !== "weapp") return;

      yz.navigateTo({
        route: "/packages/kailas/webview/index?url=" + encodeURIComponent(href),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.img {
  width: 100%;
  max-width: 100%;
  vertical-align: top;
}
.link {
  color: #1677ff;
}
</style>

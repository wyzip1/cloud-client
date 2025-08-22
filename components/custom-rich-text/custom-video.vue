<template>
  <view class="custom-video">
    <video
      :poster="poster"
      :src="playUrl"
      style="width: 100%"
      object-fit="contain"
      frameborder="0"
    />

    <view class="err-mask" v-if="errMsg" @click="loadPlayInfo">
      {{ errMsg }}
    </view>

    <t-toast ref="t-taost" />
  </view>
</template>

<script>
import { Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import { watchReady } from "../../utils";

export default {
  name: "custom-video",
  components: {
    "t-toast": VanToast,
  },
  props: {
    src: String,
    poster: String,
  },
  watch: {
    value() {
      if (!this.src || !this.inited) return;
      this.loadPlayInfo();
    },
  },

  data() {
    return {
      playUrl: "",
      errMsg: "",
      inited: false,
    };
  },
  async created() {
    await watchReady(this);
    this.inited = true;
    console.log("dataReady render-video");
    this.loadPlayInfo();
  },
  methods: {
    async loadPlayInfo() {
      try {
        Toast.loading({
          message: "加载中",
          forbidClick: true,
          duration: 0,
          context: this,
        });
        const mediaId = this.src.split("?")[1].split("=")[1];
        const res = await this.yz.app.getApi().playVideoApi(mediaId);

        this.playUrl = res.data.playUrl;
      } catch (error) {
        yz.console.log("error", error);

        this.errMsg = error.data?.message || error.message;
      } finally {
        Toast.clear();
        this.inited = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-video {
  position: relative;

  .err-mask {
    position: absolute;
    background-color: #f7f8fa7f;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #535353;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 6vw;
  }
}
</style>

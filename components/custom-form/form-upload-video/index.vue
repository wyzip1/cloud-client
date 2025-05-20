<template>
  <view>
    <view class="video-list">
      <view
        :class="{ 'video-item': true, error: item.code === 1 }"
        v-for="(item, index) in fileList"
        :key="index"
        @click="onPreview(item)"
      >
        <image
          class="video-img"
          mode="aspectFill"
          src="https://img01.yzcdn.cn/upload_files/2023/12/12/FlRYiDuB23RLfQT5ELEtJe0cXhWr.png"
        />
        <view class="video-btn" @click.stop="onDel(index)">
          <view class="del-icon">
            <t-icon name="cross" />
          </view>
        </view>
      </view>
      <view
        class="add-video"
        @click="selectFile"
        v-if="fileList.length < maxCount && !disabled"
      >
        <t-icon name="photograph" size="24" color="#dcdee0" />
      </view>
    </view>
    <t-toast ref="t-toast" />
  </view>
</template>

<script>
import { Toast as VanToast, Icon } from "@youzan-cloud/tee-ui";
import { showLoading, showToast } from "../../../utils/index";

export default {
  components: {
    "t-toast": VanToast,
    "t-icon": Icon,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
    maxSize: { type: Number, default: 10 },
    maxCount: { type: Number, default: 1 },
    disabled: Boolean,
  },
  data() {
    return {
      env: yz.getEnvSync(),
      value: null,
    };
  },
  computed: {
    fileList() {
      return this.value || [];
    },
  },
  created() {
    yz.event.trigger(
      "form-item-input" + "-" + this.pid + "-" + this.name,
      (parent) => {
        this._parent = parent;
        return this;
      }
    );
  },
  methods: {
    onDel(index) {
      this._parent.formChange((this.value || []).filter((_, i) => i !== index));
    },
    async selectFile() {
      let { maxSize } = this;
      try {
        const a = await yz.chooseVideo({
          sourceType: ["album"],
        });
        if (this.env == "weapp") {
          if (a.size > maxSize * 1024 * 1024) {
            showToast(`视频大小不能超过${maxSize}M`);
          }
        }
        console.log("----", a);
        const r = await this.handleUpload(a);
        if (r.code == 1) showToast("视频上传失败，请重新上传");
      } catch (error) {
        console.log(error);
      }
    },
    async onPreview(item) {
      showLoading();
      const res = await this.yz.app.getApi().createVideoApi(item.id);
      yz.previewMedia({
        sources: [
          {
            type: "video",
            url: res.data.playUrl,
          },
        ],
        current: 1,
      })
        .then((res) => {
          console.log("调用成功", res);
        })
        .catch((err) => {
          console.log("调用失败", err);
        });
    },
    async handleUpload(file) {
      try {
        const a = await this.yz.app.getApi().uploadVideoApi(file.tempFilePath);
        console.log("a---", a);
        if (a.code !== 200) throw a;
        const b = JSON.parse(a.data);
        console.log("b---", b);
        if (b.code !== 200) throw b;
        const r = await this.yz.app.getApi().createVideoApi({
          videoPath: b.data,
          videoName: new Date().getTime(),
        });
        console.log("r---", r);
        return { code: 0, id: r.data };
      } catch (error) {
        console.log("error", error);
        return { code: 1, id: null };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-video,
.video-item {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  overflow: hidden;
  margin: 0 8px 8px 0;
}
.video {
  &-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  &-item {
    .video-img {
      width: 100%;
      height: 100%;
    }
    .video-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 14px;
      height: 14px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0 0 0 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      .del-icon {
        transform: scale(0.5);
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
</style>

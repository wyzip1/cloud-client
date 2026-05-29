<template>
  <view>
    <t-uploader
      :max-count="maxCount"
      accept="image"
      :file-list="formatList || []"
      :use-before-read="true"
      preview-size="calc(100vw / 750 * 180)"
      @before-read="beforeRead"
      @after-read="afterRead"
      @delete="itemDelete"
    >
      <view class="custom-upload">
        <image
          class="upload-icon"
          mode="widthFix"
          src="https://img01.yzcdn.cn/upload_files/2025/09/04/FrmHwTDq_FzsCrSGxhv887ebKpg-.png"
        />
        <view class="text">上传图片</view>
      </view>
    </t-uploader>

    <t-toast ref="t-toast" />
    <t-dialog ref="t-dialog" />
  </view>
</template>

<script>
import {
  Uploader,
  Toast as VanToast,
  Dialog as VanDialog,
} from "@youzan-cloud/tee-ui";
import Dialog from "@youzan-cloud/tee-ui/dist/dialog/dialog";
import { setFormState, useFormWatch } from "../utils";
import { withLoading } from "../../../utils";

export default {
  name: "form-upload",
  components: {
    "t-toast": VanToast,
    "t-dialog": VanDialog,
    "t-uploader": Uploader,
  },
  props: {
    name: String,
    maxSize: {
      type: Number,
      default: 5,
    },
    maxCount: {
      type: Number,
      default: 1,
    },
    fileList: Array,
  },
  data() {
    return {
      value: [],
    };
  },
  computed: {
    formatList() {
      return this.value?.length ? this.value : this.fileList || [];
    },
  },
  created() {
    useFormWatch(this.name, this, (value) => {
      this.value = value || [];
    });
  },
  methods: {
    itemDelete({ index }) {
      this.onChange(this.formatList.filter((_, i) => i !== index));
    },
    beforeRead(detail) {
      const { file, callback } = detail;
      if (file.size > 1024 * 1024 * this.maxSize) {
        Dialog.alert({
          title: "错误提示",
          message: `图片大小不能超过${this.maxSize}M`,
          context: this,
        });
      }
      callback(file.size <= 1024 * 1024 * this.maxSize);
    },
    async afterRead(detail) {
      const originFileList = [...(this.formatList || [])];

      withLoading(this, async () => {
        this.onChange([
          ...originFileList,
          { url: detail.file.url, status: "uploading", type: detail.file.type },
        ]);
        const res = await this.yz.app.getApi().uploadImage(detail.file.url);
        this.onChange([
          ...originFileList,
          {
            url: res.data.imageUrl,
            status: "done",
            type: detail.file.type,
            id: res.data.imageId,
          },
        ]);
      }).catch(() => {
        this.onChange([
          ...originFileList,
          { url: detail.file.url, status: "failed", type: detail.file.type },
        ]);
      });
    },
    onChange(value) {
      this.$emit("change", value);
      setFormState(this, { [this.name]: value });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.custom-upload {
  width: rpx(180);
  height: rpx(180);
  border: 1px solid #e1e1e1;
  border-radius: rpx(8);

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: rpx(26);

  .upload-icon {
    width: rpx(54);
    height: rpx(54);
  }

  .text {
    font-size: rpx(28);
    line-height: rpx(40);
    color: #848484;
  }
}
</style>

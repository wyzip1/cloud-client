<template>
  <view>
    <t-uploader
      :max-count="maxCount"
      accept="image"
      :file-list="formatList || []"
      :use-before-read="true"
      @before-read="beforeRead"
      @after-read="afterRead"
      @delete="itemDelete"
    />
  </view>
</template>

<script>
import { Uploader } from "@youzan-cloud/tee-ui";
import { throttle, showToast, showLoading } from "../../../utils/index";

export default {
  components: {
    "t-uploader": Uploader,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
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
    yz.event.trigger(
      "form-item-input" + "-" + this.pid + "-" + this.name,
      (parent) => {
        this._parent = parent;
        return this;
      }
    );
  },
  methods: {
    itemDelete({ index }) {
      this.onChange(this.formatList.filter((_, i) => i !== index));
    },
    beforeRead(detail) {
      const { file, callback } = detail;
      if (file.size > 1024 * 1024 * this.maxSize) {
        showToast(`图片大小不能超过${this.maxSize}M`);
      }
      callback(file.size < 1024 * 1024 * this.maxSize);
    },
    async afterRead(detail) {
      const originFileList = [...(this.formatList || [])];
      try {
        console.log(detail);
        this.onChange([
          ...originFileList,
          { url: detail.file.url, status: "uploading", type: detail.file.type },
        ]);
        const res = await this.yz.app.getApi().uploadImgApi(detail.file.url);
        const resData = JSON.parse(res.data);
        if (resData.code !== 200) throw resData;
        this.onChange([
          ...originFileList,
          {
            url: resData.data.imageUrl,
            status: "done",
            type: detail.file.type,
            id: resData.data.imageId,
          },
        ]);
      } catch (error) {
        console.log("error", error);
        // Toast({ message: error.data?.message || error.message });
        this.onChange([
          ...originFileList,
          { url: detail.file.url, status: "failed", type: detail.file.type },
        ]);
      }
    },
    onChange(value) {
      this.$emit("change", value);
      this._parent?.formChange(value);
    },
  },
};
</script>

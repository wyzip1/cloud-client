<template>
  <view>
    <view class="upload-file">
      <view
        class="add-file"
        @click="selectFile"
        v-if="fileList.length < maxCount && !disabled"
      >
        添加文件
      </view>
      <view class="file-list">
        <view class="file-item" v-for="(item, index) in fileList" :key="index">
          <view
            :class="{ 'file-name': true, error: item.code === 1 }"
            @click.stop="onPreview(item)"
          >
            {{ item.title || item.url }}
          </view>
          <view class="file-btn" v-if="!disabled">
            <view class="del" @click.stop="onDel(index)"> 删除 </view>
          </view>
        </view>
      </view>
    </view>
    <t-toast ref="t-toast" />
  </view>
</template>

<script>
import { Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";

export default {
  components: {
    "t-toast": VanToast,
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
    return { value: null };
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
    async onPreview(item) {
      try {
        if (item?.code == 1) return;
        Toast.loading({
          context: this,
          message: "加载中",
          duration: 0,
          forbidClick: true,
        });
        const res = await yz.downloadFile({
          path: `/api/v1/common/file/download?key=${item.url}`,
          dev: this.yz.app.isDev(),
        });

        await yz.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
        });
        Toast.clear();
      } catch (error) {
        Toast.clear();
        Toast({ message: "文档下载失败", context: this });
        console.log("文档下载失败", error);
      }
    },
    onDel(index) {
      this._parent.formChange((this.value || []).filter((_, i) => i !== index));
    },
    async selectFile() {
      let { value, maxCount, maxSize } = this;
      try {
        const a = await yz.chooseMessageFile({
          count: maxCount - value?.length,
          type: "file",
          extension: ["pdf", ".pdf", "xslx", ".xlsx", "docx", ".docx"],
        });
        if (
          a.tempFiles.filter((v) => v.size > 1024 * 1024 * maxSize).length > 0
        ) {
          Toast({
            message: `文件大小不能超过${maxSize}M`,
            context: this,
            duration: 2000,
          });
          return;
        }
        if (
          !a.tempFiles.filter((v) => /\.(pdf|xlsx|docx)$/i.test(v.path)).length
        ) {
          Toast({
            message: `文件类型错误，仅支持pdf`,
            context: this,
            duration: 2000,
          });
          return;
        }
        Toast.loading({
          message: "上传中",
          duration: 0,
          context: this,
          forbidClick: true,
        });
        const r = await Promise.all(
          [...a.tempFiles].map((v) => this.handleUpload(v))
        );
        Toast.clear();
        if (r.filter((v) => v.code == 1).length > 0) {
          Toast({
            message: "部分文件上传失败，请重新上传",
            context: this,
            duration: 2000,
          });
        }
        this._parent.formChange([...(value || []), ...r]);
      } catch (t) {
        Toast.clear();
        console.log(t);
      }
    },
    async handleUpload(file) {
      try {
        const res = await this.yz.app.getApi().uploadFileApi(file.path);
        if (res.code !== 200) throw res;
        const resData = JSON.parse(res.data);
        if (resData.code !== 200) throw resData;
        return { code: 0, url: resData.data, title: file.name };
      } catch (error) {
        console.log("error", error);

        return { code: 1, url: file.path, title: file.name };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-file .add-file {
  color: #318bff;
  font-size: 15px;
  margin-bottom: 5px;
}

.upload-file .file-item {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  word-break: break-all;
  align-items: center;
  margin-bottom: 8px;
}

.upload-file .file-name {
  line-height: 14px;
  width: 100%;
}

.upload-file .file-name.error {
  color: #d6010b;
}

.upload-file .file-btn {
  flex-shrink: 0;
  display: flex;
}

.upload-file .retry {
  color: #d6010b;
  margin-left: 16px;
}

.upload-file .del {
  color: #318bff;
  margin-left: 8px;
}
</style>

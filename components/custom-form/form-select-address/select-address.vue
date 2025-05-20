<template>
  <view>
    <picker-popup
      :show="show"
      :title="title"
      :columns="deepLevel"
      :fullValue="fullValue"
      :value="value"
      :options="options"
      :fieldsName="fieldsName"
      @close="onClose"
      @confirm="confirm"
    />
    <t-toast ref="t-taost" />
    <custom-dialog ref="dialog" />
  </view>
</template>

<script>
import PickerPopup from "../form-picker/picker-popup.vue";
import { Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import CustomDialog from "../../custom-dialog/index.vue";

export default {
  components: {
    PickerPopup,
    CustomDialog,
    "t-toast": VanToast,
  },
  props: {
    title: String,
    show: Boolean,
    value: Array,
    fullValue: Boolean,

    deepLevel: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      options: [],
      fieldsName: {
        label: "name",
        value: "code",
        children: "children",
      },
    };
  },
  dataReady() {
    this.initLoad();
  },
  methods: {
    async initLoad() {
      try {
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          context: this,
        });

        const res = await this.yz.app.getApi().fetchAllRegions(this.deepLevel);
        this.options = res.data || [];
      } catch (error) {
        console.log("error", error);

        this.$refs.dialog.alert({
          title: "错误提示",
          message: error.data?.message || error.message,
        });
      } finally {
        Toast.clear();
      }
    },
    onClose() {
      this.$emit("close");
    },
    confirm(data) {
      this.$emit("confirm", data);
    },
  },
};
</script>

<style></style>

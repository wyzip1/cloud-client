<template>
  <view>
    <form-picker
      :name="name"
      :columns="deepLevel"
      :pid="pid"
      :options="options"
      :fieldsName="fieldsName"
      :fullValue="true"
      placeholder="请选择地址"
      @change="onChange"
    />

    <t-toast ref="t-taost" />
    <custom-dialog ref="dialog" />
  </view>
</template>

<script>
import FormPicker from "../form-picker/index.vue";
import { Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import CustomDialog from "../../custom-dialog/index.vue";
import { watchReady } from "../../../utils";

export default {
  components: {
    CustomDialog,
    "t-toast": VanToast,
    FormPicker,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
    deepLevel: {
      type: Number,
      default: 3,
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
  async created() {
    await watchReady(this);
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
    onChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-select {
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;

  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-select.select {
  font-size: 14px;
  color: #333;
}

.icon {
  margin-left: 5px;
}
</style>

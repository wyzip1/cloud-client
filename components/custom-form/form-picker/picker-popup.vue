<template>
  <view>
    <t-popup position="bottom" :z-index="1001" :show="show" @close="onClose">
      <t-picker
        :title="title || '请选择'"
        :columns="list"
        :show-toolbar="true"
        @change="onChange"
        @cancel="onClose"
        @confirm="confirm"
      />
    </t-popup>
    <t-toast ref="t-toast" />
  </view>
</template>

<script>
import { Popup, Picker, Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import { findTreePath } from "../../../utils";

export default {
  name: "picker-popup",
  components: {
    "t-popup": Popup,
    "t-picker": Picker,
    "t-toast": VanToast,
  },
  props: {
    value: Array,
    show: Boolean,
    title: String,
    options: Array,
    fieldsName: Object,
    fullValue: Boolean,
    columns: {
      type: Number,
      default: 1,
    },
    required: Boolean,
  },
  watch: {
    show(val) {
      if (val) {
        this.initData();
      }
    },
  },
  computed: {
    list() {
      if (!this.show) return [];
      const result = Array.from({ length: this.columns }, (_, i) => {
        let list = this.options;
        if (i > 0) {
          for (let idx = 0; idx < i; idx++) {
            const item = list.find(
              (v) =>
                v[this.fieldsName?.value || "value"] ===
                this.currentValue[idx]?.value
            );

            if (!item) {
              list = [];
              break;
            }
            list = item.children || [];
          }
        }
        const values = (
          i === 0 && this.required ? [] : [{ text: "请选择" }]
        ).concat(
          list.map((v) => ({
            text: v[this.fieldsName?.label || "label"],
            value: v[this.fieldsName?.value || "value"],
          }))
        );
        const idx = values.findIndex(
          (v) => v.value === this.currentValue[i]?.value
        );
        return {
          values,
          defaultIndex: idx === -1 ? 0 : idx,
        };
      });

      return result;
    },
  },
  data() {
    return {
      env: yz.getEnvSync(),
      currentValue: [],
    };
  },
  methods: {
    initData() {
      const value = this.fullValue
        ? this.value?.[this.value?.length - 1]?.value
        : this.value;
      this.currentValue = (
        findTreePath(
          this.options || [],
          (item) => item[this.fieldsName?.value || "value"] === value
        ) || []
      ).map((v) => ({
        text: v[this.fieldsName?.label || "label"],
        value: v[this.fieldsName?.value || "value"],
      }));
    },
    onChange(e) {
      this.currentValue = e.value;
    },
    onClose() {
      this.currentValue = [];
      this.$emit("close");
    },
    confirm() {
      const list = this.currentValue;

      if (list.filter((v) => v.value).length && list.some((v) => !v.value)) {
        return Toast({
          message: this.title || "请选择",
          context: this,
        });
      }

      const data = this.fullValue ? list : list[list.length - 1]?.value;

      this.$emit("confirm", data);
      this.onClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding: 16px 0;
  font-size: 18px;
  line-height: 27px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
}
</style>

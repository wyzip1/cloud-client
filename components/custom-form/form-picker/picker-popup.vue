<template>
  <view>
    <!-- {{ watchShow }} -->
    <t-popup position="bottom" :z-index="1001" :show="show" @close="onClose">
      <view class="title">{{ title || "请选择" }}</view>
      <t-picker
        :item-height="39"
        custom-class="custom-picker"
        :columns="list"
        :show-toolbar="false"
        @change="onChange"
      />
      <view :class="['action-btns', isHome && env == 'weapp' ? 'is-home' : '']">
        <custom-button
          style="display: bloc; flex: 1; flex-shrink: 0"
          :block="true"
          @click="onClose"
        >
          取消
        </custom-button>
        <custom-button
          style="display: bloc; flex: 1; flex-shrink: 0"
          :block="true"
          color="#000"
          @click="confirm"
        >
          确认
        </custom-button>
      </view>
    </t-popup>
    <t-toast ref="t-toast" />
  </view>
</template>

<script>
import { Popup, Picker, Toast as VanToast } from "@youzan-cloud/tee-ui";
import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import CustomButton from "../../../packages/panshi/components/custom-button.vue";
import { findTreePath } from "../../../utils";

export default {
  name: "picker-popup",
  components: {
    "t-popup": Popup,
    "t-picker": Picker,
    "t-toast": VanToast,
    CustomButton,
  },
  props: {
    value: Array,
    isHome: Boolean,
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
    // watchShow() {
    //   if (this.show) {
    //     this.initData();
    //   }
    //   return "";
    // },
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

::v-deep .custom-picker {
  .t-picker__mask {
    background-image: none;
  }

  .t-picker__frame {
    background-color: #f5f5f5;
    &::after {
      content: none;
    }
  }

  .t-picker-column {
    position: relative;
    z-index: 10;
  }

  .t-picker-column__item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.9);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
}

.action-btns {
  display: flex;
  flex: 1;
  gap: 10px;

  padding: 12px 16px;
  border-top: 1px solid #f7f7f7;
  &.is-home {
    padding-bottom: 70px;
  }
}
</style>

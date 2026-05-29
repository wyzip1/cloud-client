<template>
  <view>
    <view
      v-if="!useSlot"
      :class="{ 'select-time': true, select: !!value }"
      @click="onShowTimeSelect"
    >
      <text>{{ formatValue || placeholder || "请选择时间" }}</text>
      <t-icon class="icon" name="arrow-down" size="10px" />
    </view>
    <view v-else @click="onShowTimeSelect">
      <slot />
    </view>
    <t-popup :show="show" position="bottom" @close="onHideTimeSelect">
      <t-datetime-picker
        :title="placeholder || '请选择时间'"
        ref="datetimePicker"
        :item-height="39"
        :show-toolbar="true"
        :type="type"
        :value="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @input="onChange"
        @confirm="onConfirm"
        @cancel="onHideTimeSelect"
      />
    </t-popup>
  </view>
</template>

<script>
import { Popup, DatetimePicker, Icon } from "@youzan-cloud/tee-ui";
import { formatDate } from "../../../utils/index";

export default {
  name: "select-time",
  components: {
    "t-icon": Icon,
    "t-popup": Popup,
    "t-datetime-picker": DatetimePicker,
  },
  props: {
    type: String,
    useSlot: Boolean,
    placeholder: String,
    value: Number,
    minDate: {
      type: Number,
      default: () => new Date("1980/01/01 00:00:00").getTime(),
    },
    maxDate: {
      type: Number,
      default: () => new Date("2050/01/01 00:00:00").getTime(),
    },
    defaultValue: null,
  },
  computed: {
    formatValue() {
      let mode = "YYYY-MM-DD";
      if (this.type === "datetime") mode += " HH:mm:ss";
      else if (this.type === "year-month") mode = "YYYY-MM";
      else if (this.type === "time") mode = "HH:mm";
      return formatDate(this.value, mode);
    },
  },

  data() {
    return {
      show: false,
      currentDate: new Date().getTime(),

      formatter(type, value) {
        switch (type) {
          case "year":
            return `${value}年`;
          case "month":
            return `${value}月`;
          case "day":
            return `${value}日`;
          case "hour":
            return `${value}时`;
          case "minute":
            return `${value}分`;
          default:
            return value;
        }
      },

      time: null,
    };
  },
  methods: {
    onShowTimeSelect() {
      this.currentDate = this.value
        ? new Date(this.value).getTime()
        : this.defaultValue || new Date().getTime();
      this.show = true;
    },
    onHideTimeSelect() {
      this.show = false;
    },
    onChange(time) {
      this.time = time;
    },
    onConfirm() {
      this.onHideTimeSelect();
      const value =
        this.type === "time"
          ? Date.parse(
              `${formatDate(Date.now(), "YYYY/MM/DD")} ${this.time}:00`
            )
          : this.time;
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.select-time {
  border: 1px solid #e1e1e1;
  height: rpx(80);
  border-radius: rpx(12);
  overflow: hidden;

  font-size: rpx(28);
  line-height: rpx(40);
  padding: rpx(12) rpx(24);
  box-sizing: border-box;
  color: #ccc;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &.select {
    color: #1e1e1e;
  }
}
</style>

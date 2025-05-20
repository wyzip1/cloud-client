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
      <view class="title">{{ placeholder || "请选择时间" }}</view>
      <t-datetime-picker
        ref="datetimePicker"
        :item-height="39"
        :show-toolbar="false"
        :type="type"
        :value="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @input="onChange"
      />
      <view class="action-btns">
        <custom-button
          style="display: bloc; flex: 1; flex-shrink: 0"
          :block="true"
          @click="onHideTimeSelect"
        >
          取消
        </custom-button>
        <custom-button
          style="display: bloc; flex: 1; flex-shrink: 0"
          :block="true"
          color="#000"
          @click="onConfirm"
        >
          确认
        </custom-button>
      </view>
    </t-popup>
  </view>
</template>

<script>
import { Popup, DatetimePicker, Icon } from "@youzan-cloud/tee-ui";
import { formatDate } from "../utils";
import CustomButton from "../packages/panshi/components/custom-button.vue";

export default {
  name: "select-time",
  components: {
    "t-icon": Icon,
    "t-popup": Popup,
    "t-datetime-picker": DatetimePicker,
    CustomButton,
  },
  props: {
    type: String,
    useSlot: Boolean,
    placeholder: String,
    value: Number,
    minDate: {
      type: Number,
      default: () => new Date("1980-01-01 00:00:00").getTime(),
    },
    maxDate: {
      type: Number,
      default: () => new Date("2050-01-01 00:00:00").getTime(),
    },
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
        : new Date().getTime();
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
      console.log(this.time);

      const value =
        this.type === "time"
          ? Date.parse(
              `${formatDate(Date.now(), "YYYY-MM-DD")} ${this.time}:00`
            )
          : this.time;
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-time {
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;

  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.select {
    color: #323233;
    font-size: 14px;
  }
}

.title {
  padding: 16px 0;
  font-size: 18px;
  line-height: 27px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
}

::v-deep .t-picker__columns {
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
}
</style>

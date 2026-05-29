<template>
  <view class="form-radio">
    <view
      :class="{ 'form-radio-item': true, active: item.value === value }"
      v-for="item in options"
      :key="item.value"
      @click="onChange(item.value)"
    >
      <view class="radio-icon"></view>
      <view class="radio-label">{{ item.label }}</view>
    </view>
  </view>
</template>

<script>
import { setFormState, useFormWatch } from "../utils";

export default {
  name: "form-radio",
  props: {
    name: String,
    options: Array,
  },
  data() {
    return { value: null };
  },
  created() {
    useFormWatch(this.name, this, (value) => {
      this.value = value;
    });
  },
  methods: {
    onChange(value) {
      setFormState(this, { [this.name]: value });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.form-radio {
  display: flex;
  gap: rpx(84);
  align-items: center;
  flex-wrap: wrap;
  min-height: rpx(40);
  padding: rpx(20) 0;
  box-sizing: border-box;

  .form-radio-item {
    display: flex;
    align-items: center;
    gap: rpx(16);

    &.active {
      .radio-icon {
        border-width: rpx(14);
        border-color: #ff5552;
      }
    }

    .radio-icon {
      width: rpx(40);
      height: rpx(40);
      box-sizing: border-box;
      border-radius: 50%;
      border: 1px solid #d1d1d1;
      transition: 0.3s;
    }

    .radio-label {
      font-size: rpx(28);
      line-height: rpx(40);
      color: #1e1e1e;
    }
  }
}
</style>

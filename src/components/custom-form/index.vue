<template>
  <view class="custom-form">
    <slot />
  </view>
</template>

<script>
import { createFormStore, getFormItemList, useFormWatch } from "./utils";

export default {
  name: "custom-form",
  props: {
    layout: String,
    defaultLabelWidth: null,
    valueAlign: String,
    labelAlign: String,
  },
  data() {
    return {};
  },
  created() {
    createFormStore(this);
  },
  methods: {
    watchValue(name, callback) {
      useFormWatch(name, this, callback);
    },
    async validateFields() {
      const validatorList = getFormItemList(this).map((ctx) => ctx.validator());
      const results = await Promise.all(validatorList);
      const errList = results.filter((item) => item.error);
      if (errList.length) return Promise.reject(errList);

      return this.getValues();
    },
    submit() {
      this.validateFields().then(() => {
        this.$emit("finish", this.getValues());
      });
    },
    getValues() {
      return getFormItemList(this).reduce(
        (formData, context) => ({
          ...formData,
          ...(context.name
            ? {
                [context.name]: context.value,
              }
            : {}),
        }),
        {}
      );
    },
  },
};
</script>

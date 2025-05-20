<template>
  <view class="custom-form">
    <slot />
  </view>
</template>

<script>
export default {
  props: {
    pid: {
      type: String,
      default: "base",
    },
    layout: String,
    defaultLabelWidth: String,
    valueAlign: String,
    labelAlign: String,
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-reserved-keys
      catchData: null,
      // eslint-disable-next-line vue/no-reserved-keys
      enabled: true,
    };
  },
  created() {
    this.catchData = null;
    this._formItemList = [];

    const watchFnMaps = {};
    this.yz.page.form = {
      setValues: (data) => {
        this.setValues(data);
      },
      getFullValues: () => ({
        ...this.catchData,
        ...this.getValues(),
      }),
      getValues: () => this.getValues(),
      watchValue: (name, fn) => {
        if (!watchFnMaps[name]) watchFnMaps[name] = [];
        const values = this.getValues();
        fn(values[name]);
        watchFnMaps[name].push(fn);

        return () => watchFnMaps[name].splice(watchFnMaps[name].indexOf(fn), 1);
      },
      getEnabled: () => this.enabled,
      setEnabled: (v) => (this.enabled = v),
      triggerValueChange(name, value) {
        watchFnMaps[name]?.forEach((fn) => fn(value));
      },
    };

    this._onMounted = (data) => {
      if (!this.enabled) return;
      const idx = this._formItemList.findIndex((item) => item.id === data.id);
      if (idx === -1) this._formItemList.push(data);
      else this._formItemList.splice(idx, 1, data);

      this.layout && (data.context.formLayout = this.layout);
      this.defaultLabelWidth &&
        (data.context.formLabelWidth = this.defaultLabelWidth);
      this.valueAlign && (data.context.formValueAlign = this.valueAlign);
      this.labelAlign && (data.context.formLabelAlign = this.labelAlign);

      if (this.catchData?.[data.context.name]) {
        data.context.formChange(this.catchData?.[data.context.name]);
      }
    };

    this._onDestroyed = (data) => {
      if (!this.enabled) return;
      const idx = this._formItemList.findIndex((item) => item.id === data.id);
      if (idx !== -1) this._formItemList.splice(idx, 1);
    };

    yz.event.on("form-item-mounted" + "-" + this.pid, this._onMounted);
    yz.event.on("form-item-destroyed" + "-" + this.pid, this._onDestroyed);
  },
  destroyed() {
    this.catchData = null;
    this._formItemList = [];

    yz.event.off("form-item-mounted" + "-" + this.pid, this._onMounted);
    yz.event.off("form-item-destroyed" + "-" + this.pid, this._onDestroyed);
  },
  methods: {
    setValues(data) {
      this.catchData = {
        ...this.catchData,
        ...data,
      };

      this._formItemList?.forEach(({ context }) => {
        if (data[context.name] === undefined) return;
        context.formChange(data[context.name]);
      });
    },
    validateFields() {
      const validatorList = this._formItemList?.map(({ context }) =>
        context.validator()
      );
      return Promise.all(validatorList).then((results) => {
        const errList = results.filter((item) => item.error);
        if (errList.length) return Promise.reject(errList);
      });
    },
    submit() {
      this.validateFields().then(() => {
        this.$emit("finish", this.getValues());
      });
    },
    getValues() {
      return this._formItemList?.reduce(
        (formData, { context }) => ({
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

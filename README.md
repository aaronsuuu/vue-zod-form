# vue-zod-form

`vue-zod-form` 是一個基於 Vue 和 Zod 的表單驗證工具，旨在簡化表單驗證的流程，提供高效且可擴展的解決方案。

## 特性

- **基於 Zod 的驗證**：使用 Zod 定義和驗證表單數據結構。
- **簡單易用**：與 Vue 無縫整合，提供直觀的 API。
- **高效性能**：輕量級設計，適合各種規模的應用。
- **擴展性強**：支持自定義驗證規則和錯誤處理。

## 安裝

使用 npm 或 yarn 安裝：

```bash
npm install vue-zod-form
# 或
yarn add vue-zod-form
```

## 快速開始

以下是一個簡單的使用範例，展示如何使用 `vue-zod-form` 進行表單驗證：

```vue
<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.name.value" placeholder="Name" />
    <span v-if="form.name.error">{{ form.name.error.message }}</span>

    <input v-model="form.age.value" placeholder="Age" type="number" />
    <span v-if="form.age.error">{{ form.age.error.message }}</span>

    <input v-model="form.email.value" placeholder="Email" />
    <span v-if="form.email.error">{{ form.email.error.message }}</span>

    <button type="submit">提交</button>
    <button type="button" @click="clearAll">清除全部</button>
  </form>
</template>

<script setup>
import { useZodForm } from 'vue-zod-form';
import { z } from 'zod';

const { form, validate, clearOne, clearAll } = useZodForm(
  {
    name: {
      value: '',
      schema: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    },
    age: {
      value: '',
      schema: z.number().min(18, { message: 'You must be at least 18 years old' }),
    },
    email: {
      value: '',
      schema: z.string().email({ message: 'Invalid email address' }),
    },
  },
  { safe: true }
);

const onSubmit = () => {
  const result = validate();
  if (result?.success) {
    console.log('表單數據：', {
      name: form.name.value,
      age: form.age.value,
      email: form.email.value,
    });
  } else {
    console.error('驗證失敗：', result?.errors);
  }
};
</script>
```

## API

### `useZodForm(schema, options?)`

- **參數**：
  - `schema`：Zod 定義的驗證模式。
  - `options`（可選）：配置選項，例如 `{ safe: true }`，啟用安全模式返回驗證結果。
- **返回值**：
  - `form`：響應式表單數據及錯誤信息。
  - `validate`：驗證方法，支持全表單或單字段驗證。
  - `clearOne`：清除指定字段的值及錯誤信息。
  - `clearAll`：清除所有字段的值及錯誤信息。
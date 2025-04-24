# vue-zod-form

`vue-zod-form` is a form validation tool based on Vue and Zod, designed to simplify the form validation process and provide an efficient and extensible solution.

## Features

- **Zod-based Validation**: Use Zod to define and validate form data structures.
- **Easy to Use**: Seamlessly integrates with Vue, offering an intuitive API.
- **High Performance**: Lightweight design suitable for applications of all sizes.
- **Extensibility**: Supports custom validation rules and error handling.

## Installation

Install using npm or yarn:

```bash
npm install vue-zod-form
# or
yarn add vue-zod-form
```

## Quick Start

Here is a simple example demonstrating how to use `vue-zod-form` for form validation:

```vue
<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.name.value" placeholder="Name" />
    <span v-if="form.name.error">{{ form.name.error.message }}</span>

    <input v-model="form.age.value" placeholder="Age" type="number" />
    <span v-if="form.age.error">{{ form.age.error.message }}</span>

    <input v-model="form.email.value" placeholder="Email" />
    <span v-if="form.email.error">{{ form.email.error.message }}</span>

    <button type="submit">Submit</button>
    <button type="button" @click="clearAll">Clear All</button>
  </form>
</template>

<script setup>
import { useZodForm } from 'vue-zod-form';
import { z } from 'zod';

// form is a reactive object containing the form data and error information, using it to bind to the input fields.
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
  }
);

const onSubmit = () => {
  try{
    validate();
    // If validation passes, you can proceed with form submission
    console.log('Form submitted successfully:', {
      name: form.name.value,
      age: form.age.value,
      email: form.email.value,
    });
  }catch(e){
    console.error(e);
    // If validation fails, you can handle the errors here, and error message will be placed in the respective fields
    // For example, you can show a notification or highlight the invalid fields
    // You might also want to log the error details for debugging purposes
  }
};
</script>
```

## Safe Mode

In safe mode, the validation result will not throw an error if the validation fails. Instead, it will return an object containing the validation results for each field. This allows you to handle validation errors more flexibly.

### Example of Safe Mode

```javascript
const initialData = {
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
}

// Using safe mode to validate the form
const { form, validate } = useZodForm(initialData, { safe: true });

function onSubmit(){
  const result = validate();
  if(result.success){
    // If validation passes, you can proceed with form submission
    console.log('Form submitted successfully:', {
      name: form.name.value,
      age: form.age.value,
      email: form.email.value,
    });
  }
}
```


## API

### `useZodForm(schema, options?)`

- **Parameters**:
  - `schema`: Validation schema defined using Zod.
  - `options` (optional): Configuration options, e.g., `{ safe: true }` to enable safe mode for validation results.
- **Returns**:
  - `form`: Reactive form data and error information.
  - `validate`: Validation method, supports full form or single field validation.
  - `clearOne`: Clears the value and error of a specific field.
  - `clearAll`: Clears the values and errors of all fields.
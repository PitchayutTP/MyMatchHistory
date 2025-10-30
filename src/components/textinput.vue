    <script>
    export default {
      name: "TextInput",
      props: {
        label: String,
        type: {
          type: String,
          default: "text",
        },
        placeholder: String,
        modelValue: String,
      },
      emits: ["update:modelValue"],
    };
    </script>
<template>
  <div class="mb-2">
    <label v-if="label" class="block text-gray-700 text-md">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full py-1 border-b border-gray-500 focus:outline-none hover:border-gray-800"
    />
  </div>
</template>




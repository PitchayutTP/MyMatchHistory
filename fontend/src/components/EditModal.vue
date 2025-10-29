<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-opacity-75 flex justify-center items-center p-4 z-50"
        @click.self="close"
    >
        <div class="bg-gray-50 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">แก้ไขข้อมูลวิดีโอ</h2>

            <form @submit.prevent="save" v-if="editableItem">
                <div class="mb-4">
                    <label
                        for="editTitle"
                        class="block text-sm font-medium text-gray-700"
                        >ชื่อเรื่อง</label
                    >
                    <input
                        type="text"
                        id="editTitle"
                        v-model="editableItem.title"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div class="mb-4">
                    <label
                        for="editChannel"
                        class="block text-sm font-medium text-gray-700"
                        >ช่อง</label
                    >
                    <input
                        type="text"
                        id="editChannel"
                        v-model="editableItem.channel"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div class="mb-6">
                    <label
                        for="editWatchedAt"
                        class="block text-sm font-medium text-gray-700"
                        >ดูเมื่อ</label
                    >
                    <input
                        type="text"
                        id="editWatchedAt"
                        v-model="editableItem.watchedAt"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        @click="close"
                        class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        class="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["close", "save"]);

const editableItem = ref(null);
watch(
    () => props.item,
    (newItem) => {
        if (newItem) {
            editableItem.value = { ...newItem };
        } else {
            editableItem.value = null;
        }
    },
);

function close() {
    emit("close");
}

function save() {
    if (editableItem.value) {
        emit("save", editableItem.value);
    }
}
</script>

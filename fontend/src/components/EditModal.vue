<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 flex justify-center items-center p-4 z-50"
        @click.self="close"
    >
        <div
            class="bg-gray-50 p-6 rounded-lg shadow-xl w-full max-w-md overflow-y-auto"
            style="max-height: 90vh"
        >
            <h2 class="text-2xl font-bold mb-4">แก้ไขข้อมูลการแข่งขัน</h2>

            <form @submit.prevent="save" v-if="editableItem" class="space-y-4">
                <div>
                    <label
                        for="editTitle"
                        class="block text-sm font-medium text-gray-700"
                        >ชื่อ (Title)</label
                    >
                    <input
                        type="text"
                        id="editTitle"
                        v-model="editableItem.title"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div>
                    <label
                        for="editSport"
                        class="block text-sm font-medium text-gray-700"
                        >กีฬา</label
                    >
                    <input
                        type="text"
                        id="editSport"
                        v-model="editableItem.sport"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div>
                    <label
                        for="editOpponent"
                        class="block text-sm font-medium text-gray-700"
                        >ทีมตรงข้าม</label
                    >
                    <input
                        type="text"
                        id="editOpponent"
                        v-model="editableItem.opponent"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                <div>
                    <label
                        for="editLocation"
                        class="block text-sm font-medium text-gray-700"
                        >Location (สถานที่)</label
                    >
                    <input
                        type="text"
                        id="editLocation"
                        v-model="editableItem.location"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="editResult"
                            class="block text-sm font-medium text-gray-700"
                            >ผลลัพธ์</label
                        >
                        <select
                            id="editResult"
                            v-model="editableItem.result"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="">Select result</option>
                            <option value="win">Win</option>
                            <option value="lose">Lose</option>
                            <option value="draw">Draw</option>
                        </select>
                    </div>

                    <div>
                        <label
                            for="editScore"
                            class="block text-sm font-medium text-gray-700"
                            >คะแนน</label
                        >
                        <input
                            type="text"
                            id="editScore"
                            v-model="editableItem.score"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="editDate"
                        class="block text-sm font-medium text-gray-700"
                        >วันที่</label
                    >
                    <input
                        type="date"
                        id="editDate"
                        v-model="editableItem.date"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div>
                    <label
                        for="editNote"
                        class="block text-sm font-medium text-gray-700"
                        >Note (หมายเหตุ)</label
                    >
                    <textarea
                        id="editNote"
                        v-model="editableItem.note"
                        rows="3"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Additional details..."
                    ></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-4">
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
import { ref, watch} from "vue";

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
            const itemCopy = { ...newItem };
            if (itemCopy.date) {
                itemCopy.date = new Date(itemCopy.date)
                    .toISOString()
                    .split("T")[0];
            }
            editableItem.value = itemCopy;
        } else {
            editableItem.value = null;
        }
    },
    { deep: true, immediate: true },
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

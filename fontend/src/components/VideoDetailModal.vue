<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black"
        @click.self="$emit('close')"
    >
        <div
            class="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl"
        >
            <div class="">
                <video
                    v-if="video.videoSrc"
                    :src="video.videoSrc"
                    controls
                    autoplay
                    class="aspect-video w-full"
                >
                    Your browser does not support the video tag.
                </video>
                <div
                    v-else
                    class="flex aspect-video w-full items-center justify-center bg-gray-700 text-white"
                >
                    (No video source provided)
                </div>
            </div>

            <div class="p-6">
                <h2 class="mb-2 text-2xl font-bold">{{ video.title }}</h2>
                <p class="text-gray-600">
                    นี่คือส่วนรายละเอียดวิดีโอ คุณสามารถเพิ่มคำอธิบาย,
                    วันที่อัปโหลด, หรือข้อมูลอื่นๆ ได้ที่นี่
                </p>

                <button
                    @click="$emit('close')"
                    class="mt-4 rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    video: {
        type: Object,
        required: true,
    },
});

defineEmits(["close"]);
</script>

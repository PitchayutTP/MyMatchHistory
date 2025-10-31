<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black" @click.self="$emit('close')">
        <div class="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div class="">
                <video v-if="video.videoSrc" :src="video.videoSrc" controls autoplay class="aspect-video w-full">
                    Your browser does not support the video tag.
                </video>
                <div v-else class="flex aspect-video w-full items-center justify-center bg-gray-700 text-white">
                    (No video source provided)
                </div>
            </div>

            <div class="p-6">
                <h2 class="mb-4 text-center text-2xl font-bold text-gray-900">
                    {{ video.title }}
                </h2>

                <div class="mb-6 rounded-lg bg-gray-100 p-4 text-center">
                    <span class="text-5xl font-bold text-gray-800">{{
                        video.score
                    }}</span>

                    <span class="ml-2 px-3 py-1 align-middle text-sm font-semibold uppercase tracking-wider" :class="{
                        'rounded-full bg-green-200 text-green-800':
                            video.result === 'win',
                        'rounded-full bg-red-200 text-red-800':
                            video.result === 'lose',
                        'rounded-full bg-gray-200 text-gray-800':
                            video.result !== 'win' &&
                            video.result !== 'lose',
                    }">
                        {{ video.result }}
                    </span>
                </div>

                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-sm font-semibold uppercase text-gray-500">Sport</span>
                        <span class="font-medium text-gray-900">{{
                            video.sport_id
                        }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-sm font-semibold uppercase text-gray-500">Opponent</span>
                        <span class="font-medium text-gray-900">{{
                            video.opponent
                        }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-sm font-semibold uppercase text-gray-500">Location</span>
                        <span class="font-medium text-gray-900">{{
                            video.location
                        }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-sm font-semibold uppercase text-gray-500">Date</span>
                        <span class="font-medium text-gray-900">{{
                            video.match_date
                        }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-sm font-semibold uppercase text-gray-500">note</span>
                        <span class="font-medium text-gray-900">{{
                            video.notes
                        }}</span>
                    </div>
                </div>

                <button @click="$emit('close')"
                    class="mt-8 w-full rounded bg-orange-600 px-4 py-3 font-bold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
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
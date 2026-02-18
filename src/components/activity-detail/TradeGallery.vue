<script setup>
import { ref, onUnmounted } from 'vue'

defineProps({
  tradeId: { type: String, required: true },
  getImages: { type: Function, required: true },
  addImagesFn: { type: Function, required: true },
  removeImagesFn: { type: Function, required: true },
})

const inputRef = ref(null)
const localUrls = ref([])

const onAddClick = () => {
  inputRef.value && inputRef.value.click()
}

const onFiles = async (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  try {
    const created = await addImagesFn(tradeId, files)
    // track created urls locally so we can revoke when unmounted
    localUrls.value.push(...created)
  } catch (err) {
    console.error('file add error', err)
  } finally {
    e.target.value = ''
  }
}

onUnmounted(() => {
  try {
    if (localUrls.value.length) removeImagesFn(tradeId, localUrls.value)
  } catch (e) {}
})
</script>

<template>
  <div class="trade-gallery">
    <input
      ref="inputRef"
      type="file"
      multiple
      accept="image/*"
      @change="onFiles"
      style="display: none"
    />
    <div class="gallery-grid">
      <div class="gallery-large" v-if="getImages(tradeId)[0]">
        <img :src="getImages(tradeId)[0]" alt="gallery" />
      </div>
      <div class="gallery-stack">
        <img v-for="(img, i) in getImages(tradeId).slice(1, 3)" :key="i" :src="img" alt="gallery" />
      </div>
    </div>
    <div class="gallery-actions">
      <button class="btn" @click="onAddClick">Add Images from gallery</button>
    </div>
  </div>
</template>

<style scoped>
.gallery-grid {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}
.gallery-large {
  flex: 2;
}
.gallery-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.gallery-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}
.gallery-stack img {
  width: 100%;
  height: 50%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.gallery-actions {
  margin-top: 0.75rem;
}
.btn {
  background: var(--surface-1);
  border: 1px solid var(--surface-border);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>

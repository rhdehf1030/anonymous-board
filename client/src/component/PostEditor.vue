<template>
  <v-dialog v-model="isShow">
    <v-card class="detail">
      <v-card-title>
        {{ mode === 'create' ? 'Create' : 'Edit' }} Post
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="title"
              label="Title"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="author"
              :disabled="mode === 'update'"
              label="Author"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="body"
              label="Body"
              class="h-100"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!isValid"
          color="primary"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="showSavedSnackbar">
    저장되었습니다
  </v-snackbar>

  <v-snackbar v-model="showErrorSnackbar">
    에러가 발생했습니다.
  </v-snackbar>
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { PostResponse } from '@/api/response/post/post.response'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  editPost?: PostResponse
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved'): void
}>()

const mode = ref<'create' | 'update'>('create')

const title = ref<string>()
const body = ref<string>()
const author = ref<string>()
const password = ref<string>()

const showSavedSnackbar = ref(false)
const showErrorSnackbar = ref(false)

const isShow = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const isValid = computed(() => {
  return !!author.value && !!body.value && !!password.value && !!title.value
})

// Save Post
const save = async () => {
  try {
    if (mode.value === 'create') {
      // Create
      await api.post.create({
        author: author.value!,
        body: body.value!,
        password: password.value!,
        title: title.value!
      })
    } else if (mode.value === 'update' && props.editPost?.id) {
      // Update
      await api.post.update(props.editPost.id, {
        body: body.value!,
        password: password.value!,
        title: title.value!
      })
    }

    showSavedSnackbar.value = true
    emit('saved')
  } catch {
    showErrorSnackbar.value = true
  }
}

watch(
  () => props.editPost,
  (val) => {
    // set mode
    if (val) {
      mode.value = 'update'
    } else {
      mode.value = 'create'
    }
  }
)

watch(isShow, (val) => {
  // reset data when open dialog
  if (val) {
    title.value = props.editPost?.title
    body.value = props.editPost?.body
    author.value = props.editPost?.author
    password.value = undefined
  }
})
</script>

<style scoped>
.detail {
  width: 60vw;
  min-height: 50vh;
}
</style>

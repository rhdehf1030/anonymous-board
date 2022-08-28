<template>
  <v-dialog v-model="isShow">
    <v-card class="detail">
      <v-card-title>
        {{ detailPost?.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ detailPost?.author }},
        {{ formatCreatedAt(detailPost?.createdAt) }}
      </v-card-subtitle>

      <v-card-text>
        {{ detailPost?.body }}
      </v-card-text>

      <v-card-text v-if="showDelete">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="showDelete">
        <v-btn
          color="primary"
          @click="remove"
        >
          CONFIRM DELETE
        </v-btn>
        <v-btn
          color="primary"
          @click="showDelete = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn
          color="primary"
          @click="showDelete = true"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          @click="edit"
        >
          Edit
        </v-btn>
        <v-btn
          color="primary"
          @click="isShow = false"
        >
          Close
        </v-btn>
      </v-card-actions>

      <v-card-title> Comment </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="author"
              label="Author"
            />
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="comment"
              label="Write Comment"
              append-icon="mdi-keypost-return"
              @click:append="createComment"
              @keydown.enter="createComment"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <post-comment
        v-model:page="page"
        :post-id="props.detailPost?.id"
        :comments="comments"
        :page-length="pageLength"
        @reload="fetchCommentList"
      />
    </v-card>
  </v-dialog>

  <v-snackbar v-model="showDeleteSnackbar">
    삭제되었습니다.
  </v-snackbar>

  <v-snackbar v-model="showErrorSnackbar">
    에러가 발생했습니다.
  </v-snackbar>
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { PostCommentResponse } from '@/api/response/post/post-comment.response'
import { PostResponse } from '@/api/response/post/post.response'
import { formatCreatedAt } from '@/util/string-format'
import { computed, ref, watch } from 'vue'
import PostComment from './PostComment.vue'

const props = defineProps<{
  modelValue: boolean
  detailPost?: PostResponse
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'edit'): void
  (event: 'removed'): void
}>()

const limit = 10
const page = ref(1)

const comments = ref<PostCommentResponse[]>([])
const total = ref(0)

const comment = ref('')
const author = ref('')

const showDelete = ref(false)
const password = ref('')

const showErrorSnackbar = ref(false)
const showDeleteSnackbar = ref(false)

const isShow = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const pageLength = computed(() => {
  return Math.ceil(total.value / limit)
})

const edit = () => {
  emit('edit')
}

const remove = async () => {
  try {
    if (props.detailPost?.id) {
      // delete post
      await api.post.delete(props.detailPost.id, password.value)
      emit('removed')
    }
    showDeleteSnackbar.value = true
  } catch {
    showErrorSnackbar.value = true
  }
}

const fetchCommentList = async () => {
  if (props.detailPost?.id) {
    // fetch comment list
    const res = await api.postComment.list(props.detailPost.id, {
      page: page.value,
      limit
    })

    comments.value = res.items
    total.value = res.total
  }
}

const createComment = async () => {
  if (props.detailPost?.id) {
    // create comment
    await api.postComment.create(props.detailPost.id, {
      body: comment.value,
      author: author.value
    })

    // reaload comment list
    if (page.value !== 1) {
      page.value = 1
    } else {
      fetchCommentList()
    }

    comment.value = ''
  }
}

watch(page, fetchCommentList)
watch(isShow, (val) => {
  // Fetch Comment List
  if (val && page.value !== 1) {
    page.value = 1
  } else if (val) {
    fetchCommentList()
  } else {
    // reset
    showDelete.value = false
    password.value = ''
    comment.value = ''
  }
})
</script>

<style scoped>
.detail {
  width: 60vw;
  min-height: 50vh;
}
</style>

<template>
  <v-list>
    <template
      v-for="(comment, i) in comments"
      :key="i"
    >
      <v-list-item
        two-line
        @click="targetChildId = targetChildId === comment.id ? '' : comment.id"
      >
        <v-list-item-title>{{ comment.body }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ comment.author }},
          {{ formatCreatedAt(comment.createdAt) }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item
        v-if="targetChildId === comment.id"
        two-line
        class="bg-grey-lighten-3"
      >
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="childCommentAuthor"
              label="Author"
            />
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="childCommentBody"
              label="Write Comment"
              append-icon="mdi-keypost-return"
              @click:append="createChildComment"
              @keydown.enter="createChildComment"
            />
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item
        v-for="(childComment, j) in comment.childs"
        :key="j"
        two-line
        class="bg-grey-lighten-3"
      >
        <template #prepend>
          <v-icon> mdi-arrow-right-bottom </v-icon>
        </template>

        <v-list-item-title>{{ childComment.body }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ childComment.author }},
          {{ formatCreatedAt(childComment.createdAt) }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-list>
  <v-pagination
    v-model="innerPage"
    :length="pageLength"
  />
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { PostCommentResponse } from '@/api/response/post/post-comment.response'
import { formatCreatedAt } from '@/util/string-format'
import { computed, ref } from 'vue'

const props = defineProps<{
  comments: PostCommentResponse[]
  page: number
  pageLength: number
  postId?: string
}>()

const emit = defineEmits<{
  (event: 'update:page', value: number): void
  (event: 'reload'): void
}>()

const targetChildId = ref('')
const childCommentAuthor = ref('')
const childCommentBody = ref('')

const innerPage = computed({
  get: () => props.page,
  set: (value) => {
    emit('update:page', value)
  }
})

// Create Child Comment
const createChildComment = async () => {
  if (props.postId) {
    await api.postComment.create(props.postId, {
      parentId: targetChildId.value,
      body: childCommentBody.value,
      author: childCommentAuthor.value
    })

    emit('reload')

    childCommentBody.value = ''
  }
}
</script>

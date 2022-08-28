<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row justify="center">
          <v-col
            cols="8"
            align="end"
          >
            <v-btn @click="create">
              Create
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="8">
            <v-sheet class="px-2 py-2">
              <v-row justify="end">
                <v-col cols="3">
                  <v-select
                    v-model="searchType"
                    :items="['title', 'author']"
                    label="Search Type"
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="search"
                    label="Search Text"
                    @keydown.enter="searchPost"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="8">
            <v-sheet class="pa-2">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      Title
                    </th>
                    <th class="text-center">
                      Author
                    </th>
                    <th class="text-center">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(post, i) in posts"
                    :key="i"
                    @click="detailPostId = post.id"
                  >
                    <td>{{ post.title }}</td>
                    <td class="text-center">
                      {{ post.author }}
                    </td>
                    <td class="text-center">
                      {{ formatCreatedAt(post.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-pagination
              v-model="page"
              :length="pageLength"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>

  <post-viewer
    v-model="showDetail"
    :detail-post="detailPost"
    @edit="edit"
    @removed="removed"
  />

  <post-editor
    v-model="showEditor"
    :edit-post="editPost"
    @saved="saved"
  />
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import { api } from './api'
import { PostResponse } from './api/response/post/post.response'
import { formatCreatedAt } from './util/string-format'
import PostViewer from './component/PostViewer.vue'
import PostEditor from './component/PostEditor.vue'
import { PostSearchType } from './api/dto/post-list.dto'

// Current Page, Limit
const limit = 10
const page = ref(1)

// Post List, Total Count
const posts = ref<PostResponse[]>([])
const total = ref(0)

// Post for Viewer
const detailPostId = ref<string>()
const detailPost = ref<PostResponse>()

const showEditor = ref(false)

// Post for Editor
const editPostId = ref<string>()
const editPost = ref<PostResponse>()

// Search Type, Search Text
const searchType = ref<PostSearchType>(PostSearchType.TITLE)
const search = ref('')

// Page Length for Pagination
const pageLength = computed(() => {
  return Math.ceil(total.value / limit)
})

const showDetail = computed({
  get: () => !!detailPostId.value,
  set: (val) => {
    if (!val) {
      detailPostId.value = undefined
    }
  }
})

// Fetch posts
const fetchList = async () => {
  const res = await api.post.list({
    page: page.value,
    limit,
    searchType: searchType.value,
    search: search.value
  })

  posts.value = res.items
  total.value = res.total
}

// Open Editor
const create = () => {
  editPostId.value = undefined
  editPost.value = undefined
  showEditor.value = true
}

// Open Editor
const edit = () => {
  editPostId.value = detailPostId.value
  editPost.value = posts.value.find((b) => b.id === detailPostId.value)
  showDetail.value = false
  showEditor.value = true
}

// Post Removed
const removed = () => {
  if (page.value !== 1) {
    page.value = 1
  } else {
    fetchList()
  }

  showDetail.value = false
}

/// Post Saved
const saved = () => {
  showEditor.value = false

  if (!editPostId.value && page.value !== 1) {
    page.value = 1
  } else {
    fetchList()
  }
}

// saerch post
const searchPost = () => {
  page.value = 1
  fetchList()
}

watch(page, fetchList, { immediate: true })

watch(detailPostId, (val) => {
  if (val) {
    detailPost.value = posts.value.find((b) => b.id === val)
  }
})
</script>

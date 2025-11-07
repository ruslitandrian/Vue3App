<template>
  <section>
    <h2>Users</h2>

    <form class="create" @submit.prevent="createUser" autocomplete="off">
      <input v-model.trim="createForm.name" type="text" placeholder="Name" required />
      <input v-model.trim="createForm.email" type="email" placeholder="Email" required />
      <input v-model="createForm.password" type="password" placeholder="Password" required />
      <input v-model="createForm.password_confirmation" type="password" placeholder="Confirm Password" required />
      <button type="submit" :disabled="busy">Create</button>
    </form>
    <div v-if="Object.keys(createErrors).length" class="form-errors">
      <div v-for="(errs, field) in createErrors" :key="field" class="form-error">
        <strong>{{ field }}:</strong> {{ errs.join(', ') }}
      </div>
    </div>

    <div v-if="loading" class="state">Loading...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="grid">
      <article v-for="u in users" :key="u.id" class="card">
        <template v-if="editId === u.id">
          <input v-model.trim="editForm.name" type="text" placeholder="Name" />
          <input v-model.trim="editForm.email" type="email" placeholder="Email" />
        </template>
        <template v-else>
          <h3 class="name">{{ u.name }}</h3>
          <p class="email">{{ u.email }}</p>
        </template>

        <dl class="meta">
          <div>
            <dt>ID</dt>
            <dd>{{ u.id }}</dd>
          </div>
          <div>
            <dt>Verified</dt>
            <dd>{{ formatDate(u.email_verified_at) }}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{{ formatDate(u.created_at) }}</dd>
          </div>
        </dl>

        <div class="actions">
          <button @click="viewUser(u.id)" :disabled="busy">View</button>
          <button v-if="editId !== u.id" @click="startEdit(u)" :disabled="busy">Edit</button>
          <template v-else>
            <button @click="saveEdit(u.id)" :disabled="busy">Save</button>
            <button @click="cancelEdit" :disabled="busy">Cancel</button>
          </template>
          <button class="danger" @click="deleteUser(u.id)" :disabled="busy">Delete</button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type User = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

type UsersResponse = {
  success: boolean
  data: User[]
  message: string
}

type UserResponse = {
  success: boolean
  data: User
  message: string
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const busy = ref(false)

const createForm = ref({ name: '', email: '', password: '', password_confirmation: '' })
const createErrors = ref<Record<string, string[]>>({})
const editId = ref<number | null>(null)
const editForm = ref({ name: '', email: '' })

const API_URL = '/api/users'

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleString()
  } catch {
    return iso
  }
}

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(API_URL, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as UsersResponse
    if (!json.success) throw new Error(json.message || 'Failed to load users')
    users.value = json.data
  } catch (e: any) {
    error.value = e?.message || 'Request failed'
  } finally {
    loading.value = false
  }
}

async function createUser() {
  if (!createForm.value.name || !createForm.value.email || !createForm.value.password || !createForm.value.password_confirmation) return
  if (createForm.value.password !== createForm.value.password_confirmation) {
    createErrors.value = { password_confirmation: ['Passwords do not match'] }
    return
  }
  busy.value = true
  error.value = null
  createErrors.value = {}
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(createForm.value)
    })
    if (!res.ok) {
      // Try to parse validation errors
      let body: any = null
      try { body = await res.json() } catch {}
      if (res.status === 422 && body && body.errors) {
        createErrors.value = body.errors as Record<string, string[]>
        const firstField = Object.keys(createErrors.value)[0]
        const firstMsg = firstField ? createErrors.value[firstField][0] : 'Validation error'
        throw new Error(firstMsg)
      }
      throw new Error(body?.message || `HTTP ${res.status}`)
    }
    const json = (await res.json()) as UserResponse | UsersResponse
    const ok = (json as any).success !== false
    if (!ok) throw new Error((json as any).message || 'Create failed')
    createForm.value = { name: '', email: '', password: '', password_confirmation: '' }
    await loadUsers()
  } catch (e: any) {
    error.value = e?.message || 'Request failed'
  } finally {
    busy.value = false
  }
}

async function viewUser(id: number) {
  busy.value = true
  try {
    const res = await fetch(`${API_URL}/${id}`, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as UserResponse
    // Simple view: alert JSON; replace with modal if needed
    alert(JSON.stringify(json.data, null, 2))
  } catch (e: any) {
    error.value = e?.message || 'Request failed'
  } finally {
    busy.value = false
  }
}

function startEdit(u: User) {
  editId.value = u.id
  editForm.value = { name: u.name, email: u.email }
}

function cancelEdit() {
  editId.value = null
  editForm.value = { name: '', email: '' }
}

async function saveEdit(id: number) {
  if (editId.value !== id) return
  busy.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(editForm.value)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as UserResponse | UsersResponse
    const ok = (json as any).success !== false
    if (!ok) throw new Error((json as any).message || 'Update failed')
    editId.value = null
    editForm.value = { name: '', email: '' }
    await loadUsers()
  } catch (e: any) {
    error.value = e?.message || 'Request failed'
  } finally {
    busy.value = false
  }
}

async function deleteUser(id: number) {
  if (!confirm('Delete this user?')) return
  busy.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // Many APIs return 204 No Content; handle both
    try { await res.json() } catch {}
    await loadUsers()
  } catch (e: any) {
    error.value = e?.message || 'Request failed'
  } finally {
    busy.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
section {
  display: grid;
  gap: 16px;
}

h2 {
  margin: 0 0 8px;
}

.state {
  color: #666;
}
.state.error {
  color: #d33;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.name {
  margin: 0 0 4px;
  font-size: 16px;
}
.email {
  margin: 0 0 8px;
  color: #4b5563;
  word-break: break-all;
}
.meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
}
.meta dt {
  font-size: 12px;
  color: #6b7280;
}
.meta dd {
  margin: 0;
  font-weight: 600;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.create {
  display: flex;
  gap: 8px;
  align-items: center;
}
.create input {
  flex: 1 1 200px;
}
</style>

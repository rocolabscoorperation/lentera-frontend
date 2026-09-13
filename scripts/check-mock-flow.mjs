import assert from 'node:assert/strict'
import { createServer } from 'vite'

process.env.VITE_USE_MOCK = 'true'
const storage = new Map()
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
}
globalThis.window = { dispatchEvent() {} }
globalThis.Event = class { constructor(type) { this.type = type } }

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { setupMocks } = await server.ssrLoadModule('/src/mocks/index.ts')
  const { api } = await server.ssrLoadModule('/src/services/api.ts')
  setupMocks()

  await assert.rejects(
    api.post('/auth/login', { phoneNumber: '081234567890', password: 'salah' }),
    (error) => error.status === 401,
  )
  const login = await api.post('/auth/login', { phoneNumber: '081234567890', password: 'Lentera123' })
  localStorage.setItem('lentera_token', login.data.token)
  assert.equal((await api.get('/parents/me')).data.profile.name, 'Nadia Putri')
  const children = (await api.get('/children')).data
  assert.equal(children.length, 2)
  const assessments = (await api.get('/assessments')).data
  const questions = (await api.get(`/assessments/${assessments[0].id}/questions`)).data
  assert.equal(questions.length, 5)
  await assert.rejects(
    api.post(`/assessments/${assessments[0].id}/start`, { childId: 'anak-orang-lain' }),
    (error) => error.status === 403,
  )

  const attempt = (await api.post(`/assessments/${assessments[0].id}/start`, { childId: children[0].id })).data
  await assert.rejects(
    api.post(`/assessments/attempt/${attempt.id}/answers`, { answers: [] }),
    (error) => error.status === 422,
  )
  await api.post(`/assessments/attempt/${attempt.id}/answers`, {
    answers: questions.map((question) => ({ questionId: question.id, answer: 3 })),
  })
  const { resultId } = (await api.post(`/assessments/attempt/${attempt.id}/submit`)).data
  assert.equal((await api.get('/results')).data.length, 2)
  assert.equal((await api.get(`/results/${resultId}`)).data.placement, 'Sekolah Inklusi')
  assert.equal((await api.get(`/recommendations/result/${resultId}`)).data.length, 2)

  const registered = await api.post('/auth/register', { phoneNumber: '081222222222', password: 'contoh123' })
  localStorage.setItem('lentera_token', registered.data.token)
  assert.equal((await api.get('/children')).data.length, 0)
  assert.equal((await api.get('/results')).data.length, 0)
  await assert.rejects(api.get(`/results/${resultId}`), (error) => error.status === 404)
  console.log('Alur mock: akun lama, asesmen, hasil, rekomendasi, dan akun baru lulus.')
} finally {
  await server.close()
}

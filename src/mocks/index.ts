import type { AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { api } from '@/services/api'
import type { User } from '@/types/auth'
import type { Child } from '@/types/child'
import type { EntityId } from '@/types/common'
import type { ParentProfile } from '@/types/parent'
import type { AssessmentAnswerInput, AssessmentQuestion } from '@/types/assessment'
import type { AssessmentResultDetail } from '@/types/result'

interface DemoAccount {
  user: User
  password: string
  profile: ParentProfile | null
  children: Child[]
  results: AssessmentResultDetail[]
  attempts: Map<string, { childId: EntityId; answers?: AssessmentAnswerInput[] }>
}

type Reply = [number, unknown?]

/** Development-only API fixture. No value here is a research result or a DSS rule. */
export function setupMocks() {
  if (import.meta.env.VITE_USE_MOCK !== 'true' || !import.meta.env.DEV) return

  const mock = new MockAdapter(api, { delayResponse: 350 })
  const now = () => new Date().toISOString()
  let sequence = 0

  const template = {
    id: 'demo-template',
    name: 'Simulasi asesmen pendidikan',
    description: 'Pertanyaan di bawah hanya contoh untuk mencoba alur. Bukan instrumen penelitian final.',
    version: 'Demo',
    isActive: true,
    createdAt: now(),
  }
  const statements = [
    'Anak menyampaikan kebutuhan sehari-hari kepada orang dewasa di sekitarnya.',
    'Anak mengikuti instruksi sederhana dalam kegiatan bersama.',
    'Anak mencoba berinteraksi dengan teman sebaya saat bermain.',
    'Anak menyelesaikan kegiatan sederhana dengan dukungan yang tersedia.',
    'Anak menunjukkan minat mengikuti kegiatan belajar bersama.',
  ]
  const questions: AssessmentQuestion[] = statements.map((questionText, index) => ({
    id: `demo-question-${index + 1}`,
    assessmentId: template.id,
    questionOrder: index + 1,
    questionText: `${questionText} (contoh uji coba)`,
  }))

  function sampleResult(id: string, attemptId: EntityId, createdAt: string): AssessmentResultDetail {
    return {
      id,
      attemptId,
      totalScore: 72,
      placement: 'Sekolah Inklusi',
      interpretation: 'Ini simulasi respons hasil dari backend mock. Skor dan jalur yang ditampilkan bukan hasil perhitungan atas jawaban Anda dan bukan kesimpulan penelitian.',
      recommendationExplanation: 'Penjelasan contoh untuk menguji tampilan hasil. Penjelasan nyata harus disediakan oleh backend setelah metode penelitian ditetapkan.',
      createdAt,
      recommendedSchools: [
        {
          id: `${id}-school-1`, resultId: id, schoolId: 'demo-school-1', rank: 1,
          reason: 'Alasan contoh dari backend mock; bukan penilaian sekolah nyata.', createdAt,
          school: {
            id: 'demo-school-1', name: 'SD Inklusi Cakrawala (simulasi)',
            schoolType: 'Sekolah Inklusi', address: 'Jl. Contoh No. 12', city: 'Denpasar',
            description: 'Sekolah fiktif untuk menguji tampilan rekomendasi.', createdAt,
          },
        },
        {
          id: `${id}-school-2`, resultId: id, schoolId: 'demo-school-2', rank: 2,
          reason: 'Alasan contoh dari backend mock; bukan penilaian sekolah nyata.', createdAt,
          school: {
            id: 'demo-school-2', name: 'SD Inklusi Pelita (simulasi)',
            schoolType: 'Sekolah Inklusi', address: 'Jl. Ilustrasi No. 8', city: 'Denpasar',
            description: 'Sekolah fiktif untuk menguji tampilan rekomendasi.', createdAt,
          },
        },
      ],
    }
  }

  const demoUser: User = { id: 'demo-user', phoneNumber: '081234567890', createdAt: now() }
  const demoAccount: DemoAccount = {
    user: demoUser,
    password: 'Lentera123',
    profile: {
      id: 'demo-parent', userId: demoUser.id, name: 'Nadia Putri',
      birthDate: '1988-09-12', gender: 'Perempuan', address: 'Denpasar, Bali', createdAt: now(),
    },
    children: [
      { id: 'demo-child-1', parentId: 'demo-parent', name: 'Alya Putri', birthDate: '2015-05-21', gender: 'Perempuan', createdAt: now() },
      { id: 'demo-child-2', parentId: 'demo-parent', name: 'Bima Putra', birthDate: '2019-02-08', gender: 'Laki-laki', createdAt: now() },
    ],
    results: [sampleResult('demo-result-history', 'demo-attempt-history', new Date(Date.now() - 14 * 86400000).toISOString())],
    attempts: new Map(),
  }
  const accounts = new Map<string, DemoAccount>([[demoUser.phoneNumber, demoAccount]])
  const current = () => {
    const token = localStorage.getItem('lentera_token')
    return token?.startsWith('mock:') ? accounts.get(token.slice(5)) : undefined
  }
  const secure = (handler: (config: AxiosRequestConfig, account: DemoAccount) => Reply) =>
    (config: AxiosRequestConfig): Reply => {
      const account = current()
      return account ? handler(config, account) : [401, {}]
    }
  const payload = (config: AxiosRequestConfig) => JSON.parse(config.data ?? '{}')
  const lastId = (config: AxiosRequestConfig) => config.url?.split('/').pop() ?? ''
  const attemptId = (config: AxiosRequestConfig) => config.url?.split('/')[3] ?? ''

  mock.onPost('/auth/register').reply((config) => {
    const { phoneNumber, password } = payload(config)
    if (accounts.has(phoneNumber)) return [422, { errors: { phoneNumber: 'Nomor sudah terdaftar' } }]
    const user: User = { id: `demo-user-${++sequence}`, phoneNumber, createdAt: now() }
    accounts.set(phoneNumber, { user, password, profile: null, children: [], results: [], attempts: new Map() })
    return [201, { user, token: `mock:${phoneNumber}` }]
  })
  mock.onPost('/auth/login').reply((config) => {
    const { phoneNumber, password } = payload(config)
    const account = accounts.get(phoneNumber)
    return account && account.password === password
      ? [200, { user: account.user, token: `mock:${phoneNumber}` }] : [401, {}]
  })
  mock.onGet('/auth/me').reply(() => current() ? [200, current()!.user] : [401, {}])
  mock.onPost('/auth/logout').reply(204)

  mock.onGet('/parents/me').reply(secure((_config, account) => [200, { user: account.user, profile: account.profile }]))
  mock.onPut('/parents/me').reply(secure((config, account) => {
    account.profile = {
      id: account.profile?.id ?? `demo-parent-${++sequence}`, userId: account.user.id,
      ...account.profile, ...payload(config), createdAt: account.profile?.createdAt ?? now(),
    }
    return [200, { user: account.user, profile: account.profile }]
  }))

  mock.onGet('/children').reply(secure((_config, account) => [200, [...account.children]]))
  mock.onGet(/\/children\/[^/]+$/).reply(secure((config, account) => {
    const child = account.children.find((item) => String(item.id) === lastId(config))
    return child ? [200, child] : [404, {}]
  }))
  mock.onPost('/children').reply(secure((config, account) => {
    const child: Child = {
      id: `demo-created-child-${++sequence}`, parentId: account.profile?.id ?? null,
      ...payload(config), createdAt: now(),
    }
    account.children.push(child)
    return [201, child]
  }))
  mock.onPut(/\/children\/[^/]+$/).reply(secure((config, account) => {
    const index = account.children.findIndex((item) => String(item.id) === lastId(config))
    if (index < 0) return [404, {}]
    account.children[index] = { ...account.children[index]!, ...payload(config) }
    return [200, account.children[index]]
  }))

  mock.onGet('/assessments').reply(secure(() => [200, [template]]))
  mock.onGet(/\/assessments\/[^/]+\/questions$/).reply(secure((config) =>
    config.url?.split('/')[2] === template.id ? [200, questions] : [404, {}]))
  mock.onPost(/\/assessments\/[^/]+\/start$/).reply(secure((config, account) => {
    if (config.url?.split('/')[2] !== template.id) return [404, {}]
    const { childId } = payload(config)
    if (!account.children.some((child) => String(child.id) === String(childId))) return [403, {}]
    const id = `demo-attempt-${++sequence}`
    account.attempts.set(id, { childId })
    return [201, { id, childId, assessmentId: template.id, createdAt: now() }]
  }))
  mock.onPost(/\/assessments\/attempt\/[^/]+\/answers$/).reply(secure((config, account) => {
    const attempt = account.attempts.get(attemptId(config))
    if (!attempt) return [404, {}]
    const answers = payload(config).answers as AssessmentAnswerInput[]
    if (!Array.isArray(answers) || answers.length !== questions.length ||
        new Set(answers.map((answer) => String(answer.questionId))).size !== questions.length ||
        answers.some((answer) => !questions.some((q) => String(q.id) === String(answer.questionId)) ||
          !Number.isInteger(answer.answer) || answer.answer < 1 || answer.answer > 5)) return [422, {}]
    attempt.answers = answers
    return [204]
  }))
  mock.onPost(/\/assessments\/attempt\/[^/]+\/submit$/).reply(secure((config, account) => {
    const id = attemptId(config)
    const attempt = account.attempts.get(id)
    if (!attempt?.answers) return [422, {}]
    const resultId = `demo-result-${++sequence}`
    account.results.unshift(sampleResult(resultId, id, now()))
    account.attempts.delete(id)
    return [200, { resultId }]
  }))

  mock.onGet('/results').reply(secure((_config, account) => [200, account.results]))
  mock.onGet(/\/results\/[^/]+$/).reply(secure((config, account) => {
    const result = account.results.find((item) => String(item.id) === lastId(config))
    return result ? [200, result] : [404, {}]
  }))
  mock.onGet(/\/recommendations\/result\/[^/]+$/).reply(secure((config, account) => {
    const result = account.results.find((item) => String(item.id) === lastId(config))
    return result ? [200, result.recommendedSchools ?? []] : [404, {}]
  }))
  mock.onGet(/\/results\/[^/]+\/pdf$/).reply(404)
  mock.onAny().reply(404)
}

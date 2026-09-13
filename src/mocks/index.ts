import MockAdapter from 'axios-mock-adapter'
import { api } from '@/services/api'
import type { AssessmentTemplate } from '@/types/assessment'
import type { AssessmentResultDetail } from '@/types/result'
import type { Child } from '@/types/child'

export function setupMocks() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  console.log('[LENTERA] 🚀 Initializing API Mocks...')
  const mock = new MockAdapter(api, { delayResponse: 500 })

  // --- Auth ---
  mock.onPost('/auth/login').reply(200, { token: 'mock-token' })
  mock.onPost('/auth/register').reply(200, { token: 'mock-token' })
  mock.onGet('/auth/me').reply(200, {
    id: 'usr-1',
    phoneNumber: '081234567890',
    role: 'parent'
  })

  // --- Parent ---
  mock.onGet('/parents/me').reply(200, {
    id: 'par-1',
    userId: 'usr-1',
    name: 'Budi Santoso',
    birthDate: '1985-06-15T00:00:00Z',
    gender: 'Laki-laki',
    address: 'Jl. Merdeka No. 1'
  })
  mock.onPut('/parents/me').reply(200)

  // --- Children ---
  const children: Child[] = [
    {
      id: 'cld-1',
      parentId: 'par-1',
      name: 'Anisa Santoso',
      birthDate: '2015-04-10T00:00:00Z',
      gender: 'Perempuan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  mock.onGet('/children').reply(200, children)
  mock.onPost('/children').reply(200, children[0])
  mock.onPut(/\/children\/.+/).reply(200)

  // --- Assessments ---
  const template: AssessmentTemplate = {
    id: 'tpl-1',
    name: 'Asesmen Kesiapan Sekolah Inklusi',
    description: 'Menilai kemampuan dasar anak untuk mengikuti kegiatan belajar mengajar di sekolah inklusi.',
    version: '1.0',
    isActive: true,
    createdAt: new Date().toISOString()
  }
  mock.onGet('/assessments').reply(200, [template])
  mock.onGet(/\/assessments\/[^/]+$/).reply(200, {
    ...template,
    questions: [
      { id: 'q-1', templateId: 'tpl-1', order: 1, category: 'Kognitif', questionText: 'Anak mampu memusatkan perhatian pada satu tugas selama 5-10 menit tanpa teralihkan?' },
      { id: 'q-2', templateId: 'tpl-1', order: 2, category: 'Sosial', questionText: 'Anak menunjukkan ketertarikan untuk bermain dengan teman sebayanya?' },
      { id: 'q-3', templateId: 'tpl-1', order: 3, category: 'Komunikasi', questionText: 'Anak mampu mengekspresikan keinginannya (baik verbal maupun non-verbal) agar dipahami orang lain?' }
    ]
  })
  mock.onPost(/\/assessments\/[^/]+\/attempt/).reply(200, {
    id: 'atm-1',
    assessmentId: 'tpl-1',
    childId: 'cld-1',
    status: 'In_Progress'
  })
  mock.onPost(/\/assessments\/attempts\/[^/]+\/submit/).reply(200)

  // --- Results ---
  const result: AssessmentResultDetail = {
    id: 'res-1',
    attemptId: 'atm-1',
    totalScore: 75,
    classification: 'Tinggi',
    placement: 'Sekolah Inklusi',
    interpretation: 'Berdasarkan hasil asesmen, anak menunjukkan kesiapan yang baik dalam aspek kognitif dan sosial. Dukungan minimal mungkin masih diperlukan di beberapa area.',
    recommendationExplanation: 'Nilai di atas ambang batas (threshold) untuk klasifikasi Sekolah Inklusi.',
    createdAt: new Date().toISOString(),
    recommendedSchools: [
      {
        id: 'rec-1',
        resultId: 'res-1',
        schoolId: 'sch-1',
        rank: 1,
        reason: 'Fasilitas inklusi lengkap dan lokasi dekat',
        createdAt: new Date().toISOString(),
        school: {
          id: 'sch-1',
          name: 'SDN Inklusi Teladan',
          schoolType: 'Sekolah Inklusi',
          address: 'Jl. Pendidikan No. 45',
          city: 'Jakarta',
          description: 'Sekolah dengan program inklusi yang telah berjalan selama 5 tahun.',
          createdAt: new Date().toISOString()
        }
      }
    ]
  }
  mock.onGet('/results').reply(200, [result])
  mock.onGet(/\/results\/[^/]+$/).reply(200, result)
  mock.onGet(/\/results\/[^/]+\/recommendations/).reply(200, result.recommendedSchools)

  // Fallback
  mock.onAny().reply((config) => {
    console.warn(`[LENTERA Mock] Unhandled request: ${config.method?.toUpperCase()} ${config.url}`)
    return [404, { message: 'Not Found in Mock' }]
  })
}

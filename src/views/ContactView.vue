<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Hubungi Kami</h1>
      <p class="page-subtitle">Kami siap membantu jika Anda memiliki pertanyaan.</p>
    </div>

    <div class="contact-content">
      <BaseCard padding="lg" class="contact-card">
        <div class="contact-item">
          <span class="contact-icon" aria-hidden="true">📧</span>
          <div>
            <h3>Email</h3>
            <p><a href="mailto:support@lentera.app">support@lentera.app</a></p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon" aria-hidden="true">📞</span>
          <div>
            <h3>Telepon / WhatsApp</h3>
            <p>+62 812-3456-7890</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon" aria-hidden="true">🏢</span>
          <div>
            <h3>Alamat</h3>
            <p>Jl. Pendidikan No. 123<br />Jakarta Selatan, 12345</p>
          </div>
        </div>
      </BaseCard>

      <div class="contact-note">
        <p>Jam Operasional: Senin - Jumat, 09.00 - 17.00 WIB</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 600px; margin: 0 auto; padding: 2rem 1rem 4rem; }
.page-header { margin-bottom: 2rem; text-align: center; }
.page-title { font-size: 1.75rem; font-weight: 800; color: var(--color-text); margin: 0 0 0.5rem; }
.page-subtitle { font-size: 1rem; color: var(--color-muted); margin: 0; }

.contact-content { display: flex; flex-direction: column; gap: 1.5rem; }

.contact-card { display: flex; flex-direction: column; gap: 1.5rem; }

.contact-item { display: flex; align-items: flex-start; gap: 1rem; }
.contact-icon { font-size: 2rem; line-height: 1; }
.contact-item h3 { font-size: 1rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.25rem; }
.contact-item p { font-size: 0.9375rem; color: var(--color-text-2); margin: 0; line-height: 1.5; }
.contact-item a { color: var(--color-primary); text-decoration: none; }
.contact-item a:hover { text-decoration: underline; }

.contact-note { text-align: center; font-size: 0.875rem; color: var(--color-muted); }
.contact-note p { margin: 0; }
</style>

export const BASE_HOST = 'https://dobro.mail.ru';

export const API_URLS = {
  projects: '/api/projects/',
  projectsDoneStats: '/api/projects/done/stats/',
  fundStats: (slug: string) => `/api/funds/${slug}/stats/`,
  mainStats: '/api/main_stats/'
}

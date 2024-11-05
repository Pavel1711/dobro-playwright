import { API_URLS, BASE_HOST } from '../../constants/urls'

export const stats = {
  async getProjects() {
    return await fetch(`${BASE_HOST}${API_URLS.projects}`);
  },
  async getProjectsDoneStats() {
    return await fetch(`${BASE_HOST}${API_URLS.projectsDoneStats}`);
  },
  async getFundStats(slug: string) {
    return await fetch(`${BASE_HOST}${API_URLS.fundStats(slug)}`);
  },
  async getMainStats() {
    return await fetch(`${BASE_HOST}${API_URLS.mainStats}`);
  }
}

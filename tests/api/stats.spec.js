import { expect, test } from '@playwright/test';
import { stats } from '../../framework/services/stats'

test('Проверяем данные проектов', async () => {
  const res = await stats.getProjects();
  const data = await res.json();
  await [
    'object_list',
    'pager',
    'filter_action_name',
    'filter_form',
    'volunteer_events',
    'banners',
    'request',
    'layout',
  ].forEach(item => {
    expect(data).toHaveProperty(item);
  })

  await [
    'query',
    'urgent',
    'type',
    'recipient',
    'child_recipient',
    'city',
    'almost_complete'
  ].forEach(item => {
    if (!['query', 'urgent', 'almost_complete'].includes(item)) {
      expect(data.filter_form.fields[item].items.length).toBeGreaterThan(0)
    }
    expect(data.filter_form.fields).toHaveProperty(item);
  })

  expect(data.object_list.length).toBeGreaterThan(0)
  expect(data.banners.promos_list.length).toBeGreaterThan(0)
  expect(res.status).toEqual(200)
})

test('Проверяем статистику завершенных проектов', async () => {
  const res = await stats.getProjectsDoneStats();
  const data = await res.json();
  [
    'active_reports',
    'all_reports',
  ].forEach(item => {
    expect(data).toHaveProperty(item);
    expect(data[item]).toBeGreaterThan(0)
  })
  expect(res.status).toEqual(200)
})

test('Проверяем информацию для баннера', async () => {
  const res = await stats.getMainStats();
  const data = await res.json();
  [
    'aid',
    'projects',
    'succeed',
    'funds',
    'cities_with_funds',
  ].forEach(item => {
    expect(data).toHaveProperty(item)
    expect(data[item].count).toBeGreaterThan(0);
  })
  expect(res.status).toEqual(200)
})

test('Проверяем статистику фонда "Подсолнух"', async () => {
  const res = await stats.getFundStats('blagotvoritelnyij-fond-pomoschi-detyam-s-narusheniyami-immuniteta-podsolnuh');
  const data = await res.json();
  [
    'created_year',
    'finished_projects_amount',
    'finished_projects_reports_percent',
    'unique_donors_amount',
    'recipients',
  ].forEach(item => {
    expect(data).toHaveProperty(item)
    if (item !== 'recipients') {
      expect(data[item]).toBeGreaterThan(0);
    }
  })

  expect(data.created_year).toBeGreaterThan(0)
  expect(res.status).toEqual(200)
})

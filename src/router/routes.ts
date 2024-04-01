import { RouteRecordRaw } from 'vue-router';
import TabsLayoutVue from 'src/layouts/TabsLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TabsLayoutVue,
    redirect: '/tabs/actions',
    children: [
      {
        path: '',
        redirect: '/tabs/actions'
      },
      {
        path: 'tabs/actions',
        component: () => import('src/pages/HomePage.vue'),
        meta: { title: 'Actions' }
      },
      {
        path: 'tabs/help',
        component: () => import('src/pages/HelpPage.vue'),
        meta: { title: 'Help and Info' }
      }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

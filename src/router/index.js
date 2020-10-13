import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/myClasses',
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/myClasses/:myClassId/edit',
    name: 'MyClassEdit',
    component: () => import('../views/MyClassEdit.vue'),
  },
  {
    path: '/myClasses/:myClassId',
    name: 'MyClass',
    component: () => import('../views/MyClass.vue'),
  },
  {
    path: '/myClasses',
    name: 'MyClasses',
    component: () => import('../views/MyClasses.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

import { Routes } from '@angular/router';

export default [
    {
        path: 'admin-categories-list',
        title: 'Admnistración de categprías',
        loadComponent: () => import('@admin/categories/categories-list/categories-list'),
    },
    {
        path: 'admin-products-list',
        title: 'Administración de productos',
        loadComponent: () => import('@admin/categories/categories-list/categories-list'),
    },
    {
        path: 'admin-user-list',
        title: 'Listado de usuarios',
        loadComponent: () => import('@admin/users/users-list/users-list'),
    },
] as Routes;

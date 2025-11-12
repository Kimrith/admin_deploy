import { Routes } from '@angular/router';
import { Home } from '../Components/home/home/home';
import { Product } from '../Components/product/product';
import { Hommepage } from '../Components/hommepage/hommepage';
import { AddProduct } from '../Components/add-product/add-product';
import { UpdateProduct } from '../Components/update-product/update-product';
import { RemoveProduct } from '../Components/remove-product/remove-product';
import { Register } from '../Components/register/register';
import { Login } from '../Components/login/login';
import { Setting } from '../Components/setting/setting';
import { User } from '../Components/user/user';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Home,
    children: [
      {
        path: 'home',
        component: Hommepage,
      },
      {
        path: 'product',
        component: Product,
      },
      {
        path: 'postProduct',
        component: AddProduct,
      },
      {
        path: 'updateProduct',
        component: UpdateProduct,
      },
      {
        path: 'removeProduct',
        component: RemoveProduct,
      },
      {
        path: 'setting',
        component: Setting,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'user',
        component: User,
      },
    ],
  },
];

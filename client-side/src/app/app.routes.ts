import { Home } from './component/home/home';
import { Login } from './component/login/login';
import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', component: Login },
    { path: 'home', component: Home }
];

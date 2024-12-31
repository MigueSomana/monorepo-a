import { Routes } from '@angular/router';
import { HeroComponent } from './views/hero/hero.component';

export const routes: Routes = [
      //Solo tendra una vista principal, y lo demas seran modals
      {path: '', redirectTo: 'inicio', pathMatch: 'full'},
      {path: 'inicio', component: HeroComponent}
];

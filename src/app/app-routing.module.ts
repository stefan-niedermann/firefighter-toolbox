import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: { title: 'Feuerwehr Toolbox' },
    loadChildren: async () => (await import('./home/home.module')).HomeModule
  },
  {
    path: 'fax',
    data: { title: 'Übungsfax Generator' },
    loadChildren: async () => (await import('./fax/fax.module')).FaxModule
  },
  {
    path: 'erstattung',
    data: { title: 'Antrag auf Erstattung' },
    loadChildren: async () => (await import('./erstattung/erstattung.module')).ErstattungModule
  },
  {
    path: 'about',
    data: { title: 'Über' },
    loadChildren: async () => (await import('./about/about.module')).AboutModule
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

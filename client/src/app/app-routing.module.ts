import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ViewArticleComponent } from './components/view-article/view-article.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { CreateAssignmentComponent } from './components/create-assignment/create-assignment.component';
import { HomeComponent } from './components/home/home.component';
import {AttemptAssignmentComponent} from './../app/components/attempt-assignment/attempt-assignment.component';
import {UserDetailsComponent} from './../app/components/user/user.component'
import {EditUserComponent} from './components/edit-user/edit-user.component';
import { ArticlesComponent } from './components/articles/articles.component';
import {DisplayResultsComponent} from './../app/components/display-results/display-results.component';
import { FilterByTagsComponent } from './components/filter-by-tags/filter-by-tags.component';
import { ViewAssignmentComponent } from './components/view-assignment/view-assignment.component'
import { AssignmentNewComponent } from './components/assignment-new/assignment-new.component';


const routes: Routes = [

  { path: 'editor', component: CodeEditorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user/:id', component: UserDetailsComponent },  
  { path: 'editUser/:id', component: EditUserComponent },
  { path: 'attempt/:user/:id', component: AttemptAssignmentComponent },
  {
    path:"article/new",
    component:CreateArticleComponent
  },
  {
    path:"articles",
    component:ArticlesComponent
  },
  {
    path:"article/:id",
    component:ViewArticleComponent
  },
  {
    path:"searchArticle/:query",
    component: DisplayResultsComponent
  },
  {
    path:"article/tag/:tag",
    component: FilterByTagsComponent
  },
  {
    path:"home",
    component: HomeComponent
  }
  { path: 'editor', component: CodeEditorComponent },
  { path: 'assignment/new', component: AssignmentNewComponent },
  { path: 'assignment/edit/:id', component: CreateAssignmentComponent },
  { path : 'assignment/:userid/:assignmentid', component: ViewAssignmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

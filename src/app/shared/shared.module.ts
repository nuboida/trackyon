import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNameComponent,  BlankPageCardComponent } from './components';
import { BackButtonComponent } from './components/back-button.component';
import { AddButtonComponent } from './components/add-button.component';
import { CreateClientComponent } from './components/create-client.component';
import { CreateClientContactComponent } from './components/create-client-contact.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';



@NgModule({
  declarations: [
    PageNameComponent, BlankPageCardComponent,
    BackButtonComponent, AddButtonComponent,
    CreateClientComponent,
    CreateClientContactComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PageNameComponent,
    BlankPageCardComponent,
    BackButtonComponent,
    AddButtonComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, DashboardComponent, AdminComponent, ShareComponent],
  imports: [HttpClientModule, BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [HttpClient, FormBuilder, BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

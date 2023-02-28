import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, DashboardComponent],
  imports: [HttpClientModule, BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [HttpClient, FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';

const bootstrap = () => bootstrapApplication(AppComponent, {
  ...config,
  providers: [
    importProvidersFrom(ToastrModule.forRoot())
  ],
});

export default bootstrap;

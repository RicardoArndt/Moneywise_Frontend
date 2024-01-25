import { ApplicationConfig, Injectable, LOCALE_ID } from '@angular/core';
import { PreloadAllModules, RouterStateSnapshot, TitleStrategy, provideRouter, withDebugTracing, withPreloading } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Title } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BehaviorSubject, Observable } from 'rxjs';
import { routes } from './app.routes';

registerLocaleData(localePt, 'pt');

@Injectable({
  providedIn: 'root'
})
export class TemplatePageTitleStrategy extends TitleStrategy {
  private title$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private readonly title: Title) { 
    super(); 
  }

  public override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    if (title != undefined) {
      this.title$.next(title);
      this.title.setTitle(`Moneywise - ${title}`);
    }
  }

  public getTitle(): Observable<string> {
    return this.title$;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
      withPreloading(PreloadAllModules),
      withDebugTracing(),
    ),
    TemplatePageTitleStrategy,
    {
      provide: TitleStrategy,
      useExisting: TemplatePageTitleStrategy
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    provideAnimationsAsync()
  ]
};
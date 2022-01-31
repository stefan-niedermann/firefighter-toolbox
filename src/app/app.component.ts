import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>()
  private readonly navigationEnd$ = this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
  readonly icon = this.navigationEnd$.pipe(
    map(e => (e as any).url === '/'),
    map(isHome => isHome ? 'local_fire_department' : 'arrow_back')
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly title: Title
  ) { }

  ngOnInit(): void {
    this.navigationEnd$.pipe(
      takeUntil(this.unsubscribe$),
      map(_ => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap((route) => route.data))
      .subscribe((event) => this.title.setTitle(event.title))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}

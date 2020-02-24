import { Component } from '@angular/core';
import { distinctUntilChanged, timeInterval, tap, concatMap, timeout, catchError, delay, repeat } from 'rxjs/operators';
import { from, fromEvent, of, timer, combineLatest } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

  /**
   * Only emit when the current value is different than the last.
   */
  disUnChange() {
    /** dstinctUntilChanged */
    const data$ = from([1, 1, 2, 2, 2, 3, 3, 3]);
    // const data$ = from([1, 1, 2, 2, 2, 3, 3, 1, 3]);
    data$.pipe(distinctUntilChanged()).subscribe(console.log);
  }

  /**
   * Convert an Observable that emits items into one that emits
   * indications of the amount of time elapsed between those emissions
   */
  timeInt() {
    fromEvent(document, 'click')
      .pipe(
        timeInterval()
      )
      .subscribe(
        i =>
          (document.body.innerHTML = `Seconds since last click: ${i.interval / 1000}`)
      );
  }

  /**
   * Error if no value is emitted before specified duration
   */
  timeOut() {
    of(8000, 4000, 2000)
      .pipe(
        concatMap(duration =>
          this.makeRequest(duration).pipe(
            timeout(2500),
            catchError(error => of(`Request timed out after: ${duration}`))
          )
        )
      )
      .subscribe(val => console.log(val));
  }
  makeRequest(timeToDelay) {
    return of('Request Complete!').pipe(delay(timeToDelay));
  }

  /**
   * Repeats an observable on completion.
   */
  rpt() {
    const delayedThing = of('Test Text').pipe(delay(1000));

    delayedThing
      .pipe(repeat(5))
      .subscribe(console.log);
  }

  /**
   * When any observable emits a value, emit the last emitted value from each
   */
  combineLts() {
    const dataOne$ = from(['1', '2']);
    // timerTwo emits first value at 2s, then once every 4s
    const dataTwo$ = from(['a', 'b', 'c', 'd']);


    // when one timer emits, emit the latest values from each timer as an array
    combineLatest(dataOne$, dataTwo$).subscribe(
      ([valOne, valTwo]) => {
        console.log(
          `Timer One Latest: ${valOne},
     Timer Two Latest: ${valTwo}`
        );
      }
    );
  }
}

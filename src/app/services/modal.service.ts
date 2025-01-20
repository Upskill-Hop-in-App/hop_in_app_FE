import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor() {}
    openModal(): Observable<any> {
        return new Observable((observer) => {
            observer.next();
            observer.complete();
        });
    }
}

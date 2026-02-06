import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MatchService {
  constructor(private socket: Socket, private ngZone: NgZone) { }

  listenForGoals(): Observable<any> {
    // Création d'un Observable manuellement pour écouter 'goal'
    return new Observable(observer => {
      const listener = (data: any) => {
        // Ramener dans la zone Angular pour émettre la donnée
        this.ngZone.run(() => observer.next(data));
      };
      this.socket.ioSocket.on('goal', listener);
      // Fonction de nettoyage en cas de désabonnement
      return () => {
        this.socket.ioSocket.off('goal', listener);
      };
    });
  }

  // ... autres méthodes du service (ex: récupération des infos de match) ...
}

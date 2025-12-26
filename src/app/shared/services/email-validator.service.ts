import { Injectable } from '@angular/core';
import { delay, Observable, Observer, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {

  private emailsCadastrados = ['usuario1@exemplo.com','usuario2@exemplo.com','teste@exemplo.com','admin@exemplo.com','contato@exemplo.com']

  constructor() { }

  verificarEmailExistente(email:string): Observable<boolean>{
    return of(this.emailsCadastrados.includes(email.toLocaleLowerCase())).pipe(delay(1500));
  }
}

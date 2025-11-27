import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

export interface IEstado{
  id:number;
  sigla:string;
  nome:string;
}

export interface ICidade{
  id:number;
  nome:string;
}

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  private readonly API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) { }

  //obs.: httpClient  já retorna em sua estrutura um "Observable"
  //Observable usar metodos assinc
  getEstados(): Observable<IEstado[]>{
    //.pipe(retry(2)) =>  caso ocorra falha tenta 2 vezes
    return this.http.get<IEstado[]>(`${this.API_URL}/estados?orderBy=nome`)
      .pipe(
        retry(2)
      );
  }

  getCidadesPorEstado(uf: string): Observable<ICidade[]>{
    //.pipe(retry(2)) =>  caso ocorra falha tenta 2 vezes
    return this.http.get<ICidade[]>(`${this.API_URL}/estados/${uf}/municipios?orderBy=nome`)
      .pipe(
        retry(2)
      );
  }
}

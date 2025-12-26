import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Habilidade } from '../models/habilidade.interface';
import { Idioma } from '../models/idioma.interface';

interface ICadastroData {
  foto?: string | ArrayBuffer | undefined;
  resumo?: string;
  habilidadesSelecionadas?: Array<Habilidade>;
  idiomas?: Array<Idioma>,
  portfolio?: string,
  linkedin?: string,
  areaAtuacao?: string;
  nivelExperiencia?: string;
  nomeCompleto?: string;
  estado?:string;
  cidade?:string;
  email?:string;
  senha?:string;
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  //trabalhar com reactividade dos componentes
  //toda que a service receber alguma alteração, dessa forma conseguimos garantir que qualquer um que esteja escrito no como "Observable" receba essas alterações!
  private cadastroDataSubject = new BehaviorSubject<ICadastroData>({});

  cadastroData$ = this.cadastroDataSubject.asObservable();

  cadastroDataKey: string = 'cadastroData'

  constructor() { 

    //localStorage = OBTER as alterações
    const savedData = localStorage.getItem(this.cadastroDataKey);

    if(savedData){
      //disparar para o Observable
      //DESERIALIZAR
      this.cadastroDataSubject.next(JSON.parse(savedData));
    }

  }


  updateCadastroData(data: Partial<ICadastroData>): void {
    //informação local
    const currentData = this.cadastroDataSubject.value;
    //verifica se há diferença o que está em memória=[currentData] com o valor que está chegando via parametro=[data] 
    //gera um novo objeto atualizado
    const updateData ={...currentData, ...data};
    //dispara a informação para todos que está inscritos neste "Observable = this.cadastroDataSubject"
    this.cadastroDataSubject.next(updateData);

    //SERRIALIZAR JSON - NO LOCALSTORAGE
    localStorage.setItem(this.cadastroDataKey, JSON.stringify(updateData));
  }

  getCadastroData() : ICadastroData {
    return this.cadastroDataSubject.value;
  }
}

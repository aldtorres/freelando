import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';
import { BehaviorSubject, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { IbgeService, ICidade, IEstado } from '../../shared/services/ibge.service';

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})
export class DadosPessoaisFormComponent implements OnInit {
  dadosPessoaisForm!: FormGroup;

  //uso de $ indica que é um observable
  estado$!: Observable<IEstado[]>;
  cidades$!: Observable<ICidade[]>;

  //toda vez que o estado sor selecionado ou alterado
  carregandoCidades$ = new BehaviorSubject<boolean>(false);


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService : CadastroService,
    private ibgeService: IbgeService
  ){
    
  }

  ngOnInit(): void {
    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required],
    });

    this.carregarEstados();
    this.configurarListernerEstado();
  }
 
  private carregarEstados(): void {
    this.estado$ = this.ibgeService.getEstados();
  }

  private configurarListernerEstado(): void {
    const estadoControl = this.dadosPessoaisForm.get('estado');
    
    if(estadoControl){
      this.cidades$ = estadoControl.valueChanges.pipe(
        startWith(''), //inicia
        tap(() => {
          this.resetarCidade();
          this.carregandoCidades$.next(true)//INDICAR QUE HOUVE ALTERAÇÃO
        }),//operação que não retorna nada + incremeta chamada de funções
        switchMap(uf => {
          if(uf){
            return this.ibgeService.getCidadesPorEstado(uf)
            .pipe(
              tap(() => this.carregandoCidades$.next(false))//indica que não houve alteração
            )
          }
          
          this.carregandoCidades$.next(false)//indica que não houve alteração
          return of([])
        })
      )
    }
  }

  private resetarCidade() {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }
 

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if(this.dadosPessoaisForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    }else{
      //forçar como se usuário tivesse tocado no formulario!
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  salvarDadosAtuais() {
    const formValue = this.dadosPessoaisForm.value;
    
    this.cadastroService.updateCadastroData({
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha,
    });
  }

}

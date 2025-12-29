import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';
import { BehaviorSubject, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { IbgeService, ICidade, IEstado } from '../../shared/services/ibge.service';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { emailExistenteValidator } from '../../shared/validators/emailExistente.validator';
import { EmailValidatorService } from '../../shared/services/email-validator.service';
import { FormConfig } from '../../shared/models/form-config.interface';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';
import { getDadosPessoaisConfig } from '../../config/dados-pesssoais-form.confg';
import { FormFieldBase } from '../../shared/models/form-field-base.interface';

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
  formConfig!: FormConfig;

  //uso de $ indica que é um observable
  estado$!: Observable<IEstado[]>;
  cidades$!: Observable<ICidade[]>;

  //toda vez que o estado sor selecionado ou alterado
  carregandoCidades$ = new BehaviorSubject<boolean>(false);


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService : CadastroService,
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService,
    private dynamicFormService: DynamicFormService
  ){
    //registra o form dentro da service
    this.dynamicFormService.registerFormConfig('dadosPessoaisForm', getDadosPessoaisConfig);
  }

  ngOnInit(): void {
    //nome do form
    this.formConfig = this.dynamicFormService.getFormConfig('dadosPessoaisForm');


    this.dadosPessoaisForm = this.dynamicFormService.createFormGroup(
      //this.formConfig, { validators: senhasIguaisValidator }
      this.formConfig, {  }
    )
    // this.dadosPessoaisForm = this.fb.group({
    //   nomeCompleto: ['', Validators.required],
    //   cpf:['', [Validators.required, cpfValidator]],
    //   estado: ['', Validators.required],
    //   cidade: ['', Validators.required],
    //   //email: ['', [Validators.required, Validators.email]],
    //   email: ['', [Validators.required, Validators.email],[emailExistenteValidator(this.emailService)]],
    //   senha: ['', [Validators.required, Validators.minLength(6)]],
    //   confirmaSenha: ['', Validators.required],
    // });

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
    console.log('oii');
    if(this.dadosPessoaisForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/perfil']);
    }else{
      //forçar como se usuário tivesse tocado no formulario!
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  isFieldType(field: FormFieldBase, type: string  ): boolean {
    return field.type === type;
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

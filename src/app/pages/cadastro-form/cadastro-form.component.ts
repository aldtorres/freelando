import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioOptionComponent } from "../../shared/components/radio-option/radio-option.component";
import { ExperienceLevelComponent } from "../../shared/components/experience-level/experience-level.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';

const MODULES = [
  CommonModule,
  ReactiveFormsModule
];

@Component({
  selector: 'app-cadastro-form',
  standalone: true,
  imports: [
    ...MODULES,
    RadioOptionComponent,
    ExperienceLevelComponent,
    ButtonComponent
],
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss']
})
export class CadastroFormComponent implements OnInit {

  //atenção este é o pivo tanto no *.HTML  quanto no *.TS
  //também usando *.HTML => [formGroup]="cadastroForm" e  [disabled]="cadastroForm.invalid"
  cadastroForm!: FormGroup;

  areasAtuacao = [
    { id: 'ti', value: 'ti', label: 'TI e Programação' },
    { id: 'design', value: 'design', label: 'Design e Multimídia' },
    { id: 'revisao', value: 'revisao', label: 'Revisão' },
    { id: 'traducao', value: 'traducao', label: 'Tradução' },
    { id: 'transcricao', value: 'transcricao', label: 'Transcrição' },
    { id: 'marketing', value: 'marketing', label: 'Marketing' }
  ];

  niveisExperiencia = [
    {
      id: 'iniciante',
      label: 'Iniciante',
      description: '(1 a 3 anos)'
    },
    {
      id: 'intermediario',
      label: 'Intermediário',
      description: '(3 a 6 anos)'
    },
    {
      id: 'avancado',
      label: 'Avançado',
      description: '(6 anos ou mais)'
    }
  ];


  constructor(
    private fb: FormBuilder,
    private route: Router,
    private cadastroService: CadastroService
  ){

  }

  ngOnInit(): void {

    //procurar [areasAtuacao e niveisExperiencia] em =>> src/app/pages/cadastro-form/cadastro-form.component.html
    this.cadastroForm = this.fb.group({
      areasAtuacao: ['', Validators.required ], //ref.00.atu - inicial com string vazia
      niveisExperiencia: ['', Validators.required] //ref.01.niv
    });

  }

  onAreaChange(area: string) {
    this.cadastroForm.get('areasAtuacao')?.setValue(area);//ref.00.atu
  }

  onNivelChange(nivel: string) {
    this.cadastroForm.get('niveisExperiencia')?.setValue(nivel);//ref.01.niv    
  }

  onAnterior() {
    console.log('Voltar')
  }

  onProximo() {
    if(this.cadastroForm.valid){
      console.log('OK')
      //salvar os dados para utilizar no redirecionamento
      this.cadastroService.updateCadastroData({
        areaAtuacao: this.cadastroForm.get('areaAtuacao')?.value, //ref.00.atu 
        nivelExperiencia: this.cadastroForm.get('nivelExperiencia')?.value //ref.01.niv
      });

      //redirecionar
      this.route.navigate(['/cadastro/dados-pessoais'])
    }else{
      console.log('nOK')
    }
  }



}

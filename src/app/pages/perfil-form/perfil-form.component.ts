
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habilidade } from '../../shared/models/habilidade.interface';
import { CadastroService } from '../../shared/services/cadastro.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit {
  perfilForm!: FormGroup;
  fotoPreview!: string | ArrayBuffer | null;

  habilidades: Habilidade[] = [
    { nome: 'Fullstack', selecionada: false },
    { nome: 'Front-end', selecionada: false },
    { nome: 'React', selecionada: false },
    { nome: 'Angular', selecionada: false }
  ];

  niveisIdioma: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo'
  ];

  idiomas: string[] = [
    'Português',
    'Inglês',
    'Espanhol'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ){

  }

  ngOnInit() :void {
    this.incializarForm();
  }  

  private incializarForm(): void {
    this.perfilForm = this.fb.group({
      foto: [''],
      resumo: [''],
      habilidadesSelecionadas:[[]],
      idiomas: this.fb.array([]),
      portfolio:[''],
      linkedin:['']
    });
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/dados-pessoais']);
  }

  onProximo(): void {
    if(this.perfilForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    }
  }

  private salvarDadosAtuais(): void {
    const formValue = this.perfilForm.value;

    this.cadastroService.updateCadastroData({
      foto: this.fotoPreview,
      resumo: formValue.resumo,
      habilidadesSelecionadas: formValue.habilidadesSelecionadas,
      idiomas: [],
      portfolio: formValue.portfolio,
      linkedin: formValue.linkedin
    });
  }

  onFotoSelecionada(event: any): void {
    const file = event.target.file[0];
    if (file){
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.perfilForm.patchValue({foto: reader.result});
        reader.readAsDataURL(file);
      }
    }
  }
  
}

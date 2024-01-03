import { 
  AfterViewInit, 
  Component, 
  QueryList,
  ViewChildren, 
  WritableSignal, 
  signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ModalComponent } from '../../../commons/modal/modal.component';
import { InputComponent } from '../../../commons/input/input.component';
import { ModalBodyDirective } from '../../../commons/modal/directives/modal-body.directive';
import { ButtonComponent } from '../../../commons/button/button.component';
import { Button } from '../../../commons/button/models/button';
import { CustomerFormComponent } from './customer-form.component';
import { ProductFormComponent } from "./product-form-component";
import { PaymentFormComponent } from './payment-form.component';
import { SalesService } from '../services/sales.service';
import { ModalService } from '../../../commons/modal/services/modal.service';
import { FormService } from '../../../commons/services/form.service';
import { ISaleForm } from '../models/sale-form';
import { IFormComponent } from '../../../commons/forms/models/form';

@Component({
  selector: 'moneywise-app-sale-creation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    RouterModule,
    ModalBodyDirective,
    ButtonComponent,
    CustomerFormComponent,
    ProductFormComponent,
    PaymentFormComponent
  ],
  providers: [
    FormService
  ],
  template: `
    <moneywise-app-modal>
      <ng-container ngProjectAs="modal-header">
        Nova venda
      </ng-container>

      <ng-template moneywiseAppModalBody>
        <div class="navigator-content">
          <nav class="navigator-content__navigator">
            <ul>
              @for (form of forms(); track form) {
                <li>
                  <a 
                    class="navigator-content__link"
                    [ngClass]="{'navigator-content__link--active': isFormActive(form.name)}"
                    (click)="navigateTo(form.name)">
                    {{ form.title }}
                  </a>
                </li>
              }
            </ul>
          </nav>

          <div class="navigator-content__content">
            <div class="navigator-content__content--scrollable">
              <moneywise-app-customer-form #form [hidden]="!isFormActive(forms()[0]?.name ?? '')" />
              <moneywise-app-product-form #form [hidden]="!isFormActive(forms()[1]?.name ?? '')" />
              <moneywise-app-payment-form #form [hidden]="!isFormActive(forms()[2]?.name ?? '')" />
            </div>
          </div>
        </div>
      </ng-template>

      <ng-container ngProjectAs="modal-footer">
        <moneywise-app-button left [button]="previousButton" />

        @if (!isFormActive(forms()[forms().length - 1]?.name ?? '')) {
          <moneywise-app-button right [button]="nextButton" />
        }

        @if (isFormActive(forms()[forms().length - 1]?.name ?? '')) {
          <moneywise-app-button right [button]="confirmButton" />
        }
      </ng-container>
    </moneywise-app-modal>
  `,
})
export class SaleCreationModalComponent implements AfterViewInit {
  public previousButton: Button = new Button(this.previousForm.bind(this), 'Anterior');
  public nextButton: Button = new Button(this.nextForm.bind(this), 'Próximo');

  public confirmButton: Button = new Button(this.onSave.bind(this), 'Salvar');

  public forms: WritableSignal<ISaleForm[]> = signal([]);

  @ViewChildren('form')
  private formsComponents!: QueryList<IFormComponent>;

  public get hasErrors(): boolean {
    return this.formsComponents.some(form => form.formGroup.invalid);
  }

  private get activeFormName(): string {
    return this.activatedRoute.snapshot.queryParams['form'];
  }

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly salesService: SalesService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly router: Router
  ) { }
  
  public ngAfterViewInit(): void {
    const formsItems = this.formsComponents?.map(form => {
      return {
        name: form.name,
        title: form.title,
        form: form
      }
    });

    this.forms.update(_ => formsItems);
  }

  public isFormActive(formName: string) {
    if (!this.activeFormName) {
      return formName == 'customer';
    }

    return this.activeFormName == formName;
  }

  public async onSave() {
    this.formService.submit();
    
    if (!this.currentFormHasError()) {
      this.navigateToCloserWithError();
    }
    
    if (this.hasErrors) {
      return;
    }

    for (const form of this.formsComponents.filter(f => !f.isEdit)) {
      await form.onSave();
    }

    for (const form of this.formsComponents.filter(f => f.isEdit)) {
      await form.onEdit();
    }

    await firstValueFrom(this.salesService.updateOrCreate());

    this.modalService.close();
  }

  public previousForm() {
    for (const form of this.forms()) {
      const indexForm = this.forms().indexOf(form);
      const activeForm = this.isFormActive(form.name);
      const hasPrevious = indexForm > 0; 

      if (activeForm && hasPrevious) {
        this.navigateTo(this.forms()[indexForm - 1].name);
        continue;
      }
    }
  }

  public nextForm() {
    for (const form of this.forms()) {
      const indexForm = this.forms().indexOf(form);
      const activeForm = this.isFormActive(form.name);
      const hasNext = indexForm < (this.forms().length - 1);

      if (activeForm && hasNext) {
        this.navigateTo(this.forms()[indexForm + 1].name);
        continue;
      }
    }
  }

  public navigateTo(form: string) {
    this.router.navigate(
      [], 
      { 
        relativeTo: this.activatedRoute, 
        queryParams: 
        { 
          form 
        } 
      });
  }

  private currentFormHasError() {
    return this.forms().find(f => f.name == this.activeFormName)?.form.formGroup.invalid;
  }

  private navigateToCloserWithError() {
    for (const form of this.forms()) {
      if (this.formHasError(form.name)) {
        this.navigateTo(form.name);
        continue;
      }
    }
  }

  private formHasError(formName: string) {
    return this.forms().find(f => f.name == formName)?.form.formGroup.invalid;
  }
}

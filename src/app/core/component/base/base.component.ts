import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from './../../service/loading.service';
import { OnDestroy, Directive, Component } from '@angular/core';
import { SETTING } from '@app/core/config/setting.config';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SharedModule } from '@app/core/module/share.module';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [SharedModule, LoadingComponent],
  templateUrl: './base.component.html',
})
export class BaseComponent implements OnDestroy {
  protected subscriptions: Subscription[] = [];
  protected form: FormGroup;

  constructor(protected messageService: MessageService, protected loadingService: LoadingService, protected fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  /**
   * Add Subscription to manage cleanup in ngOnDestroy
   * @param sub Subscription instance
   */
  addSubscription(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  showLoading() {
    this.loadingService.show();
  }

  hideLoading() {
    this.loadingService.hide();
  }

  /**
   * Handle errors globally
   * @param error Error object from API or system
   */
  handleError(error: any) {
    this.hideLoading();
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || SETTING.MSG.ERROR,
    });
  }

  /**
   * Debug logging utility
   * @param args Data to log
   */
  log(...args: any[]) {
    console.log('🛠️ Debug:', ...args);
  }

  /**
   * Cleanup subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

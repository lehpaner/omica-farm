import { Component, ChangeDetectorRef, OnInit, Input, AfterViewInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { Router } from '@angular/router';
import { slideInDownAnimation } from '../../app.animations';
import { SyncQuestionariService } from '../services/admin.sync.service';
import { RestResponse } from '../../model';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'qs-processor-item',
  styleUrls: ['./processor-item.component.scss'],
  templateUrl: './processor-item.component.html'
})

export class ProcessorItemComponent implements AfterViewInit {

    @Input()
    set data(proc: any) {
        let stat: string = proc['status']['runStatus'];
        this.running = (stat === 'Running');
        this.processor = proc;
    }
    processor: any;
    result: any;
    stopped: boolean = false;
    running: boolean = false;

    constructor(private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private _flowService: SyncQuestionariService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        public media: TdMediaService) {
        }

    ngAfterViewInit(): void {
    }

    start(id: string): void {
        this.changeProcessorState('RUNNING').then(() => {
            console.log('Processor set to run');
        });
    }

    stop(id: string): void {
        this.changeProcessorState('STOPPED').then(() => {
            console.log('Processor set to stop');
        });
    }

    clear(id: string): void {
        console.log('Processor called clear');
    }

    async changeProcessorState(state: string) {
        let response: RestResponse = null;
        try {
            this._loadingService.register('p.state');
            response = await this._flowService.changeProcessorState(this.processor['id'], '0', state).toPromise();
        } catch (error) {
            console.log(`An error has occured : ${error}`);
            this._dialogService.openAlert({title: 'Recupero flusso non riuscito', message: 'Errore di sistema', closeButton: 'CHIUDI' });
        } finally {
            this._loadingService.resolve('p.state');
            if (response.errorID < 0) {
                this._dialogService.openAlert({title: 'Cambio stato fallito', message: response.message, closeButton: 'CHIUDI' });
            }
            this.processor = response.dato;
        }
    }

}
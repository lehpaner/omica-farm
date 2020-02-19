import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AreasServiceProxy, AreaDto , AreaDtoSoilType } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditAreaModalComponent } from './create-or-edit-area-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './areas.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AreasComponent extends AppComponentBase {

    @ViewChild('createOrEditAreaModal') createOrEditAreaModal: CreateOrEditAreaModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxSizeFilter : number;
		maxSizeFilterEmpty : number;
		minSizeFilter : number;
		minSizeFilterEmpty : number;
    cadastralIdFilter = '';
    soilTypeFilter = -1;
        farmNameFilter = '';

    soilType = AreaDtoSoilType;



    constructor(
        injector: Injector,
        private _areasServiceProxy: AreasServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getAreas(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._areasServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.maxSizeFilter == null ? this.maxSizeFilterEmpty: this.maxSizeFilter,
            this.minSizeFilter == null ? this.minSizeFilterEmpty: this.minSizeFilter,
            this.cadastralIdFilter,
            this.soilTypeFilter,
            this.farmNameFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createArea(): void {
        this.createOrEditAreaModal.show();
    }

    deleteArea(area: AreaDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._areasServiceProxy.delete(area.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._areasServiceProxy.getAreasToExcel(
        this.filterText,
            this.nameFilter,
            this.maxSizeFilter == null ? this.maxSizeFilterEmpty: this.maxSizeFilter,
            this.minSizeFilter == null ? this.minSizeFilterEmpty: this.minSizeFilter,
            this.cadastralIdFilter,
            this.soilTypeFilter,
            this.farmNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}

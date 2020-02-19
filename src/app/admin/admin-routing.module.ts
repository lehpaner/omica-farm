import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MonitoringStationData_1sComponent } from './ofarmdata/monitoringStationData_1s/monitoringStationData_1s.component';
import { MonitorinigStationTypesComponent } from './ofarm/monitorinigStationTypes/monitorinigStationTypes.component';
import { SensorMappingsComponent } from './ofarm/sensorMappings/sensorMappings.component';
import { SensorsComponent } from './ofarm/sensors/sensors.component';
import { MonitoringStationsComponent } from './ofarm/monitoringStations/monitoringStations.component';
import { AreasComponent } from './ofarm/areas/areas.component';
import { FarmsComponent } from './ofarm/farms/farms.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'ofarmdata/monitoringStationData_1s', component: MonitoringStationData_1sComponent, data: { permission: 'Pages.Administration.MonitoringStationData_1s' }  },
                    { path: 'ofarm/monitorinigStationTypes', component: MonitorinigStationTypesComponent, data: { permission: 'Pages.Administration.MonitorinigStationTypes' }  },
                    { path: 'ofarm/sensorMappings', component: SensorMappingsComponent, data: { permission: 'Pages.Administration.SensorMappings' }  },
                    { path: 'ofarm/sensors', component: SensorsComponent, data: { permission: 'Pages.Administration.Sensors' }  },
                    { path: 'ofarm/monitoringStations', component: MonitoringStationsComponent, data: { permission: 'Pages.Administration.MonitoringStations' }  },
                    { path: 'ofarm/areas', component: AreasComponent, data: { permission: 'Pages.Administration.Areas' }  },
                    { path: 'ofarm/farms', component: FarmsComponent, data: { permission: 'Pages.Administration.Farms' } },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },
                    { path: 'install', component: InstallComponent },
                    { path: 'ui-customization', component: UiCustomizationComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}

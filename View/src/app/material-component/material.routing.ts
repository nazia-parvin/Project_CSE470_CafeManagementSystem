import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGaurdService } from '../services/route-gaurd.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';



export const MaterialRoutes: Routes = [
    {
        path:'category',
        component:ManageCategoryComponent,
        canActivate:[RouteGaurdService],
        data:{
            expectedRole:['admin']
        }
    }
];

import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGaurdService } from '../services/route-gaurd.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';



export const MaterialRoutes: Routes = [
    {
        path:'category',
        component:ManageCategoryComponent,
        canActivate:[RouteGaurdService],
        data:{
            expectedRole:['admin']
        }
    },
    {
        path:'product',
        component:ManageProductComponent,
        canActivate:[RouteGaurdService],
        data:{
            expectedRole:['admin']
        }
    },
    {
        path:'order',
        component:ManageOrderComponent,
        canActivate:[RouteGaurdService],
        data:{
            expectedRole:['admin','user']
        }
    }
];

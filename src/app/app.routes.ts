import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VinylStickerComponent } from './vinyl-sticker/vinyl-sticker.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'vinyl-sticker', component: VinylStickerComponent },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VinylStickerComponent } from './vinyl-sticker/vinyl-sticker.component';
import { ReadyMadeLeinwandbilderComponent } from './ready-made-leinwandbilder/ready-made-leinwandbilder.component';
import { ReadyMadeAcrylglasbilderComponent } from './ready-made-acrylglasbilder/ready-made-acrylglasbilder.component';
import { WarenkorbComponent } from './warenkorb/warenkorb.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'vinyl-sticker', component: VinylStickerComponent },
    { path: 'ready-made-leinwandbilder', component: ReadyMadeLeinwandbilderComponent },
    { path: 'ready-made-acrylglasbilder', component: ReadyMadeAcrylglasbilderComponent },
    { path: 'warenkorb', component: WarenkorbComponent },
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbLayoutModule, NbCardModule, NbActionsModule, NbIconModule, NbToggleModule } from '@nebular/theme';

import { EditorComponent } from './editor.component';
import {BlocklyCardComponent} from './components/blockly-card/blockly-card.component';
import {DetailsComponent} from './components/info-card/details.component';

const NB_MODULES = [
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbIconModule,
  NbToggleModule,
];
@NgModule({
  declarations: [
    BlocklyCardComponent,
    EditorComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ...NB_MODULES,
  ]
})
export class EditorModule { }

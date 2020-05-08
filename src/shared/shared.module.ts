import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CircleLoadComponent } from 'src/shared/LoadingBar/circle-load/circle-load.component';
import { DotJumpComponent } from './LoadingBar/dot-jump/dot-jump.component';

@NgModule({
declarations: [CircleLoadComponent, DotJumpComponent],
imports: [CommonModule],
exports: [ReactiveFormsModule, FormsModule, CommonModule, CircleLoadComponent, DotJumpComponent]
})

export class SharedModule{

}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CircleLoadComponent } from 'src/shared/LoadingBar/circle-load/circle-load.component';

@NgModule({
declarations: [CircleLoadComponent],
exports: [ReactiveFormsModule, FormsModule, CommonModule, CircleLoadComponent]
})

export class SharedModule{

}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CircleLoadComponent } from 'src/shared/LoadingBar/circle-load/circle-load.component';
import { DotJumpComponent } from './LoadingBar/dot-jump/dot-jump.component';
import { FooterComponent } from './footer/footer.component';
import { PiechartComponent } from './graphs/piechart/piechart.component';
import { HighchartsChartModule } from 'highcharts-angular'

@NgModule({
declarations: [CircleLoadComponent, DotJumpComponent, FooterComponent, PiechartComponent],
imports: [CommonModule, HighchartsChartModule],
exports: [ReactiveFormsModule, FormsModule, CommonModule, CircleLoadComponent, DotJumpComponent, FooterComponent, PiechartComponent]
})

export class SharedModule{

}

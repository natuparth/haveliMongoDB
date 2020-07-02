import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../../../../../canvasjs.min';
// import * as CanvasJS from './canvasjs.min';
@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit, OnChanges{
  public pieChartLabels:string[] = ['Chrome', 'Safari', 'Firefox','Internet Explorer','Other'];
  public pieChartData:number[] = [40, 20, 20 , 10,10];
  public pieChartType:string = 'doughnut';
  @ViewChild('mainScreen', {static:true}) elementView: ElementRef;
  @Input() graphDataList: any[];
  @Input() graphDataColumns: any[]; //expected data =>['colname','values'];  string list with columns name
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.graphDataList = changes.graphDataList.currentValue;
    //this.graphDataColumns = changes.graphDataColumns.currentValue;
    this.ngOnInit();
  }
  ngOnInit() {
    let dataPoints = [];
  let y = 0;
  
  if(this.graphDataList == null){
    for ( var i = 0; i < 10; i++ ) {		  
      y += Math.round(5 + Math.random() * (-5 - 5));	
      dataPoints.push({ y: y,label1: this.pieChartLabels[(i+1)%5]});
    }
  }
  else{
    for ( var i = 0; i < this.graphDataList.length; i++ ) {
      dataPoints.push({ y     : this.graphDataList[i][this.graphDataColumns[1]],
                        label1: this.graphDataList[i][this.graphDataColumns[0]],
                        exploded: i==0});
    }
  }
	
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",      
      // title:{
      //   text: this.Categories,
      //   horizontalAlign: "center",
      //   verticalAlign:"center"
      // },
      legend:{
        horizontalAlign: "right",
        verticalAlign: "center"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        // innerRadius: 20,
        indexLabelFontSize: 17,
        showInLegend: true,
        legendText: "{label1}",
        // indexLabelPlacement: 'outside',
        // indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label1}:</b> {y} (#percent%)",
        // dataPoints: [
        //   { y: 67, label: "Inbox" },
        //   { y: 28, label: "Archives" },
        //   { y: 10, label: "Labels" },
        //   { y: 7, label: "Drafts"},
        //   { y: 15, label: "Trash"},
        //   { y: 6, label: "Spam"}
        // ]
        dataPoints : dataPoints
      }]
    });
    chart.render();
  }

}

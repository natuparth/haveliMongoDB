import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  @Input() graphDataList: any[] = [];   // expected in format { name:'header name you want',data:'data yo want to display' }
  @Input() graphDataLabel: any[] = [];  // expected in format ["LabelName","LabelValue"] for eg: ["Name","Total Expense"]
  chartOptions = {};
  Highcharts =  Highcharts;
  dataPoints = [];
  dataLabels = [];
  pointFormat: String = "";
  displayGraphFlag: boolean = false;
  
  constructor() { }

  ngOnInit() {
    let dataLength = this.graphDataList.length;
    
    if(dataLength){
      for ( let i = 0; i < dataLength; i++ ) {
        this.dataPoints.push({ y : this.graphDataList[i].data, name : this.graphDataList[i].name});
      }
      // console.log(this.dataPoints);
      let dataLabelsLength = this.graphDataLabel.length;
      if(dataLabelsLength){
        this.dataLabels = this.graphDataLabel;
      }
      else{
        this.dataLabels = ["Country","Area"]
      }
      this.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>'
                        +this.dataLabels[1]+' <b>{point.y}</b><br/>'
      // console.log("asda",this.graphDataLabel,this.dataLabels,this.pointFormat);
      this.displayGraphFlag = true;
      this.defaultChartData();
    }
    else{
      this.displayGraphFlag = false;
    }
  }

  defaultChartData(){
    this.chartOptions = {
      chart: {
          type: 'pie'
      },
      title: {
          text: 'Countries compared by population density and total area.'
      },
      tooltip: {
          headerFormat: '',
          pointFormat: this.pointFormat
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}'
            }
        }
      },
      credits : { enabled: false},
      // export : { enabled : true}, not required for now as we dontneed to export the data in any format
      series: [{
          minPointSize: 10,
          innerSize: '80%',
          zMin: 0,
          name: 'countries',
          data: this.dataPoints
      }]
    };
  }

}

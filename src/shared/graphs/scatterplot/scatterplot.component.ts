import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.css']
})
export class ScatterplotComponent implements OnInit {

  chartOptions = {};
  Highcharts =  Highcharts;
  displayGraphFlag: boolean = true;
  @Input() graphDataList: any[] = [];   //expected in format [{ name:'header',data:'[[x,y],[x,y],[x,y]]' }
  @Input() graphDataLabel: any[] = [];  // expected in format ["Graph Title","X-Label","Y-Label"] for eg: ["Expense By Date","Date Of Purchase","Amount"]
  dataPoints = [];
  dataLabels = [];
  pointFormat: String = "";
  constructor() { }

  ngOnInit() {
    let dataLength = this.graphDataList.length;
    if(dataLength){
        this.dataPoints = this.graphDataList;
        this.dataLabels = this.graphDataLabel;
        this.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>'
                        +this.dataLabels[1]+' <b>{point.x:%e. %b %Y}</b><br/>'
                        +this.dataLabels[2]+' <b>{point.y}</b><br/>'
        this.displayGraphFlag = true;
        this.defaultChartData();
    }
    
    
  }

  defaultChartData(){
    this.chartOptions = {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: this.dataLabels[0]
        },
        // subtitle: {
        //     text: 'Source: Heinz  2003'
        // },
        credits : { enabled: false},
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b %Y',
            year: '%Y'
          },
          title: {
              enabled: true,
              text: this.dataLabels[1]
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
            title: {
                text: this.dataLabels[2]
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',//'<b>{series.name}</b><br>',
                    pointFormat: this.pointFormat//'{point.x:%e. %b %Y}, {point.y} kg'
                }
            }
        },
        series: this.dataPoints
        // [{
        //     name: 'Female',
        //     // color: 'rgba(223, 83, 83, .9)',
        //     data: [[Date.UTC(1970, 9, 15), 0],
        //     [Date.UTC(1970, 9, 31), 9],
        //     [Date.UTC(1970, 10,  7), 7],
        //     [Date.UTC(1970, 10, 10), 1]]
        //     // [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
        //     //     [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
        //     //     [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
        //     //     [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]
    
        // }, {
        //     name: 'Male',
        //     // color: 'rgba(119, 152, 191, .5)',
        //     data: [[Date.UTC(1971, 0, 25), 4],
        //     [Date.UTC(1971, 0, 28), 3],
        //     [Date.UTC(1971, 0, 31), 4],
        //     [Date.UTC(1971, 1,  4), 4],
        //     [Date.UTC(1971, 1,  7), 9],
        //     [Date.UTC(1971, 1, 10), 3],]
        //     // [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
        //     //     [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
        //     //     [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
        //     //     [180.3, 83.2], [180.3, 83.2]]
        // }]
    
    }
  }

}

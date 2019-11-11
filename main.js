'use strict';

const JSONFileName = 'assets/sample_data.json';

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
            console.log('mamin');
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.highlight(e);
                }
            }
        }
    );
});


/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}

// Get the data. The contents of the data file can be viewed at
Highcharts.ajax({
    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    //'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    //'https://raw.githubusercontent.com/sharmimathur/dsc106-hw3/master/assets/sample_data.json',
    dataType: 'text',
    success: function (activity) {

        console.log('initialize');
        activity = JSON.parse(activity);
        console.log(activity);

        console.log(activity.id);
        console.log(activity.datasets);
        //TODO: try for loop to see how to access the data
        
        activity.datasets.forEach(function (dataset, i) {

            // Add X values
            // TODO: change how to get the xvalues
            // something about dataset.data here and below, see what the og code meant and where it got it from
            // dataset.data = Highcharts.map(dataset.data, function (val, j) {
            //     return [dataset.start[j], val];
            // });

            //so this one returns [x, y]
            dataset.data = Highcharts.map(dataset.data, function (val, j) {
                return [activity.xData[j], val];
            });

            console.log("creation");
            var chartDiv = document.createElement('div');
            chartDiv.className = 'chart';
            document.getElementById('container').appendChild(chartDiv);


            Highcharts.chart(chartDiv, {
                chart: {
                    marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    type : 'datetime',
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        enabled: true
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                plotOptions: {
                    series: {
                        // TODO: CHANGE W NEW DATA
                        pointStart: Date.UTC(2010, 5, 3),
                        pointInterval: 24 * 3600 * 1000 // one day
                    }
                },
                tooltip: {
                    positioner: function () {
                        return {
                            // right aligned
                            x: this.chart.chartWidth - this.label.width,
                            y: 10 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px'
                    },
                    valueDecimals: dataset.valueDecimals
                },
                series: [{
                    // change these values to match sample data, specificlaly start and last
                    data: dataset.data,
                    name: dataset.id,
                    type: dataset.type,
                    color: Highcharts.getOptions().colors[i],
                    fillOpacity: 0.3,
                    // TODO: with springfield data, use the units options
                    // tooltip: {
                    //     valueSuffix: ' ' + dataset.units
                    // }
                }]
            });
        });
    }
});





let sharedConfig = {
  layout: "1x1",
  graphset : [
    {
      // config for the energy stacked area graph
      type: 'area',
      title: {
        text: 'Generation MW',
        fontSize: 18,
      },
      "crosshair-x":{
        shared: true
      },
      plot: {
        tooltip:{
          visible: true
        },
        aspect: "spline",
        stacked: true
      },
      plotarea: {
        margin: "dynamic"
      },
      "scale-x": {
          "min-value": 0,
          "step": "30minute",
          "transform": {
              "type": "date",
              "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
          },
          "item": {
              "font-size": 9
          }
      },
      "utc": true,
      "timezone": 0,
      'scale-y': {
          values: "0:80:10",
          format: "%v",
          guide: {
            'line-style': "dotted"
          }
        },
      series: []
    }    //,
    // {
    //   // config for the price line graph
    //   type: "line",
    //   title: {
    //     text: 'Price $/MWh',
    //     fontSize: 18,
    //   },
    //   "crosshair-x":{
    //     shared: true
    //   },
    //   plot: {
    //     tooltip:{
    //       visible: false
    //     }
    //   },
    //   plotarea: {
    //   },
    //   "scale-x": {
    //       "min-value": 1571579700000,
    //       "step": "30minute",
    //       "transform": {
    //           "type": "date",
    //           "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
    //       },
    //       "item": {
    //           "font-size": 9
    //       }
    //   },
    //   "utc": true,
    //   "timezone": 0,
    //   'scale-y': {
    //     values: "0:30",
    //     format: "%v",
    //     guide: {
    //       'line-style': "dotted"
    //     }
    //   },
    //   series: []
    // },
    // {
    //   // config for the temperature line graph
    //   type: "line",
    //   title: {
    //     text: 'Temperature degreesF',
    //     fontSize: 18,
    //   },
    //   "crosshair-x":{
    //     shared: true
    //   },
    //   plot: {
    //     tooltip:{
    //       visible: false
    //     }
    //   },
    //   plotarea: {
    //   },
    //   "scale-x": {
    //       "min-value": 1571579700000,
    //       "step": "30minute",
    //       "transform": {
    //           "type": "date",
    //           "all": "%m/%d/%Y<br>%h:%i:%s:%q %A"
    //       },
    //       "item": {
    //           "font-size": 9
    //       }
    //   },
    //   "utc": true,
    //   "timezone": 0,
    //   'scale-y': {
    //     values: "0:80:20",
    //     format: "%v",
    //     guide: {
    //       'line-style': "dotted"
    //     }
    //   },
    //   series: []
    // }
  ]
}

console.log("hi");
// let pieConfig = {
//   type: "pie",
//   plot: {
//       valueBox: {
//           text: '%t\n%npv%'
//       }
//   },
//   title: {
//       text: 'Energy Breakup'
//   },
//   plotarea: {
//       margin: "0 0 0 0"
//   },
//   series: []
// };

// // global data-structure to hold the energy breakup
// var globalEnergyData = {
//   keys: [],
//   values: []
// };

// // function to do deep-copy on the global data structure
// function updateGlobalEnergyData(data) {
//   globalEnergyData['values'] = [];
//   for (var idx = 0; idx < data[0]['values'].length; idx ++) {
//     var energyBreakup = data.map(elm => {return elm['values'][idx]});
//     globalEnergyData['values'].push(energyBreakup);
//   }
//   globalEnergyData['keys'] = data.map(elm => elm['text']);
// }

// // this method reacts only onmouseover on any of the nodes in the shared graphs
// function onMouseoverChart(e) {
//   if (e['target'] === 'node') {
//     var nodeSplit = e['targetid'].split('-');
//     var nodeId = nodeSplit[nodeSplit.length - 1];
//     if (Number.isInteger(parseInt(nodeId)) && parseInt(nodeId) < globalEnergyData['values'].length) {
//       renderPieChart(parseInt(nodeId));
//     }
//   } 
// }

// // the nodeId is basically the x-axis value
// // the actual breakup is retrieved from the global data-structure
// function renderPieChart(nodeId) {
//   var pieDataSet = globalEnergyData['keys'].map(function(elm, idx) {
//     return {
//       text: elm.split('.')[elm.split('.').length - 1],
//       values: [globalEnergyData['values'][nodeId][idx]]
//     }
//   });
//   // console.log(pieDataSet);
//   zingchart.exec('pieGrid', 'setseriesdata', {
//     data : pieDataSet
//   });
// }

// this function is responsible for plotting the energy on
// successfully loading the JSON data
// It also plots the pie chart for nodeId=0
// function onSuccessCb(jsonData) {
//     var energyData = jsonData.filter(function(elm) {
//         return elm['type'] === 'energy';
//     }).map(function(elm) {
//         return {
//           values: elm['data'],
//           text: elm['id']
//         };
//     });
//     updateGlobalEnergyData(energyData);
//     var priceData = jsonData.filter(function(elm) {
//         return elm['type'] === 'price';
//     }).map(function(elm) {
//         return {
//           values: elm['data'],
//           text: elm['id']
//         };
//     });
//     var tempData = jsonData.filter(function(elm) {
//         return elm['type'] === 'temperature';
//     }).map(function(elm) {
//         return {
//           values: elm['data'],
//           text: elm['id']
//         };
//     });
//     zingchart.exec('sharedGrid', 'setseriesdata', {
//       graphid: 0,
//       data : energyData
//     });
//     zingchart.exec('sharedGrid', 'setseriesdata', {
//       graphid: 1,
//       data : priceData
//     });
//     zingchart.exec('sharedGrid', 'setseriesdata', {
//       graphid: 2,
//       data : tempData
//     });
//     renderPieChart(0);
// }

// // Utility function to fetch any file from the server
// function fetchJSONFile(filePath, callbackFunc) {
//     console.debug("Fetching file:", filePath);
//     var httpRequest = new XMLHttpRequest();
//     httpRequest.onreadystatechange = function() {
//         if (httpRequest.readyState === 4) {
//             if (httpRequest.status === 200 || httpRequest.status === 0) {
//                 console.info("Loaded file:", filePath);
//                 var data = JSON.parse(httpRequest.responseText);
//                 console.debug("Data parsed into valid JSON!");
//                 console.debug(data);
//                 if (callbackFunc) callbackFunc(data);
//             } else {
//                 console.error("Error while fetching file", filePath, 
//                     "with error:", httpRequest.statusText);
//             }
//         }
//     };
//     httpRequest.open('GET', filePath);
//     httpRequest.send();
// }


// The entrypoint of the script execution
function doMain() {
    // zingchart.render({
    //     id: 'sharedGrid',
    //     data: sharedConfig
    // });
    // zingchart.render({
    //     id: 'pieGrid',
    //     data: pieConfig 
    // });
    // zingchart.bind('sharedGrid', 'mouseover', onMouseoverChart);
    fetchJSONFile('assets/sample_data.json', onSuccessCb);
}

//document.onload = doMain();
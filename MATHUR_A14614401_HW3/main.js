'use strict';

const JSONFileName = 'assets/sample_data.json';
var globalEnergyData = {};
var prices = [];
var pie = true;

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
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

                //OPTIONS
                //could get x, access the dataset, and use that for the series
                // access through tooltips?
                //

                if (point) {
                    point.highlight(e);
                

                
                    if (i == 1) {
                        var pieData = []
                        powers.forEach(function(dataset, i) {
                            pieData.push({
                                'name': dataset.name,
                                'x': dataset.data[point.index][0],
                                'y': dataset.data[point.index][1],
                                'color': dataset.color,
                                'fuel_tech': dataset.fuel_tech,
                                'price': prices[point.index]
                            });
                        });
                        plotPie(pieData);
                    }

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

var powers = []

// Get the data. The contents of the data file can be viewed at
Highcharts.ajax({
    url: 'https://raw.githubusercontent.com/sharmimathur/dsc106-hw3/master/MATHUR_A14614401_HW3/assets/springfield.json',
    //'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    //'https://raw.githubusercontent.com/sharmimathur/dsc106-hw3/master/assets/sample_data.json',
    //'https://raw.githubusercontent.com/sharmimathur/dsc106-hw3/master/assets/springfield.json',
    dataType: 'text',
    success: function (activity) {

        var activity = JSON.parse(activity);

        activity.forEach(function (dataset, i) {
            if (dataset.type == 'power') {
                powers.push(dataset);
            }
        });

        powers.forEach(function (dataset, i) {
            if (dataset.fuel_tech == 'wind') {
                dataset.name = 'Wind';
                dataset.color = '#008129';
            }
            if (dataset.fuel_tech == 'hydro') {
                dataset.name = 'Hydro';
                dataset.color = '#0561AD';
            }
            if (dataset.fuel_tech == 'gas_ccgt') {
                dataset.name = 'Gas (CCGT)';
                dataset.color = '#FF9136';
            }
            if (dataset.fuel_tech == 'distillate') {
                dataset.name = 'Distillate';
                dataset.color = '#FF0000';
            }
            if (dataset.fuel_tech == 'black_coal') {
                dataset.name = 'Black Coal';
                dataset.color = '#000000';
            }
            if (dataset.fuel_tech == 'exports') {
                dataset.name = 'Exports';
                dataset.color = '#f5e1f7';
            }
            if (dataset.fuel_tech == 'pumps') {
                dataset.name = 'Pumps';
                dataset.color = '#94cef2';
            }

        });

        var times = [];
        for (var j = powers[0].history.start; j < powers[0].history.last; j+=(5 * 60)) {
            times.push(new Date(j * 1000));
        }
        
        for (var j = 0; j < powers.length; j++) {
            var dataset = powers[j];
            dataset.data = Highcharts.map(dataset.history.data, function (val, j) {
                return [times[j], val];
            });
        }
          

        var power_ser = [];
        // change color here, assign each one a color specific to their thing
        for (var i = powers.length - 1; i >= 0; i--) {
            power_ser.push({
                'data': powers[i].data,
                'name': powers[i].name,
                'type': 'area',
                'color': powers[i].color,
                'fillOpacity': 1,});
        }

        //TODO: try for loop to see how to access the data
        var chartDiv = document.createElement('div');
        chartDiv.className = 'chart';
        document.getElementById('container').appendChild(chartDiv);

        var pieDiv = document.createElement('div');
        pieDiv.className = 'chart';
        document.getElementById('pieGrid').appendChild(pieDiv);


        activity.forEach(function (dataset, i) {
            
            if (dataset.id == 'Springfield.price') {
                dataset.step = true;
            } else {
                dataset.step = false;
            }

            if (dataset.type != 'power') {
            // Add X values
            // TODO: change how to get the xvalues
            // something about dataset.data here and below, see what the og code meant and where it got it from
            // dataset.data = Highcharts.map(dataset.data, function (val, j) {
            //     return [dataset.start[j], val];
            // });

            var times = [];

            for (var j = dataset.history.start; j < dataset.history.last; j+=(5 * 60)) {
                times.push(new Date(j * 1000));
            }

            //so this one returns [x, y]
            dataset.data = Highcharts.map(dataset.history.data, function (val, j) {
                return [times[j], val];
            });

            // gets prices
            if (dataset.type == 'price') {
                prices = Highcharts.map(dataset.history.data, function (val, j) {
                    return val;
                });
            }
            

            var chartDiv = document.createElement('div');
            chartDiv.className = 'chart';
            document.getElementById('container').appendChild(chartDiv);


            Highcharts.chart(chartDiv, {
                chart: {
                    marginLeft: 10, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                    backgroundColor: '#ece9e6',
                    height: 250
                },
                title: {
                    text: dataset.type + ' (' + dataset.units + ')',
                    align: 'left',
                    margin: 0,
                    x: 30,
                    style: {
                        color: '#000',
                        fontFamily: 'Georgia, serif'
                    }
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type : 'datetime',
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        enabled: false
                    }
                },
                legend: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        fillOpacity: 100
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
                    pointFormat: '{point.y} ' + dataset.units,
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontFamily: 'Georgia',
                        fontSize: '18px'
                    },
                    valueDecimals: dataset.valueDecimals,
                    
                },
                series: [{
                    // change these values to match sample data, specificlaly start and last
                    data: dataset.data,
                    name: dataset.name,
                    step: dataset.step,
                    type: 'line',
                    color: 'red',
                    fillOpacity: 1,
                    // TODO: with springfield data, use the units options
                    // tooltip: {
                    //     valueSuffix: ' ' + dataset.units
                    // }
                }]
            });
        }
        });

        Highcharts.chart(chartDiv, {
            chart: {
                type: 'area',
                marginLeft: 10, // Keep all charts left aligned
                spacingTop: 20,
                spacingBottom: 20,
                backgroundColor: '#ece9e6',
                height: 250
            },
            title: {
                text: 'generation (MW)',
                align: 'left',
                margin: 0,
                x: 30,
                style: {
                    color: '#000',
                    fontFamily: 'Georgia, serif',
                }
            },
            credits: {
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
            legend: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineWidth: 0,
                    marker: {
                        lineWidth: 2,
                        lineColor: '#666666'
                    },
                    enableMouseTracking: true
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
                formatter: function() {
                    var tooltipData = [
                                    {color: '#FF0000'},
                                    {color: '#008129'},
                                    {color: '#FFF300'},
                                    {color: '#0561AD'},
                                    {color: '#FF9136'},
                                    {color: '#FF00D1'},
                                    {color: '#000000'}
                                ];
                    //points.length
                    for (var j = powers.length; j<5;j++){
                        tooltipData[j].y = this.powers[j].y;
                    }

                    //this.x
                    return new Date(5);
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                split: true
            },
            
            series: power_ser
        });

        var pieData = []
        powers.forEach(function(dataset, i) {
            pieData.push({
                'name': dataset.name,
                'x': dataset.data[0][0],
                'y':  dataset.data[0][1],
                'color': dataset.color,
                'fuel_tech': dataset.fuel_tech,
                'price': prices[0]
            }
               );
        });

        plotPie(pieData);

    }
});


function plotPie(dataset) {
    var demand = 0;
    var cats = []
    for (var i = 0; i < dataset.length; i++) {
        demand += dataset[i].y;
    }

    var use_data = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].fuel_tech != 'exports' && dataset[i].fuel_tech != 'pumps') {
            use_data.push(dataset[i]);
            cats.push(dataset[i].name);
        }
    }
    console.log(cats)

    demand = (Math.round(demand));
    

    // plot the powers
    
    if (pie){
        Highcharts.chart('pieGrid', {
            chart: {
                renderTo: 'pieGrid',
                type: 'pie',
                backgroundColor: '#ece9e6'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                pie: {
                    innerSize: '50%',
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                },
                area: {
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },
                series: {
                    animation: false
                }
            },
            title: {
                text: formatNumber(demand) + ' MW',
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    color: '#000',
                    style: 'bold',
                    fontFamily: 'Georgia, sans-serif',
                    fontSize: 20
                }
            },            
        
            series: [{
                colorByPoint: true,
                data: use_data
            }]        
        }, function (chart) { // on complete
    
            chart.renderer.button('Bar', 0, 250)
                .attr({
                    zIndex: 3
                })
                
                .on('click', function () {
                    pie = false;
                    plotPie(dataset);
                }).add();
            }
        );
    } else {

        var use_data_bar = [];
        for (var i = 0; i < use_data.length; i++) {
            use_data_bar.push({
                'name': use_data[i].name,
                'y': (use_data[i].y / demand) * 100,
                'color': use_data[i].color,
                'fuel_tech': use_data[i].fuel_tech,
                'price': use_data[i].price
            });
        }

        Highcharts.chart('pieGrid', {
            chart: {
                renderTo: 'pieGrid',
                type: 'bar',
                backgroundColor: '#ece9e6'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },
                series: {
                    animation: false,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },
            title: {
                text: '',
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    color: '#000',
                    style: 'bold',
                    fontFamily: 'Georgia, sans-serif',
                    fontSize: 20
                }
            },
            xAxis: {
                categories: cats
            },
            yAxis: {
                title: false,
                visible: false
            },
            legend: {
                enabled: false
            },
            series: [{
                colorByPoint: true,
                data: use_data_bar
            }]        
        }, function (chart) { // on complete    
            chart.renderer.button('Pie', 0, 250)
                .attr({
                    zIndex: 3
                })
                .on('click', function () {
                    pie = true;
                    plotPie(dataset);
                }).add();
            }
        );

    }

    // Date on top of legend

    var p = document.createElement('p');
    p.innerHTML = '' + Highcharts.time.dateFormat('%d %b, %I:%M %p', dataset[0].x);
    
    var node = document.getElementById('date');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);

    // Power
    var load = 0;
    dataset.forEach(function(subset, i) {

        var power_html = 0;
        if (subset.fuel_tech == 'distillate') {
            power_html = subset.y;
        } else {
            power_html = subset.y;
            if (power_html > 0) {
                power_html = formatNumber(Math.round(subset.y));
            } else if (power_html == 0) {
                power_html = '-';
            } else {
                power_html = formatNumber(subset.y);
            }
            
        }

        if (subset.fuel_tech == 'exports' || subset.fuel_tech == 'pumps') {
            if (power_html == '-') {
                load += 0;
            } else {
                load += parseInt(power_html);
            }
        }

        var p = document.createElement('p');
        p.innerHTML = '' + power_html;
        var node = document.getElementById('power_' + subset.fuel_tech);
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.appendChild(p);
    });

    var p = document.createElement('p');
    p.innerHTML = '' + formatNumber(demand);
    var node = document.getElementById('power_source');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);


    var p = document.createElement('p');
    if (load == 0) {
        load = '-';
    }
    p.innerHTML = load;
    var node = document.getElementById('power_loads');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);

    var p = document.createElement('p');
    if (load == '-') {
        load = 0;
    }
    p.innerHTML = formatNumber(parseInt(load) + parseInt(demand));
    var node = document.getElementById('power_net');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);



    // Contributions

    var contr_renew = 0;

    dataset.forEach(function(subset, i) {
        var power_html = 0;
        power_html = (subset.y / demand) * 100;

        if (subset.fuel_tech == 'wind' || subset.fuel_tech == 'hydro') {
            contr_renew += power_html;
        }

        if (power_html > 0) {
            if (power_html >= 1) {
                power_html = power_html.toFixed(1) + '%';
            } else {
                power_html = power_html.toFixed(4) + '%';
            }
        } else if (power_html == 0) {
            power_html = '-';
        } else {
            power_html = power_html.toFixed(2) + '%';
        }

            
        var p = document.createElement('p');
        p.innerHTML = '' + power_html;
        var node = document.getElementById('contr_' + subset.fuel_tech);
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.appendChild(p);
    });


    if (contr_renew > 0) {
        if (contr_renew >= 1) {
            contr_renew = contr_renew.toFixed(1) + '%';
        } else {
            contr_renew = contr_renew.toFixed(4) + '%';
        }
    } else if (contr_renew == 0) {
        contr_renew = '-';
    } else {
        contr_renew = contr_renew.toFixed(2) + '%';
    }

    var p = document.createElement('p');
    p.innerHTML = '' + contr_renew;
    var node = document.getElementById('contr_renew');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);

    // Average Value
    var p = document.createElement('p');
    p.innerHTML = '$' + dataset[0].price + '.00';
    var node = document.getElementById('av_source');
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    node.appendChild(p);

    dataset.forEach(function(subset, i) {

        var power_html = '-';
            
        var p = document.createElement('p');
        p.innerHTML = '' + power_html;
        var node = document.getElementById('av_' + subset.fuel_tech);
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.appendChild(p);
    });

    


};

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
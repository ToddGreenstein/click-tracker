/**
 * Created by todd on 2/16/15.
 */
var ops = 0;
var even=0;
var status = "";
var init = false;
var plot2;
//var line1 =[]; //
//var line2=  [['Nissan', 4],['Porche', 6],['Acura', 2],['Aston Martin', 5],['Rolls Royce', 6]];

function initialize() {
    if (init)return;
    $("input.switch").bootstrapSwitch({
                                          onText: 'run',
                                          offText: 'stop',
                                          size: 'small',
                                          state: (status == "running") ? false : true
                                      });
    $("input.switch").on('switchChange.bootstrapSwitch', function (event, state) {
        if (!state) {
            $.post("/api/profiler/status/start", function (data) {
                //$("#state").html(data.run);
            });
        } else {
            $.post("/api/profiler/status/stop", function (data) {
                //$("#state").html(data.stop);
            });
        }
    });
    init = true;
    return;
}

function pollState() {
    $.get('/api/profiler/analytics/light/ops', function (lw) {
        if (lw) {
            $("#ops").html(lw.getLightweight);
            ops = lw.getLightweight;
        }
    });
    $.get('/api/profiler/status', function (lw) {
        if (lw) {
            $("#state").html(lw.status);
            status = lw.status;
            initialize();
        }
    });
}

$(document).ready(function () {
    setInterval(function () {
        pollState()
    }, 400);

    //refresh time (in millisec)
    var t = 500;
    //samples to draw
    var n = 20;
    var x = (new Date()).getTime(); // current time
    //buffer of n samples
    var data = [];
    for (i = 0; i < n; i++) {
        data.push([x - (n - 1 - i) * t, 0]);
    }

    var options = {

        axesDefaults: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer
        },
        axes: {
            xaxis:{
                numberTicks: 5,
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                        formatString: '%H:%M:%S',
                        fontFamily: 'Helvetica',
                        fontSize: '8pt',
                        fontWeight: 'bold',
                        textColor: '#0000000',
                        angle: 60
                },
                min: data[0][0],
                //max : data[19][0]
                max: data[data.length - 1][0]
            },
            yaxis: {min: 0}
        }
        ,
        seriesDefaults: {
            rendererOptions: {smooth: true}
        }
    };

    var plot1 = $.jqplot('myChart', [data], options);

    function doUpdate() {

        if (data.length > n - 1) {
            data.shift();
        }

        var y = ops;
        var x = (new Date()).getTime();

        data.push([x, y]);
        if (plot1) {
            plot1.destroy();
        }
        plot1.series[0].data = data;

        options.axes.xaxis.min = data[0][0];
        options.axes.xaxis.max = data[data.length - 1][0];
        plot1 = $.jqplot('myChart', [data], options);
        setTimeout(doUpdate, t);
    }

    doUpdate();

    $("#selAnalytics").change(function () {
        var line1=[];
        if(plot2) {
            plot2.destroy();
        }
        $.get('/api/profiler/analytics/light/'+$("#selAnalytics").val()
        , function (lw) {
            if (lw) {
                var IN_DATA=lw.getLightweight;
                $.each(IN_DATA, function (k, v) {
                    var kv=[v.key, v.value];
                    line1.push(kv);
                });
                var option={
                    title:'Analytics: [' + $("#selAnalytics").val() + ']',
                    seriesDefaults:{
                        renderer:$.jqplot.BarRenderer,
                        rendererOptions: {
                            varyBarColor: false
                        }
                    },
                    axesDefaults: {
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer
                    },
                    axes:{
                        xaxis:{
                            renderer: $.jqplot.CategoryAxisRenderer,
                            tickOptions: {
                                fontFamily: 'Helvetica',
                                fontSize: '10pt',
                                fontWeight: 'bold',
                                textColor: '#0000000',
                                angle: 25
                            }
                        }
                    }
                }
                plot2 = $.jqplot('barchart',[line1],option);
            }
        });
    });
});





// ---------------------------------------------------
// Fetch real data
// ---------------------------------------------------

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

var select_width = jQuery("#decenniumtimeline").width();
var w = select_width; //start dimensions

fetcher = d3.select("#alldecennia").property("value");
var data = JSON.parse(fetcher);

// fill in the gaps (decennia that have no score must be zero)
var keyz = Object.keys( data ).map(function ( key ) { return key; });
var keyzmin = Math.min.apply( null, keyz );
var keyzmax = Math.max.apply( null, keyz );
var fullrange = range(keyzmin -10, keyzmax + 20, 10);
for (var key in fullrange) {
    data[fullrange[key.toString()]] = data[fullrange[key.toString()]] ? data[fullrange[key.toString()]] : 0;
}

drawTimeline("Decennium timeline", data, "#decenniumtimeline", "", w, 600, false);

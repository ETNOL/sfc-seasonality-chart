var exampleData;
var publicSpreadsheetUrl = '19CZ5G2wgg3xN7RXMRYB8yT1gabzqoNrLwO6Mi3JeSGI';

function dataInit() {
    Tabletop.init( { 
        key: publicSpreadsheetUrl,
        callback: showInfo,
        simpleSheet: true
    })
}

function showInfo(data, tabletop) {
    exampleData = data;
    init(data);
}

var months = [
    'January',
    'Feburary',
    'March', 
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

var regionMap = [
    {
        name: 'Arctic',
        fillKey: 'Arctic',
        radius: 55,
        latitude: 58.07,
        longitude: 193.43
    },
    {
        name: 'Asia-Pacific',
        fillKey: 'Asia-Pacific',
        radius: 55,
        latitude: 38.07,
        longitude: 153.43
    }

];

var regionFills = {
    'Arctic': '#7f7f7f',
    'Asia-Pacific': '#4f4f4f',
    defaultFill: '#EDDC4E'
}

function init () {
    populateMonths(months);
    populateSpecies(exampleData);    
}

function populateSpecies (dataSet) {
    dataSet.forEach(function (fish) {
        $('.species').append(
           $('<button>')
            .text(fish.Product)
            .addClass(fish.Product.replace(' ', ''))
        );
    });
}

function populateMonths (dataSet) {
    dataSet.forEach(function (month) {
        $('.months').append(
           $('<button>')
            .text(month)
            .addClass(month)
        );
    });
}



var map = new Datamap({
    element: document.getElementById('container'),
    fills: {
        HIGH: '#afafaf',
        LOW: '#123456',
        MEDIUM: 'blue',
        UNKNOWN: 'rgb(0,0,0)',
        defaultFill: 'green'
    },
    data: {},
    scope: 'world',
     fills: regionFills,
     data: {
        'Arctic': {fillKey: 'Arctic'},
        'Asia-Pacific': {fillKey: 'Asia-Pacific'}
    },
    geographyConfig: {
        highlightOnHover: false
    }
});        

var regions;
$(document).on('click', '.months button', function (e) {
    var month = $(e.currentTarget).text();
    var inSeason = exampleData.filter(function (fish) {
        return fish[month] == 'G';
    });

    var partialSeason = exampleData.filter(function (fish) {
        return fish[month] == 'Y';
    });
    
    clearSeasonIndications();

    map.bubbles([]);
    regions = [];

    inSeason.map(function (fish) {
       regions = regionMap.filter(function (region) { return region.name == fish.Region});
        $('.' + fish.Product.replace(' ', '')).addClass('in-season');
    });

    partialSeason.map(function (fish) {
        partialRegions = regionMap.filter(function (region) { return region.name == fish.Region});
        regions = regions.concat(partialRegions);
        $('.' + fish.Product.replace(' ', '')).addClass('partial-season');
    });

    map.bubbles(regions, function() {});
});

function getMonthsByRating(fish, rating) {
    return Object.keys(fish).filter(function (month) {
        return fish[month] == rating;
    });
}

function clearSeasonIndications () {
    $('.in-season, .partial-season')
        .removeClass('in-season')
        .removeClass('partial-season');
}

function mapSeasons(targets, klass) {
    targets.map(function(target) {
        $('.' + target).addClass(klass);
    });
}


$(document).on('click', '.species button', function (e) {
    var species = $(e.target).text();
    var fish = exampleData.filter(function (fish) {
        return fish.Product == species;
    })[0];

    var inSeason = getMonthsByRating(fish, 'G'); 
    var partialSeason = getMonthsByRating(fish, 'Y'); 

    clearSeasonIndications();    

    mapSeasons(inSeason, 'in-season');
    mapSeasons(partialSeason, 'partial-season');

    map.bubbles([]);
    regions = [];

    regions = regionMap.filter(function (region) { return region.name == fish.Region});
    $('.' + fish.Product.replace(' ', '')).addClass('in-season');

    map.bubbles(regions, function() {});
})


dataInit();
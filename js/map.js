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

var exampleData = [
    {
        species: 'Tuna',
        region: 'Asia-Pacific',
        january: 0,
        feburary: 0,
        march: 1,
        april: 1,
        may: 1,
        june: 2,
        july: 2,
        august: 1,
        september: 1,
        october: 0,
        november: 0,
        december: 0 
    },
    {
        species: 'Arctic Char',
        region: 'Arctic',
        january: 1,
        feburary: 2,
        march: 2,
        april: 1,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 1,
        october: 1,
        november: 2,
        december: 2 
    }
]

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
            .text(fish.species)
            .addClass(fish.species.replace(' ', ''))
        );
    });
}

function populateMonths (dataSet) {
    dataSet.forEach(function (month) {
        $('.months').append(
           $('<button>')
            .text(month)
            .addClass(month.toLowerCase())
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
    var month = $(e.currentTarget).text().toLowerCase();
    var inSeason = exampleData.filter(function (fish) {
        return fish[month] == 2;
    });

    var partialSeason = exampleData.filter(function (fish) {
        return fish[month] == 1;
    });
    
    clearSeasonIndications();

    map.bubbles([]);
    regions = [];

    inSeason.map(function (fish) {
       regions = regionMap.filter(function (region) { return region.name == fish.region});
        $('.' + fish.species.replace(' ', '')).addClass('in-season');
    });

    partialSeason.map(function (fish) {
        partialRegions = regionMap.filter(function (region) { return region.name == fish.region});
        regions = regions.concat(partialRegions);
        $('.' + fish.species.replace(' ', '')).addClass('partial-season');
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
        return fish.species == species;
    })[0];

    var inSeason = getMonthsByRating(fish, 2); 
    var partialSeason = getMonthsByRating(fish, 1); 

    clearSeasonIndications();    

    mapSeasons(inSeason, 'in-season');
    mapSeasons(partialSeason, 'partial-season');

    map.bubbles([]);
    regions = [];

    regions = regionMap.filter(function (region) { return region.name == fish.region});
    $('.' + fish.species.replace(' ', '')).addClass('in-season');

    map.bubbles(regions, function() {});
})


init();
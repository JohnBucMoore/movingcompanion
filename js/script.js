
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();

    $body.append('<img class="bgimg" src="'+getImage(street, city)+'">');

    var newsDeskFilters = document.getElementsByName('news-desk');
    var selectedNewsDeskFiltersString = getSelectedFilters(newsDeskFilters).join(' ');
    var apiKey = 'VfSX2GagalbwS9BtjlKqO6q0g4YEtA1Y';

    getNYTArticles(street, city, $nytElem);

    getWikiArticles(city, $wikiElem);

    return false;
};

function getImage(street, city) {
    var endpoint = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&key=AIzaSyAh6GfSdla4C-HjauirqWBivcfbJbs873M&location=';
    if (street.length > 0 && city.length > 0) {
        endpoint += street + ' , ' + city;
    }
    return endpoint;
}

var submit = document.getElementById('submit-btn');
function makeHTMLFilter(arr) {
    arr.forEach((element) => {
        var filter = element.toLowerCase().split(" & ").join('-');
        var checkbox = `<input type="checkbox" name="news-desk" id="${filter}" value="${element}"><label for="${filter}">${element}</label>`;
        submit.insertAdjacentHTML('beforebegin', checkbox);
    });
}
var newsDesk = ["Arts & Leisure", "Arts", "Business", "Culture", "Dining", "Education", "Entrepreneurs", "Fashion & Style", "Fashion", "Financial", "Food", "Health & Fitness", "Movies", "Museums", "Science", "Sports", "Technology", "Wealth"];
makeHTMLFilter(newsDesk);

var newsDeskFilters = document.getElementsByName('news-desk');
newsDeskFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
        filter.toggleAttribute('checked');
        console.log(filter.getAttribute('value'));
    });
});

function getSelectedFilters(arr) {
    var selected = [];
    arr.forEach(function(element) {
        if (element.checked) {
            selected.append(element.value);
        }
    });
    return selected;
}

function getNYTArticles(street, city, element) {
/**
    var oReq = new XMLHttpRequest;
    oReq.open("GET", `https://www.google.com/search?q=${street}, ${city}`);
    oReq.send();
    console.log(oReq.responseType);
    console.log(oReq.responseText);
    console.log(oReq.responseURL);
    console.log(oReq.responseXML);

    var gURL = `https://www.google.com/search?q=${street}, ${city}`;
    var gURL = 'https://www.google.com/search?q=11%20Wall%20St,%20New%20York,%20NY';
  
    var newsDeskFilters = document.getElementsByName('news-desk');
    console.log(getSelectedFilters(newsDeskFilters).join(" "));
    var query = `&fq=news_desk:(${getSelectedFilters(newsDeskFilters).join(" ")}) AND glocations:(${city})`;
    console.log(query);
**/
    var nytURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${street}, ${city}&api-key=VfSX2GagalbwS9BtjlKqO6q0g4YEtA1Y`;
    $.getJSON( nytURL, function( data ) {
      var articles = data.response.docs; //paginated array-like object of article objects, length 10
      $.each(articles, function(key, article) {
        var url = article.web_url;
        var hl = article.headline.main;
        var text = article.lead_paragraph;
        var li = `<li class="article">
                    <a href="${url}">${hl}</a>
                    <p>${text}</p>
                  </li>`;
        element.append(li);
      });
    }).error(function(e) {
        element.text('New York Times Articles Could Not Be Loaded.');
    });
}

function getWikiArticles(city, element) {
    var wikiurl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${city}&format=json&callback=?`;
    var wikiRequestTimeout = setTimeout(function() {
        element.text('failed to get wikipedia resources');
    }, 8000);
    $.ajax({
        url: wikiurl,
        dataType: 'jsonp',
        success: function(data) {
            console.log(wikiurl);
            console.log(data);
            for (let i = 0; i < data[3].length; i++) {
                var link = data[3][i];
                var title = data[1][i];
                var summary = data[2][i];
                console.log(link, title, summary);
                if (data[2][i] === 'undefined') {
                    element.append(`<li><a href=${link}>${title}</a></li>`);
                } else {
                    element.append(`<li><a href=${link}>${title}</a><p>${summary}</p></li>`);
                }
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
}

$('#form-container').submit(loadData);

// loadData();



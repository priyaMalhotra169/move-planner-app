(function(){
   "use strict"; 
   
    var $formContainer = $('#form-container');
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var nytimesArticles = $('#nytimes-articles');

    function loadData(e) {
        e.preventDefault();
        

        // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");

        // load streetview

        var streetStr = $('#street').val();
        var cityStr = $('#city').val();
        var address = streetStr + ' , ' + cityStr;

        $greeting.text('so, you want to live at ' + address + ' ? ');

        // https://maps.googleapis.com/maps/api/streetview?size=600x400&location=46.414382,10.013988&heading=151.78&pitch=4-0.76

        var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address
         + '&heading=151.78&pitch=-0.76' + '&key=AIzaSyDiMV9RzBNq7ujs6OOPnNc3PATykOveVFg';
        $body.prepend('<img class="bgimg" src="' + streetviewUrl + '">');



        // load NYtimes

            

          var NYtimes__url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
            NYtimes__url += '?' + $.param({
              'api-key': "c871b0c6ae7a410e8d6e3f4ccaae0c90",
               'q': address
            });

            $.ajax({
                  url: NYtimes__url,
                  method: 'GET',
                  dataType: 'json'
            }).done(function(data) {
                // console.log(data);

                $nytHeaderElem.text('Articles from New York Times for "' + address + '"');
                var articles = data.response.docs;
                for(var i = 0; i < articles.length; i++) {
                    var article = articles[i];
                    nytimesArticles.append('<li class="articles col-xs-12">' + 
                    '<a href="'+article.web_Url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet + '</p>' + '</li>');
                };

            }).fail(function(err) {
                  console.log(err);
                  $nytHeaderElem.text('Sorry.. No Articles Found from New york times');
            });


         /*$.getJSON(nytimesUrl, function(data){
            console.log(data);
            
         })*/


        // load wikipwedia............


        // var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format="json"&titles="' + cityStr + '"';

        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json';

        wikiUrl += '&' + $.param({
          'search': cityStr
        });
        console.log(wikiUrl);

        $.ajax({
            url: wikiUrl,
            dataType:"jsonp",
            success: function(response) {
                console.log(response);
                var articleList = response[1];

                for(var i = 0; i < articleList.length; i++) {
                    var articleStr = articleList[i];
                    var url = response[3][i];
                    $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
                };
            }
        });

        return false;
    };

    // attaching event handler `loadData` function for submit event
    $formContainer.submit(loadData);

    // triggering submit even on document ready on the defaults mentioned in the html
    $formContainer.submit();

})();

var topics = ["cat", "emu", "cyndaquil", "pangolin"];
var query;
var queryURL;
var queryOffset = 0;
var clear = true;


function generateQueryURL(query) {
  queryURL = "https://api.giphy.com/v1/gifs/search?api_key=f9fZThTyAb4xSqkNecynK35yoCO32NlM&limit=10" + 
  "&q=" + query +
  "&offset=" + queryOffset;
  
  return queryURL;
}

function generateButtons() {
  $('#topic-buttons').empty();
  for (var i = 0; i < topics.length; i++) {
    var newButton = $('<button class="btn btn-secondary topic-btn px-4">');
    newButton.text(topics[i]);
    $('#topic-buttons').append(newButton);
  }
}

$(document).ready(function () {

  // Declare function that does the AJAX call and displays 10 gifs on the page
  function getTenGifs() {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var results = response.data;

      // If prompted to clear the existing gifs, empty the #gifs div
      if (clear) {
        $('#gifs').empty();
      }

      for (var i = 0; i < results.length; i++) {
        // Create a div to house the gif and rating
        var gifDiv = $('<div class="gif">');
    
        // create an image to hold the gif and all its data, including still/animated states
        var gif = $('<img data-state="still">');
        gif.attr('src', results[i].images.fixed_height_still.url);
        gif.attr('data-state', "still");
        gif.attr('data-still', results[i].images.fixed_height_still.url)
        gif.attr('data-animate', results[i].images.fixed_height.url)
    
        // Create a paragraph with the gif's rating
        var rating = $('<p class="rating">').text("Rating: " + results[i].rating);
    
        // Append the gif and rating to the gifDiv
        gifDiv.append(rating, gif);
    
        // Append the gifDiv to the div on the page
        $('#gifs').append(gifDiv);
      }
    })
  }

  // Generate buttons for the existing items in the topics array
  generateButtons();

  // Hide the "more" button on page load
  // $('#more-gifs').hide();

  $("#new-topic").on("click", function(event) {
    // Prevents the page from reloading on form submit
    event.preventDefault();

    // If a value is entered, add the inputted topic to the array and then generate the buttons again
    if ($('#add-topic').val()) {
      topics.push($('#add-topic').val().trim());
      $('#add-topic').val("");
      generateButtons();
    }
  });

  // When an topic button is clicked, generate the queryURL and push 10 gifs of that topic to the DOM
  $('#topic-buttons').on('click', '.topic-btn', function() {

    // show the more button
    $('#moar').removeClass('d-none');

    // Use the button text as the query
    query = $(this).text();

    // reset any query offset
    queryOffset = 0;

    // Generate the query URL
    queryURL = generateQueryURL(query);

    // Clear the existing gifs and display 10
    clear = true;
    getTenGifs();
  });

  $('#moar').on('click', function() {

    // increase the offset so it displays the next 10 gifs
    queryOffset += 10;

    // generate the query again using the existing query
    queryURL = generateQueryURL(query);

    // DON'T clear the existing gifs, and display 10 more
    clear = false;
    getTenGifs();
  })

  // Logic to pause/play gifs
  $('#gifs').on('click', '.gif img', function() {
    var state = $(this).attr('data-state');

    if (state == "still") {
      $(this).attr('src', $(this).attr('data-animate'));
      $(this).attr('data-state', 'animate');
    } else if (state == "animate") {
      $(this).attr('src', $(this).attr('data-still'));
      $(this).attr('data-state', 'still');
    }
  })
});
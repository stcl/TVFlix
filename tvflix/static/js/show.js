// Generated by CoffeeScript 1.9.1
(function() {
  "use strict";
  (function($) {

    /*
      FUNCTION BLOCK
     */

    /*
        Retrieve an image from Trakt
     */
    var displayComments, displayEpisodes, displaySeasons, getEpImage, getShowImage, loadComments, loadSeasons, loadShow, root;
    getShowImage = function(label, callback) {
      return traktRequest('/shows/' + label + '?extended=images').success(function(data) {
        return callback(null, data.images.thumb.full);
      }).fail(function(XHR) {
        return callback(XHR);
      });
    };

    /*
      Set the Show information (HTML)
     */
    loadShow = function(item, callback) {
      $("#show").attr('data-url', item._links.self.href);
      $("#showComments").attr('data-url', item._links.comments.href);
      $('#startYear').text(item.start_year);
      $('#showTitle').text(item.title);
      $('#endYear').text(item.end_year);
      $('#channel').text(item.channel);
      $('#summary').text(item.summary);
      return getShowImage(item.showLabel, function(error, imgUrl) {
        if (error) {
          console.log(error);
          $('#showImage img').attr('src', '/static/image/no-image.png');
          return callback();
        }
        $('#showImage img').attr('src', imgUrl);
        return callback();
      });
    };

    /*
      Set the HTML with the sessions information
     */
    displaySeasons = function(seasons) {
      var seasonList;
      seasonList = $("#showSeasons ul");
      return seasons.forEach(function(season) {
        var li, link;
        link = $('<a>', {
          "class": 'season',
          href: '#',
          'data-episodes': season._links.episode.href
        }).text('Season ' + season.number);
        li = $('<li>').html(link);
        return seasonList.append(li);
      });
    };

    /*
      Do the request to get season information
     */
    loadSeasons = function(show, callback) {
      var seasonList;
      seasonList = $("#showSeasons ul");
      seasonList.html('');
      return $.ajax({
        url: show._links.seasons.href,
        type: 'GET',
        dataType: 'json'
      }).success(function(data) {
        return displaySeasons(data._embedded.season);
      }).complete(function() {
        return callback();
      });
    };

    /*
      Get Image URL from the trakt data
     */
    getEpImage = function(traktInfo, episodeNumber) {
      var imgUrl;
      imgUrl = null;
      traktInfo.every(function(episode) {
        if (episode.number === episodeNumber) {
          imgUrl = episode.images.screenshot.thumb;
          return false;
        }
        return true;
      });
      return imgUrl;
    };

    /*
      Create the DOM element for an episode using the template given in
      the HTML code (#episodeTemplate)
     */
    displayEpisodes = function(episodes, traktInfo) {
      var $episodes, $row, $rowTemplate, $template, nb, totalAdded, totalEpisode;
      $template = $("#episodeTemplate");
      $episodes = $("#showEpisodes").html('');
      nb = 0;
      totalAdded = 0;
      totalEpisode = episodes.length;
      $rowTemplate = $('<div class="row"></div>');
      $row = $rowTemplate.clone();
      return episodes.forEach(function(episode) {
        var $newEp, imageUrl;
        $newEp = $template.clone();
        if (traktInfo) {
          imageUrl = getEpImage(traktInfo, episode.number);
          if (imageUrl) {
            $newEp.find("div.thumb img").attr('src', imageUrl);
          }
        }
        $newEp.attr('id', 'ep-' + episode.number);
        $newEp.find("h2").text(episode.title);
        $newEp.find("div.summary").text(episode.summary);
        $newEp.find("span.epBcast").text(episode.bcast_date);
        $newEp.find("span.epNumber").text(episode.number);
        $newEp.addClass('col-md-6');
        $newEp.removeClass('invisible');
        $row.append($newEp);
        if (++nb % 2 === 0 || ++totalAdded === totalEpisode) {
          $episodes.append($row);
          return $row = $rowTemplate.clone();
        }
      });
    };
    displayComments = function(comments) {
      var $comments;
      $comments = $("#showComments").html('');
      return comments.forEach(function(comment) {
        return createComment(comment);
      });
    };

    /*
      Load the comments for the show
     */
    loadComments = function(show, callback) {
      return $.ajax({
        url: show._links.comments.href,
        type: 'GET',
        dataType: 'json'
      }).success(function(data) {
        return displayComments(data._embedded.comment);
      }).complete(function() {
        return callback();
      });
    };

    /*
      LINK BLOCK
     */
    $('#showSeasons').on('click', 'a.season', function(e) {
      var $link, traktUrl, url;
      e.preventDefault();
      toggleLoadingScreen();
      $link = $(e.target);
      url = $link.attr('data-episodes');
      traktUrl = url.replace('/tvflix', '') + '?extended=images';
      return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json'
      }).success(function(data) {
        return traktRequest(traktUrl).success(function(traktData) {
          displayEpisodes(data._embedded.episode, traktData);
          return setTimeout(toggleLoadingScreen, 500);
        }).fail(function() {
          displayEpisodes(data._embedded.episode);
          return setTimeout(toggleLoadingScreen, 500);
        });
      }).fail(toggleLoadingScreen);
    });
    root = typeof window !== "undefined" && window !== null ? window : this;
    return $.extend(root, {
      loadShow: loadShow,
      loadSeasons: loadSeasons,
      loadComments: loadComments
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=show.js.map

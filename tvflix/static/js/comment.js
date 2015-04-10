// Generated by CoffeeScript 1.9.1
(function() {
  "use strict";
  (function($) {
    var $commentManager, $comments, $template, createComment, handleAddedComment, handleUserLogin, handleUserLogout, root, user;
    $comments = $("#showComments");
    $template = $("#commentTemplate");
    user = User.getCurrentUser();
    $commentManager = $('<div class="commentManager"><button class="btn btn-default edit"><span class="glyphicon glyphicon-edit"></span></button> <button class="btn btn-danger delete"><span class="glyphicon glyphicon-remove"></span></button></div>');

    /*
      Check if the comment need to have its managing button
     */
    handleAddedComment = function(event, jQueryObject) {
      if (jQueryObject.attr('data-username') !== user.name) {
        return;
      }
      return jQueryObject.append($commentManager);
    };

    /*
      Remove all managing button if the user logout
     */
    handleUserLogout = function(event) {
      return $comments.find('.comment .commentManager').remove();
    };

    /*
      Check if the user have a comment for the current show and add the managing button
     */
    handleUserLogin = function(event) {
      return $comments.find('.comment').each(function() {
        return handleAddedComment(null, $(this));
      });
    };

    /*
      Transform a Comment object into a Comment DOM
     */
    createComment = function(comment) {
      var $newComment;
      $newComment = $template.clone();
      $newComment.attr('id', 'com-' + comment.username);
      $newComment.attr('data-username', comment.username);
      $newComment.find("h3").text(comment.username);
      $newComment.find("div.avatar img").attr('src', '//robohash.org/' + comment.username + '?set=set3&size=60x60');
      $newComment.find("p").text(comment.comment);
      return $newComment.removeClass('invisible');
    };

    /*
      EVENTS
     */
    $comments.on('comment.added', handleAddedComment);
    $(user).on('user.logout', handleUserLogout);
    $(user).on('user.login', handleUserLogin);
    root = typeof window !== "undefined" && window !== null ? window : this;
    return root.createComment = createComment;
  })(jQuery);

}).call(this);

//# sourceMappingURL=comment.js.map

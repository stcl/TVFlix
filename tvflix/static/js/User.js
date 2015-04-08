// Generated by CoffeeScript 1.9.1
(function() {
  "use strict";

  /*
    Represent the User in the application
   */
  (function($) {
    var User, root;
    User = (function() {
      function User(name, apikey, admin) {
        this.name = name;
        this.apikey = apikey;
        this.admin = admin;
      }

      User.prototype.saveLocalStorage = function() {
        return localStorage.setItem('User', JSON.stringify(this));
      };

      User.prototype.setInfo = function(name, apikey, admin) {
        this.name = name;
        this.apikey = apikey;
        this.admin = admin;
        return this.saveLocalStorage();
      };

      User.prototype.isValid = function() {
        return this.name && this.apikey && this.admin;
      };

      User.prototype.clearInfo = function() {
        delete this.apikey;
        delete this.name;
        delete this.admin;
        return localStorage.removeItem('User');
      };

      User.fromLocalStorage = function() {
        var localObject, localUser;
        localUser = localStorage.getItem('User');
        if (localUser) {
          localObject = new User();
          $.extend(localObject, JSON.parse(localUser));
          return localObject;
        }
        return new User();
      };

      User.currentUser = null;

      User.getCurrentUser = function() {
        var ref;
        return (ref = this.currentUser) != null ? ref : this.currentUser = User.fromLocalStorage();
      };

      return User;

    })();
    root = typeof window !== "undefined" && window !== null ? window : this;
    return root.User = User;
  })(jQuery);

}).call(this);

//# sourceMappingURL=User.js.map
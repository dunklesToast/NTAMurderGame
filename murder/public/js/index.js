/**
 * Created by dunklesToast on 16.07.2017.
 */
const app = angular.module('murder', ['ngMaterial']);

app.controller('indexController', function ($scope, $mdToast, $http, $animate) {

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.user = {};
    $scope.user.username = '';
    $scope.user.password = '';
    $scope.logindis = true;
    $scope.check = function () {
        $scope.logindis = !($scope.user.password && $scope.user.password != "" && $scope.user.username && $scope.user.username != "");
    };

    $scope.sendLogin = function () {
        let url;
        $scope.user.mail = '';
        if(validateEmail($scope.user.username)){
            url = '/email';
            $scope.user.mail = $scope.user.username;
        }else {
            url = '/user';
        }
        console.log($scope.user);
        $scope.user.hash = sha512($scope.user.password);
        $http.post(url, {
            mail: $scope.user.mail,
            username: $scope.user.username,
            hash: $scope.user.hash,
        }).then((res) => {
            console.log(res.status);
            if(res.status == 200){
                window.location = '/dash';
            }else {
                $animate.addClass(document.getElementById('loginDialog'), 'shake').then(() => {
                    $animate.removeClass(document.getElementById('loginDialog'), 'shake');
                });
            }
        }).catch((err) => {
            $animate.addClass(document.getElementById('loginDialog'), 'shake').then(() => {
                $animate.removeClass(document.getElementById('loginDialog'), 'shake');
            });
        })
    };

    $scope.showSaveToast = function () {
        $mdToast.show({
            hideDelay: 5000,
            position: "bottom left",
            templateUrl: './templates/save-toast-tmpl.html'
        });
    }
});

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('altTheme').primaryPalette('grey', {
        'default': '900'
    }).accentPalette('red', {
        'default': '700'
    });

    $mdThemingProvider.setDefaultTheme('altTheme');
    $mdThemingProvider.alwaysWatchTheme(true);
});

app.controller('ToastCtrl', function ($scope, $mdToast) {
    $scope.closeToast = function () {
        $mdToast.hide();
    };
});
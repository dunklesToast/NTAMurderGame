/**
 * Created by dunklesToast on 17.07.2017.
 */
/**
 * Created by dunklesToast on 16.07.2017.
 */
const app = angular.module('murder', ['ngMaterial']);

app.controller('dashController', function ($scope, $mdToast, $http, $animate) {

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

    $scope.startDate = '';
    $http.get('/api/start').then(function (res) {
        console.log(res.data.start);
        $scope.startDate = res.data.start;
        updateTime();
        var x = setInterval(function() {
            updateTime(x)
        }, 1000);
    });

    function updateTime(x) {
        var distance = new Date().getTime() - new Date($scope.startDate).getTime();
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var timeString = '';
        if (!(days == 0)) timeString += days + 'd ';
        if (!(days == 0 && hours == 0)) timeString += hours + 'h ';
        if (!(days == 0 && hours == 0 && minutes == 0)) timeString += minutes + 'm ';
        if (!(days == 0 && hours == 0 && minutes == 0 && seconds == 0)) timeString += seconds + 's';
        document.getElementById('counter').innerHTML = timeString;
        if (distance < 0) {
            clearInterval(x);
            location.reload();
        }
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
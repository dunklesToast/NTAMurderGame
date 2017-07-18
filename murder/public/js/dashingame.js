/**
 * Created by dunklesToast on 18.07.2017.
 */
/**
 * Created by dunklesToast on 16.07.2017.
 */
const app = angular.module('murder', ['ngMaterial', 'md.data.table']);

app.controller('dashigController', function ($scope, $mdToast, $http, $animate) {

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

    $http.get('/api/top/3').then(function (res) {
        console.log(typeof res.data);
        console.log(res.data);
        $scope.top3 = res.data;
        $scope.safeApply()
    });

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
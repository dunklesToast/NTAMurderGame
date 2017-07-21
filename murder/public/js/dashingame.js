/**
 * Created by dunklesToast on 18.07.2017.
 */
const app = angular.module('murder', ['ngMaterial', 'md.data.table']);

app.controller('dashigController', function ($scope, $mdToast, $http, $mdDialog) {

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


    $scope.deathDialog = function (ev) {
        $mdDialog.show({
            controller: DeathDialogController,
            templateUrl: 'tmpl/death.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        })
            .then(function (death, deathmsg) {
                console.log(deathmsg);
                if (death) {
                    strokeStyle = '#D50000'
                }
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //TODO
    $scope.openInfo = function (id) {
        console.log('gettin infos for ' + id)
    };

    $http.get('/api/top/3').then(function (res) {
        console.log(typeof res.data);
        console.log(res.data);
        $scope.top3 = res.data;
        $scope.safeApply()
    });


    $http.get('/api/death').then(function (res) {
        strokeStyle = !res.data.death ? '#69F0AE' : '#D50000'
    });

    function DeathDialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.death = [];
        $scope.answer = function (answer) {
            $mdDialog.hide(answer, $scope.death);
            $http.post('/api/death', {
                death: true,
                msg: $scope.death.reason,
                loc: $scope.death.loc
            }).then(function (res) {
                strokeStyle = '#D50000';
                location.reload();
            });
        };
        $scope.sendDisabled = true;
        $scope.check = function (death) {
            if (death != '') {
                $scope.sendDisabled = false;
            }
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
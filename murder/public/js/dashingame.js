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

    $scope.openInfo = function (id) {
        console.log('gettin infos for ' + id);
        $mdDialog.show({
            locals: {dataToPass: id},
            controller: InfoDialogController,
            templateUrl: 'tmpl/info.html',
            parent: angular.element(document.body),
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

    $scope.openAllInfo = function () {
        $mdDialog.show({
            controller: AllInfoDialogController,
            templateUrl: 'tmpl/allInfo.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true
        }).then(function (death, deathmsg) {
        }, function () {
        });
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

    function AllInfoDialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $http.get('/api/chronological/').then(function (res) {
            $scope.chrono = res.data;
            for (var i = 0; i < $scope.chrono.length; i++) {
                $scope.currentLoop = i;
                var date = new Date($scope.chrono[i].death_time);
                if (!isNaN(date.getHours())) {
                    $scope.chrono[i].death_time = ('0' + date.getDate()).slice(-2) + '.' + ('0' + date.getMonth()).slice(-2) + '.' + date.getFullYear() + '/' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
                } else {
                    $scope.chrono[i].death_time = '';
                }
                console.log('ID: ' + $scope.chrono[i].killedBy);
                if ($scope.chrono[i].killedBy) {
                    $http.get('/api/info/' + $scope.chrono[i].killedBy).then(function (killer) {
                        $scope.chrono[$scope.currentLoop - 1].killedBy = killer.data.full
                    })
                }
            }
        });
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }

    function InfoDialogController($scope, $mdDialog, dataToPass) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $http.get('/api/info/' + dataToPass).then(function (res) {
            console.log(res.data);
            $scope.murder = res.data;
            var date = new Date(res.data.death_time);
            $scope.murder.death_time = ('0' + date.getDate()).slice(-2) + '.' + ('0' + date.getMonth()).slice(-2) + '.' + date.getFullYear() + '/' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
            $http.get('/api/info/' + res.data.killedBy).then(function (killer) {
                $scope.murder.killedBy = killer.data.full
            })
        });
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }

    function DeathDialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.death = [];
        $scope.answer = function (answer) {
            console.log('ANS' + answer);
            $mdDialog.hide(answer, $scope.death);
            if (answer) {
                $http.post('/api/death', {
                    death: true,
                    msg: $scope.death.reason,
                    loc: $scope.death.loc
                }).then(function (res) {
                    strokeStyle = '#D50000';
                    location.reload();
                });
            }
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
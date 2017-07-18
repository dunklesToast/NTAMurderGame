/**
 * Created by dunklesToast on 16.07.2017.
 */
/**
 * Created by dunklesToast on 16.07.2017.
 */
const app = angular.module('murder', ['ngMaterial']);

app.controller('regController', function ($scope, $mdToast, $http) {

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
    $scope.user.passwordc = '';
    $scope.user.full = '';
    $scope.user.tos = false;
    $scope.user.mail = '';
    $scope.regdis = true;
    $scope.check = function () {
        if ($scope.user.username && $scope.user.password && $scope.user.passwordc && $scope.user.full && $scope.user.tos && $scope.user.mail) {
            $scope.regdis = $scope.user.password.length <= 7;
        } else {
            $scope.regdis = true
        }
    };

    $scope.sendReg = function () {
        if (validateEmail($scope.user.mail)) {


            if ($scope.user.password == $scope.user.passwordc) {
                $scope.oldpw = $scope.user.password;
                $scope.user.password = sha512($scope.user.password);
                $scope.user.passwordc = sha512($scope.user.passwordc);
                $http.post('/reg', $scope.user).then(function () {
                    $scope.user.password = $scope.oldpw;
                    $scope.user.passwordc = $scope.oldpw;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Registered! Redirecting...')
                            .position('left bottom')
                            .hideDelay(3000)
                    );
                    setTimeout(function () {
                        window.location = '/';
                    }, 3050)
                }, function (err) {
                    $scope.user.password = $scope.oldpw;
                    $scope.user.passwordc = $scope.oldpw;
                    if (err.status == 666) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Damn. That mail already in use. Forgot password? Ask Tom')
                                .position('left bottom')
                                .hideDelay(3000)
                        );
                    } else if (err.status == 777) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Damn. That username already in use. Forgot password? Ask Tom')
                                .position('left bottom')
                                .hideDelay(3000)
                        );
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Damn. That hasn\'t worked. Try again!')
                                .position('left bottom')
                                .hideDelay(3000)
                        );
                    }
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Passwords not equal')
                        .position('left bottom')
                        .hideDelay(3000)
                );
            }
        } else {
            $mdToast.show($mdToast.simple().textContent('Mail not valid').position('left bottom').hideDelay(3000))
        }
    };
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
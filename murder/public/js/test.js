/**
 * Created by dunklesToast on 18.07.2017.
 */
const app = angular.module('murdermod', []);

app.controller('testController', function ($scope, $http) {

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

    $scope.top3 = [{username: 'noc'},{username: 'nec'},{username: 'nic'}];

    $http.get('/api/top/3').then(function (res) {
        console.log(typeof res.data);
        console.log(res.data);
        $scope.top3 = res.data;
        $scope.safeApply()
    });
});
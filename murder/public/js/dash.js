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
        var x = setInterval(function () {
            updateTime(x)
        }, 1000);
    });

    function updateTime(x) {
        var distance = new Date($scope.startDate).getTime() - new Date().getTime();
        console.log(distance);
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

    $scope.german = false;
    //Yes we know that this is not the best way to i18n the rules
    var engRules = 'You can attempt to kill your assigned victim by handing them an object and directly afterwards making the attempt public.<br>The requirements for an attempt to be successful are as follows:<br><ul> <li>The victim must accept the object voluntarily.</li></ul>Should an attempt be successful, it is the victim\'s duty to indicate in this website that they have been killed and add a death message describing the murder in a creative and funny fashion<b>(e.g. a pun including the object - or killing tool - they have been slain with)</b><br>Your new job is then to kill the victim of your previously slain victim - you will see it at this webpage when your last victim indicated his death!<br>Should a murder be not successful, i.e. another living player testifies to have witnessed the attempt after you made it public, you will die.<br>It is your job to indicate in this app that you have died, of course also adding a creative and funny death message.<br>Deaths including their time, place and posted death message will be made visible to every player in their dashboard.<br>To clarify, please note:<ul> <li> As long as not made public by yourself, any handing over of objects will not be affected by these rules. It is a common strategy for players to deceive their victims by handing them objects in silence several times before making an actual murder attempt. </li> <li> Players are classified \'living\' (and thus able to testify as a witness) if and only if they are both participating in the game and have not been killed nor died yet. </li> <li> It is acceptable for other living players to be present during a successful attempt to murder your victim, as long as they do not observe the handing over of your killing tool, for example because they were inattentive or distracted. </li></ul>'
    var gerRules = 'Du kannst deinen Mordauftrag ausfüllen, indem du deinem Opfer einen beliebigen Gegenstand überreichst und <b>direkt anschließend</b> die Übergabe als einen Mordversuch erklärst.<br>Damit ein Mordversuch erfolgreich ist und der Mordauftrag ausgefüllt wird, muss Folgendes gegeben sein:<ul> <li> Das Opfer muss den Gegenstand freiwillig angenommen haben. </li> <li> Der Mordversuch darf nicht von einem anderen lebenden Spieler wahrgenommen werden. </li></ul><br>Sollest du dein Opfer erfolgreich getötet haben, muss dein Opfer auf dieser WebSite angeben, dass es gestorben ist und eine kreative sowie witzige Todesnachricht eingeben (z.B. ein Flachwitz mit dem überreichten Mordwerkzeug).<br>Dein neuer Auftrag ist nun der Auftrag von deinem bereits getöteten Opfer. Du siehst ihn in deinem Dashboard, sobald dein "altes Opfer" sich als ermordert einträgt!<br>Alle Tode werden mit der Zeit, dem Ort und der angegebenen Todesnachricht auf dem für alle Spieler sichtbaren Dashboard veröffentlicht.Damit keine Missverständnisse auftreten:<ul> <li> Solange du das Überreichen eines Gegenstandes nicht laut für einen Mordversuch erklärst, treffen diese Regeln nicht auf die Übergabe zu. Eine typische Strategie ist, seinem Opfer mehrere Gegenstände zu übergeben ohne etwas zu sagen, um dieses zu trügen. </li> <li> Spieler gelten nur dann als lebend (und sind nur dann im Stande als Zeuge einen Mord wahrzunehmen), wenn sie einerseits am Spiel teilnehmen und andererseits noch nicht getötet wurden bzw. noch nicht gestorben sind. </li> <li> Ein Mord kann auch erfolgreich ablaufen, wenn während der Übergabe andere lebende Spieler anwesend sind, welche den Mordversuch nicht direkt beobachten, weil sie z.B. nicht aufmerksam oder abgelenkt sind. </li></ul>DU hast noch fragen? Frag einfach Marco ^^';


    $scope.changeLanguage = function () {
        if ($scope.german) {
            document.getElementById('rules').innerHTML = engRules;
            $scope.german = false;
            $scope.langButtonText = 'Deutsche Version anzeigen';
        } else {
            document.getElementById('rules').innerHTML = gerRules;
            $scope.german = true;
            $scope.langButtonText = 'Show English version';
        }
    };
    document.getElementById('rules').innerHTML = engRules;
    document.getElementById('cardRules').style.width = "420px";


    $scope.langButtonText = 'Deutsche Version anzeigen';

    $scope.rulesButtonText = 'Show Rules';
    $scope.showRules = false;

    $scope.toggleRules = function () {
        if ($scope.showRules) {
            document.getElementById('cardRules').style.width = "420px";
            $scope.maxWidth = '420px';
            $scope.showRules = false;
            $scope.rulesButtonText = 'Show Rules';
        } else {
            document.getElementById('cardRules').style.width = "1200px";
            $scope.maxWidth = '1200px';
            $scope.showRules = true;
            $scope.rulesButtonText = 'Hide Rules';
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
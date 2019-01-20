const notificationOptions = {
  tag: 'count-down-alert', // tag for notification
  renotify: true, // defalt false, renotifying after old notification
  body: '', // description under title
  vibrate: [50, 100, 150] // vibration on notification
}

var App = {
    config: {
        defaultCountDownTime: 3//50 * 60
    },
    ref: {},
    env: {},
    function: {},
    callback: {},
    core: {},
    i18n: {},
    ui: {},
    sound: {},
    

    init: function() {},
    start: function() {}
}

App.init = function()
{
    App.ref.timerTitle = $('#timer-title');
    App.ref.timerPlaceholder = $('#time-left-placeholder');
    App.ref.startButton = $('#start-button');
    App.ref.pauseButton = $('#pause-button');
    App.ref.resetButton = $('#reset-button');
    App.ref.continueButton = $('#continue-button');
    App.core.restoreEnv();
    App.env.countDownFinished = new Howl({
      src: ['/countdown/js/media/countdown_finished.wav']
    });
}

App.start = function()
{
    App.init();
    App.ref.startButton.on('click', App.callback.onStartButtonPressed);
    App.ref.resetButton.on('click', App.callback.onResetButtonPressed);
    App.ref.pauseButton.on('click', App.callback.onPauseButtonPressed);
    App.ref.continueButton.on('click', App.callback.onContinueButtonPressed);
}

App.core.restoreEnv = function()
{
    App.core.setTimerDefaults();
}

App.core.setTimerDefaults = function()
{
    App.env.isRunning = false;
    App.env.countDownTime = App.config.defaultCountDownTime;
    App.env.currentCountDownTime = App.config.defaultCountDownTime;
    App.function.updateTimerValue(App.env.currentCountDownTime);
}

App.core.startTicking = function()
{
    App.env.tickerInterval = setInterval(
        function() {
            App.core.tick();
        }, 1000
    );
}

App.core.stopTicking = function()
{
    clearInterval(App.env.tickerInterval);
}

App.core.tick = function()
{
    if (!App.env.isRunning) {
        return;
    }

    App.env.currentCountDownTime -= 1;
    if ( App.env.currentCountDownTime <= 0) {
        App.core.stopTicking();
        App.callback.countDownFinished();
    }

    App.function.updateTimerValue(App.env.currentCountDownTime);
}

App.core.reset = function()
{
    App.core.setTimerDefaults();
}

App.core.secondsToHumanReadableData = function(totalSeconds)
{
    seconds = Math.floor(totalSeconds % 60);
    totalSeconds /= 60;
    minutes = Math.floor(totalSeconds % 60);
    totalSeconds /= 60;
    hours = Math.floor(totalSeconds % 24);
    totalSeconds /= 24;
    days = Math.floor(totalSeconds);

    return {
        "days" :  ("0" + days).slice(-2),
        "hours" : ("0" + hours).slice(-2),
        "minutes" : ("0" + minutes).slice(-2),
        "seconds" : ("0" + seconds).slice(-2)
    };
}

App.function.updateTimerValue = function(value)
{
    var data = App.core.secondsToHumanReadableData(value);
    App.ref.timerPlaceholder.html(
        [
            data.hours,
            data.minutes,
            data.seconds
        ].join(":")
    );
}

App.function.updateTitle = function(title)
{
    App.ref.timerTitle.html(title);
}

App.callback.onPauseButtonPressed = function(evt) 
{
    App.env.isRunning = false;
    App.function.updateTitle(App.i18n.timerTitlePaused);
    App.ref.pauseButton.addClass('hidden');
    App.ref.continueButton.removeClass('hidden');
}

App.callback.onStartButtonPressed = function(evt) 
{
    App.env.isRunning = true;
    App.function.activateResetButtons();
    App.core.startTicking();
}

App.callback.onResetButtonPressed = function(evt) 
{
    App.env.isRunning = false;
    App.core.reset();
    App.function.activateStartButtons();
}

App.callback.onContinueButtonPressed = function()
{
    App.env.isRunning = true;
    App.function.updateTitle(App.i18n.timerTitle);
    App.ref.pauseButton.removeClass('hidden');
    App.ref.continueButton.addClass('hidden');
}

App.function.activateResetButtons = function()
{
    App.ref.startButton.addClass('hidden');
    App.ref.pauseButton.removeClass('hidden');
    App.ref.resetButton.removeClass('hidden');
}

App.function.activateStartButtons = function()
{
    App.ref.startButton.removeClass('hidden');
    App.ref.pauseButton.addClass('hidden');
    App.ref.resetButton.addClass('hidden');
}

App.core.generateNotificationMessage = function()
{
    var now = new Date();
    return  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " - Countdown has ended.";
}

App.callback.countDownFinished = function()
{
    App.ref.pauseButton.addClass('hidden');

    if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(App.core.generateNotificationMessage(), notificationOptions);
            }
        });
        
        if (Notification.permission === "granted") {
            new Notification(App.core.generateNotificationMessage(), notificationOptions);
        }
    }
    
    try {
        App.env.countDownFinished.fade(0, 1);
    } catch (e) {
        // ..
    }
}

App.i18n.timerTitle = 'Countdown';
App.i18n.timerTitlePaused = 'Countdown - Paused';

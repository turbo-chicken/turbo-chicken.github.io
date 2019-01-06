var App = {
    config: {
        defaultCountDownTime: 2//50 * 60
    },
    ref: {},
    env: {},
    main: {},
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
    App.ref.bloodymirModeButton = $('#toggle-bloodymir-mode');
    App.core.restoreEnv();
    App.env.countDownFinished = new Howl({
      src: ['js/media/countdown_finished.wav']
    });
}

App.start = function()
{
    App.init();
    App.ref.startButton.on('click', App.callback.onStartButtonPressed);
    App.ref.resetButton.on('click', App.callback.onResetButtonPressed);
    App.ref.pauseButton.on('click', App.callback.onPauseButtonPressed);
    App.ref.continueButton.on('click', App.callback.onContinueButtonPressed);
    App.ref.bloodymirModeButton.on('click', App.ui.toggleBloodymirMode);
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
    App.main.updateTimerValue(App.env.currentCountDownTime);
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

        return;
    }

    App.main.updateTimerValue(App.env.currentCountDownTime);
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

App.main.updateTimerValue = function(value)
{
    var data = App.core.secondsToHumanReadableData(value);
    App.ref.timerPlaceholder.html(
        [
            //data.hours,
            data.minutes,
            data.seconds
        ].join(":")
    );
}

App.main.updateTitle = function(title)
{
    App.ref.timerTitle.html(title);
}

App.callback.onPauseButtonPressed = function(evt) 
{
    App.env.isRunning = false;
    App.main.updateTitle(App.i18n.timerTitlePaused);
    App.ref.pauseButton.addClass('hidden');
    App.ref.continueButton.removeClass('hidden');
}

App.callback.onStartButtonPressed = function(evt) 
{
    App.env.isRunning = true;
    App.main.activateResetButtons();
    App.core.startTicking();
    App.main.updateTitle(App.i18n.timerTitle);
}

App.callback.onResetButtonPressed = function(evt) 
{
    App.env.isRunning = false;
    App.core.reset();
    App.main.activateStartButtons();
}

App.callback.onContinueButtonPressed = function()
{
    App.env.isRunning = true;
    App.main.updateTitle(App.i18n.timerTitle);
    App.ref.pauseButton.removeClass('hidden');
    App.ref.continueButton.addClass('hidden');
}

App.main.activateResetButtons = function()
{
    App.ref.startButton.addClass('hidden');
    App.ref.pauseButton.removeClass('hidden');
    App.ref.resetButton.removeClass('hidden');
}

App.main.activateStartButtons = function()
{
    App.ref.startButton.removeClass('hidden');
    App.ref.pauseButton.addClass('hidden');
    App.ref.resetButton.addClass('hidden');
}

App.callback.countDownFinished = function()
{
    App.env.countDownFinished.fade(0, 1);
    App.main.updateTitle(App.i18n.timerFinished);
    App.core.setTimerDefaults();
    App.main.activateStartButtons();
}

App.ui.toggleBloodymirMode = function()
{
    $('html,body').css('backgroundColor', 'black');
}

App.i18n.timerTitle = 'Countdown';
App.i18n.timerTitlePaused = 'Countdown - Paused';
App.i18n.timerFinished = 'TIME IS UP';

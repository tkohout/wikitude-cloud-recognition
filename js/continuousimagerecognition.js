var World = {
    loaded: false,
    tracker: null,
    cloudRecognitionService: null,

    init: function initFn() {
        this.createTracker();
        this.createOverlays();
        // AR.logger.activateDebugMode();
    },

    /*
        First an AR.ImageTracker connected with an AR.CloudRecognitionService needs to be created in order to start
        the recognition engine. It is initialized with your client token and the id of one of your target collections.
        Optional parameters are passed as object in the last argument. In this case callback functions for the
        onInitialized and onError triggers are set. Once the tracker is fully loaded the function trackerLoaded() is
        called, should there be an error initializing the CloudRecognitionService the function trackerError() is
        called instead.
    */
    createTracker: function createTrackerFn() {
        this.cloudRecognitionService = new AR.CloudRecognitionService(
            "ed071bd0345f5f75d7630eda3f586d8e",
            "5bd89522ec78b55a4ddf5b0e",
            {
                onInitialized: World.trackerLoaded,
                onError: World.onError
            }
        );

        World.tracker = new AR.ImageTracker(this.cloudRecognitionService, {
            onError: World.onError
        });
    },

    startContinuousRecognition: function startContinuousRecognitionFn(interval) {
        /*
            With this function call the continuous recognition mode is started. It is passed four parameters, the
            first defines the interval in which a new recognition is started. It is set in milliseconds and the
            minimum value is 500. The second parameter defines a callback function that is called by the server if
            the recognition interval was set too high for the current network speed. The third parameter is again a
            callback which is fired when a recognition cycle is completed. The fourth and last paramater defines
            another callback function that is called in case an error occured during the client/server interaction.
        */
        this.cloudRecognitionService.startContinuousRecognition(
            interval, this.onInterruption, this.onRecognition, this.onRecognitionError);
    },

    createOverlays: function createOverlaysFn() {

    },

    /*
        The onRecognition callback function defines two parameters. The first parameter is a boolean value which
        indicates if the server was able to detect the target, its value will be 0 or 1 depending on the outcome.
        The second parameter a JSON Object will contain metadata about the recognized target, if no target was
        recognized the JSON object will be empty.
    */
    onRecognition: function onRecognitionFn(recognized, response) {
        if (recognized) {
            AR.platform.sendJSONObject(response.metadata)
        }
    },

    onRecognitionError: function onRecognitionErrorFn(errorCode, errorMessage) {
        alert("error code: " + errorCode + " error message: " + JSON.stringify(errorMessage));
    },

    /*
        In case the current network the user is connected to, isn't fast enough for the set interval. The server
        calls this callback function with a new suggested interval. To set the new interval the recognition mode
        first will be restarted.
    */
    onInterruption: function onInterruptionFn(suggestedInterval) {
        World.cloudRecognitionService.stopContinuousRecognition();
        World.startContinuousRecognition(suggestedInterval);
    },

    trackerLoaded: function trackerLoadedFn() {
        World.startContinuousRecognition(750);
        //Testing Code for Wikitude
        //AR.platform.sendJSONObject({QRcode: '1234567b'})
        document.getElementById("loadingMessage").style.display = "none";
    },
    onError: function onErrorFn(error) {
        alert(error)
    }
};

World.init();

(function() {
    // GetUserMedia is not yet supported by all browsers
    // Until then, we need to handle the vendor prefixes
    navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    // Checks if getUserMedia is available on the client browser
    window.hasUserMedia = function hasUserMedia() {
        return navigator.getMedia ? true : false;
    };
})();
var wtffDirectives = angular.module('wtff.directives',[]);

wtffDirectives.directive('scannerGun',function($timeout){
    return {
        restrict: 'E',
        template: '<div>' +
            '<canvas id="canvas-source"></canvas>' +
            '<video ng-hide="videoStatus"></video>' +
            '<canvas id="canvas-blended" ng-hide="canvasStatus"></canvas>' +
            '<canvas id="canvas-ajax" ng-hide="canvasStatus"></canvas>' +
            '</div>',
        replace: true,
        scope: false,
        transclude: true,
        link: function ($scope, element){
            var lastImageData;
            //elements
            var vid = element.find('video')[0];
            var sourceCanvas = element.find('canvas')[0];
            var blendedCanvas = element.find('canvas')[1];
            var ajaxCanvas = element.find('canvas')[2];
            //canvas 2d
            var sourceContext = sourceCanvas.getContext('2d');
            var blendedContext = blendedCanvas.getContext('2d');
            var ajaxContext = ajaxCanvas.getContext('2d');

            //show or hide the blended and the shot canvas
            $scope.canvasStatus = true;
            //show or hide the video tag
            $scope.videoStatus = true;

            width = element.width = 410;
            height = element.height = 0;

            var fastAbs = function(value){
               return ((value ^(value >> 31)) - (value >> 31))
            };

            var threshold = function(value){
                if(value > 0x15){
                    return 0xFF;
                }else{
                    return 0;
                }
            };


            var differenceAccuracy = function(target, data1, data2){
                if (data1.length !== data2.length) return null;

                i = 0;
                while (i < (data1.length * 0.25)){
                    var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
                    var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
                    var diff = threshold(fastAbs(average1-average2));
                    target[4*i] = diff
                    target[4*i+1] = diff
                    target[4*i+2] = diff
                    target[4*i+3] = 0xFF
                    ++i
                }
            };

            /*
            convert the image from canvas source into a blend image
             */
            var blend = function(){
                //get the image webcam
                var sourceData = sourceContext.getImageData(82,34,248,248);

                if(!lastImageData) lastImageData = sourceContext.getImageData(82,34,248,248);

                var blendedData = sourceContext.createImageData(248, 248);
                //check the differeces between last image and actual image
                differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
                //set the blend image into the hidden canvas
                blendedContext.putImageData(blendedData, 0, 0)

                lastImageData = sourceData;
            };

            /*
            draw a rectangle into the canvas source
            this rectangle define the part of the image where we detect the motion and
            the image shot to send to the server scanner
             */
            var drawScanner = function(){
                sourceContext.beginPath();
                sourceContext.rect(80, 32, 250, 250)
                sourceContext.lineWidth = 2;
                sourceContext.strokeStyle = 'red';
                sourceContext.stroke();
            };

            /*
            detect if have a motion
            if yes send a broadcast 'motion'
             */
            var checkMotion = function(){
                var blendedData = blendedContext.getImageData(0, 0, 248, 248);
                i = 0;
                average = 0;
                while (i < (blendedData.data.length * 0.25)){
                    average += ((blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3);
                    i++;
                }
                average = Math.round(average/(blendedData.data.length * 0.25));
                if (average > 15){
                    //have some movement
                    var rectangleImage = sourceContext.getImageData(82,34,248,248)
                    ajaxContext.putImageData(rectangleImage, 0, 0);
                    data = ajaxCanvas.toDataURL('image/jpeg');
                    $scope.$broadcast('motion', data);
                    $scope.image_scanner = data;
                }
            };
            /*
            draw the image data from the video tag into the source canvas
             */
            var drawVideoCanvas = function(){
                sourceContext.drawImage(vid, 0, 0, vid.width, vid.height);
            };

            var update = function(){
                drawVideoCanvas();
                drawScanner();
                blend();
                checkMotion();
                $timeout(function(){
                    update();
                },1000/60);
            };

            /*
            Webcam play correctly
             */
            var onSuccess = function onSuccess(stream) {
                // Firefox supports a src object
                if (navigator.mozGetUserMedia) {
                    vid.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    vid.src = vendorURL.createObjectURL(stream);
                }

                vid.play();
                $scope.$broadcast('webcamActive');
                update();
            };

            /*
            webcam WebRTC error
             */
            var onFailure = function onFailure(err) {

                if (console && console.log) {
                    console.log('The following error occured: ', err);
                }
                $scope.$broadcast('webcamInactive');
                return;
            };


            //set video tag dimensions
            height = (vid.videoHeight / ((vid.videoWidth/width))) || 310;
            vid.setAttribute('width', width);
            vid.setAttribute('height', height);

            //set canvas source dimensions
            sourceCanvas.setAttribute('width', width);
            sourceCanvas.setAttribute('height', height);
            //set blend canvas dimensions
            blendedCanvas.setAttribute('width', 248);
            blendedCanvas.setAttribute('height', 248);
            //set the imageshot canvas dimensions
            ajaxCanvas.setAttribute('width', 248);
            ajaxCanvas.setAttribute('height', 248);

            navigator.getMedia (
                // ask only for video
                {
                    video: true,
                    audio: false
                },
                onSuccess,
                onFailure
            );
        }
    }
});

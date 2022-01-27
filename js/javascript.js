if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(function () {
			console.log("Service worker is registered!")
		})
}

function displayFirstNotification() {
	$("#btnEnableNotifications").hide();


	var options = {
		body: "You are successfully subscribed to Urban Connect notifications! Thank you very much!",
		icon: "/images/icons/app_icon48x48.png",
		// Star Wars shamelessly taken from Peter Beverloo
		// https://tests.peter.sh/notification-generator/
		vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]

	}

	navigator.serviceWorker.ready.then(function (registration) {
		registration.showNotification("Successfully subscribed!!", options)
	})
}

function askForNotificationPermission() {
	Notification.requestPermission(function (result) {
		console.log("user Choice", result);
		if (result != "granted") {
			console.log("No permission granted");
		} else {
			console.log("Permission granted!!!");
			displayFirstNotification();
		}

	})
}

$(function () {

	if ('Notification' in window) {
		$("#btnEnableNotifications").show();
		$("#btnEnableNotifications").click(askForNotificationPermission);
	}

})

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(function () {
			console.log("Service worker is registered!")
		})
}

var videoPlayer;
function startVideo() {
	//enables the camera, if possible
	if ('mediaDevices' in navigator) {
		navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (stream) {

				//it will automatically ask for permission
				//if the user denies, it will give back an error

				//change the following querySelector to the id of the
				//object where you want to send the stream of the video
				videoPlayer = document.querySelector("#player");
				videoPlayer.srcObject = stream;
				$("#divSelfie").css("display", "block");

			})
			.catch(function (error) {
				//all errors here
				console.log("There was an error", error);
				//then show the image picker, because the camera doesn't work
				$("#pickImage").css("display", "block")
			})
	}

}
function captureImage() {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			var mediaStreamTrack = stream.getVideoTracks()[0];
			var imageCapture = new ImageCapture(mediaStreamTrack);
			var img = document.querySelector('#fotoselfie');
			imageCapture.takePhoto()
				.then(blob => {
					img.src = URL.createObjectURL(blob);
					img.onload = () => { URL.revokeObjectURL(this.src); }
				})
				.catch(error => console.error('takePhoto() error:', error));
		});
}

function pickImage() {
	stopStreaming();
	$("#pickImage").css("display", "block");
}
function stopStreaming() {
	if (videoPlayer) {
		videoPlayer.srcObject.getVideoTracks() //gives access to the running video streams of the object
			.forEach(function (track) {
				track.stop(); // stop all streams
			})
	}
	$("#divSelfie").css("display", "none");
}

function captureImagePick(input) {
	var reader = new FileReader();
	reader.onload = function (e) {
		$("img").attr('src', e.target.result)
	};
	reader.readAsDataURL(input.target.files[0]);
}

$(function () {
	$("#selfieBtn").click(startVideo);
	$("#captureBtn").click(captureImage);
	$("#pickImgBtn").click(pickImage);
	$("#imagePicker").on('change', captureImagePick);
})
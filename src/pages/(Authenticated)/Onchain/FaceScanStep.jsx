import React, { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const FaceScanStep = ({ formik }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  // Start camera and reset previous capture
  const startCamera = () => {
    if (formik.values.cameraRoll) {
      formik.setFieldValue("cameraRoll", null);
      setImgUrl("");
    }
    setErrorMessage("");
    setCameraActive(true);
  };

  useEffect(() => {
    if (!cameraActive) return;

    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setErrorMessage(
          "Cannot access camera. Please allow camera permissions and use HTTPS."
        );
        setCameraActive(false);
      }
    };

    startVideoStream();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  // Countdown and capture
  const startCountdownAndCapture = () => {
    let counter = 3;
    setCountdown(counter);
    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        captureSnapshot();
      }
    }, 1000);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setErrorMessage("Failed to capture image.");
        return;
      }

      if (video.srcObject) {
        video.srcObject.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
      setCountdown(0);

      await uploadCapturedImage(blob);
    }, "image/png");
  };

  const uploadCapturedImage = async (blob) => {
    try {
      setErrorMessage("");
      setProgresspercent(0);

      const formData = new FormData();
      formData.append("file", blob, "face.png");

      const timestamp = new Date().getTime();
      const uploadRes = await axios.post(
        `${baseURL}/upload?timestamp=${timestamp}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setProgresspercent(Math.round((e.loaded / e.total) * 100)),
        }
      );

      const { fileUrl } = uploadRes.data;
      if (!fileUrl) throw new Error("Upload failed");

      formik.setFieldValue("cameraRoll", fileUrl);
      setImgUrl(fileUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#101214]/60 backdrop-blur-xl border border-[#2a2e38] shadow-xl rounded-2xl p-4 sm:p-5 max-w-sm w-full mx-auto space-y-4 text-white transition-all duration-300">
      <div className="flex justify-center items-center">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-md">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      <p className="text-sm text-center text-gray-300 font-light leading-relaxed">
        Please perform a secure facial scan to continue your identity verification.
      </p>

      {!cameraActive && !formik.values.cameraRoll && (
        <button
          type="button"
          onClick={startCamera}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white py-2 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition-all"
        >
          Start Camera
        </button>
      )}

      {cameraActive && !formik.values.cameraRoll && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg border border-gray-700 aspect-video object-cover w-full"
          />
          {countdown > 0 ? (
            <div className="text-center text-4xl font-extrabold text-indigo-400 tracking-widest mt-2 select-none animate-pulse">
              {countdown}
            </div>
          ) : (
            <button
              type="button"
              onClick={startCountdownAndCapture}
              className="w-full mt-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition-all"
            >
              Capture Face
            </button>
          )}
        </>
      )}

      {formik.values.cameraRoll && (
        <div className="flex flex-col items-center w-full space-y-3">
          <p className="text-xs text-gray-400">Captured Image:</p>
          <img
            src={formik.values.cameraRoll}
            alt="Captured face"
            className="rounded-lg border border-gray-700 w-full aspect-video object-cover shadow"
          />
          <button
            type="button"
            onClick={startCamera}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white py-2 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition-all"
          >
            Retake
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="text-xs text-center text-red-500 font-medium">
          {errorMessage}
        </div>
      )}

      {progresspercent > 0 && progresspercent < 100 && (
        <div className="text-xs text-center text-gray-400">
          Uploading: {progresspercent}%
        </div>
      )}
    </div>
  );
};

export default FaceScanStep;
// Note: Ensure you have the necessary permissions and HTTPS setup for camera access.
// This component handles camera access, countdown, image capture, and upload.
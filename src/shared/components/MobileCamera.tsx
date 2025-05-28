import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Camera, RotateCcw, CheckCircle, AlertCircle, X } from "lucide-react";

interface MobileCameraProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  guideline?: {
    type: "student-id" | "item" | "lockbox";
    message: string;
  };
  maxFileSize?: number; // MB
}

export default function MobileCamera({
  onCapture,
  onClose,
  guideline,
  maxFileSize = 5,
}: MobileCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 카메라 스트림 시작
  const startCamera = useCallback(async () => {
    try {
      setError("");

      // 이전 스트림 정리
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.error("카메라 액세스 오류:", err);
      setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
    }
  }, [facingMode, stream]);

  // 카메라 전환
  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  // 사진 촬영
  const takePicture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // 캔버스 크기를 비디오 크기에 맞춤
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 프레임을 캔버스에 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 이미지 품질 최적화 (JPEG, 품질 0.8)
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // 파일 크기 확인
          const fileSizeMB = blob.size / (1024 * 1024);
          if (fileSizeMB > maxFileSize) {
            setError(
              `파일 크기가 너무 큽니다. ${maxFileSize}MB 이하로 촬영해주세요.`
            );
            setIsProcessing(false);
            return;
          }

          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          setIsProcessing(false);
        }
      },
      "image/jpeg",
      0.8
    );
  }, [isStreaming, maxFileSize]);

  // 촬영된 사진 확인
  const confirmCapture = useCallback(() => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
        }
      },
      "image/jpeg",
      0.8
    );
  }, [capturedImage, onCapture]);

  // 다시 촬영
  const retakePicture = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
  }, [capturedImage]);

  // 컴포넌트 마운트 시 카메라 시작
  useEffect(() => {
    startCamera();

    return () => {
      // 컴포넌트 언마운트 시 스트림 정리
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, []);

  // facingMode 변경 시 카메라 재시작
  useEffect(() => {
    if (stream) {
      startCamera();
    }
  }, [facingMode]);

  // 가이드라인 메시지
  const getGuidelineMessage = () => {
    if (!guideline) return "사진을 촬영해주세요";

    switch (guideline.type) {
      case "student-id":
        return "학생증이 화면에 잘 보이도록 촬영해주세요";
      case "item":
        return "물품의 전체적인 상태가 보이도록 촬영해주세요";
      case "lockbox":
        return "보관함 문이 잠겨있는 모습을 촬영해주세요";
      default:
        return guideline.message;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 bg-black/50 text-white">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">사진 촬영</h1>
        <button
          onClick={switchCamera}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          disabled={!isStreaming}
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* 카메라 뷰 또는 촬영된 이미지 */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {error ? (
          <div className="text-center text-white p-8">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : capturedImage ? (
          <Image
            src={capturedImage}
            alt="촬영된 사진"
            fill
            className="object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            />

            {/* 가이드라인 오버레이 */}
            {guideline && guideline.type === "student-id" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-52 border-2 border-white/70 rounded-lg relative">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
                    학생증을 이 영역에 맞춰주세요
                  </div>
                </div>
              </div>
            )}

            {/* 로딩 상태 */}
            {!isStreaming && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p>카메라 준비 중...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 가이드라인 메시지 */}
      <div className="px-4 py-2 bg-black/70 text-white text-center text-sm">
        {getGuidelineMessage()}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="p-6 bg-black/50">
        {capturedImage ? (
          <div className="flex justify-center space-x-4">
            <button
              onClick={retakePicture}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              다시 촬영
            </button>
            <button
              onClick={confirmCapture}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              사용하기
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={takePicture}
              disabled={!isStreaming || isProcessing}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              ) : (
                <Camera className="w-8 h-8 text-gray-800" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 숨겨진 캔버스 (이미지 처리용) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

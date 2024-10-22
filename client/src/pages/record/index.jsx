import React, { useState, useCallback } from "react";

const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();

  const onRecAudio = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
          };
        } else {
          setOnRec(false);
        }
      };
    });
  };

  const offRecAudio = () => {
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });
    media.stop();
    analyser.disconnect();
    source.disconnect();
  };

  const onSubmitAudioFile = useCallback(() => {
    if (audioUrl) {
      const sound = new File([audioUrl], "soundBlob", {
        lastModified: new Date().getTime(),
        type: "audio/wav", // 적절한 MIME 타입 지정
      });

      const formData = new FormData();
      formData.append("file", sound);

      // 서버에 오디오 파일 전송
      fetch("http://localhost:5000/whisper", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("변환된 텍스트:", data.response);
        })
        .catch((error) => {
          console.error("오류 발생:", error);
        });
    }
  }, [audioUrl]);

  return (
    <>
      <button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button>
      <button onClick={onSubmitAudioFile}>결과 확인</button>
    </>
  );
};

export default AudioRecord;

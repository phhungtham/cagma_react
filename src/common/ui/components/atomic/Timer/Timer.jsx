import React, { useEffect, useRef, useState } from 'react';

const Timer = ({ onClose,refresh, setRefresh }) => {
  const [seconds, setSeconds] = useState(60);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          onClose();
          clearInterval(timerRef.current);

          return prevSeconds;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const resetTimer = () => {
    setSeconds(60);
    clearInterval(timerRef.current);
    startTimer();
    setRefresh(!refresh);
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="qr__timer__container">
      <p className="qr__timer">{formatTime(seconds)}</p>
      <button className="qr__timer__refresh" onClick={resetTimer}>
        Refresh
      </button>
    </div>
  );
};

export default Timer;

'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = root?.querySelector<HTMLVideoElement>('.backdrop__video');
    if (!root || !video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const play = () => {
      video.play().catch(() => {});
    };

    play();
    video.addEventListener('loadeddata', play);
    video.addEventListener('canplay', play);

    const resume = () => {
      if (video.paused) play();
    };

    document.addEventListener('visibilitychange', resume);
    window.addEventListener('pageshow', resume);

    return () => {
      video.pause();
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('pageshow', resume);
    };
  }, []);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      <video
        className="backdrop__video is-active"
        poster="/images/bg-1.jpg"
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>
      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}

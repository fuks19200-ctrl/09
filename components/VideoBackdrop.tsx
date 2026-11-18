'use client';

import { useEffect, useRef } from 'react';

type LenisScrollEvent = CustomEvent<{
  scroll: number;
  isScrolling?: boolean;
}>;

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = root?.querySelector<HTMLCanvasElement>('.backdrop__canvas');

    if (!root || !canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>('.backdrop__video'),
    );

    if (videos.length !== 3) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const mobile = window.matchMedia('(max-width: 700px)');

    const posters = [1, 2, 3].map((n) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = `/images/bg-${n}.jpg`;
      return image;
    });

    /*
     * IMPORTANT:
     * The background is a single scroll-controlled film.
     *
     * We do NOT interpolate the video position with a second animation
     * loop. That was the source of the "lag -> hand suddenly appears ->
     * hole" effect.
     *
     * Lenis already gives us the smooth scroll position. The video must
     * follow that position directly, frame by frame.
     */

    let progress = 0;
    let lastScroll = window.scrollY;
    let activeIndex = 0;
    let timeline: Array<[number, number]> = [];
    let dirty = true;
    let drawRaf = 0;
    let raf = 0;
    let lastSeekAt = 0;
    let lastSeekProgress = -1;
    let loaded = [false, false, false];

    /*
     * The three source clips are not separate scenes.
     * Clip 2 starts from a later frame because its first several seconds
     * repeat the hand that already exists at the end of clip 1.
     *
     * Clip 3 starts from its first frame.
     */
    const clipStartOffset = [0, 5.2, 0] as const;

    const clamp = (
      value: number,
      min = 0,
      max = 1,
    ) => Math.max(min, Math.min(max, value));

    const documentTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + window.scrollY;

    const refreshSceneAnchors = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      const section = (selector: string) =>
        document.querySelector<HTMLElement>(selector);

      const focal = (selector: string) => {
        const el = section(selector);
        if (!el) return 0;

        return (
          documentTop(el) +
          (el.offsetHeight - window.innerHeight) * 0.5
        );
      };

      const courses = section('#courses');

      if (!courses) return;

      /*
       * These are deliberate STORY beats, not equal thirds.
       *
       * 0.00        — opening / hand enters
       * 0.105       — first transformation
       * 0.19        — creation sequence
       * 0.2917      — transition into clip 2
       * 0.3479      — clip 2 transformation
       * 0.53        — contact / later transformation
       * 0.65        — FAQ
       * 0.82        — final transformation
       * 1.00        — final frame
       */
      const raw: Array<[number, number]> = [
        [0, 0],
        [focal('#method'), 0.105],
        [focal('#about'), 0.19],
        [
          documentTop(courses) - window.innerHeight * 0.2,
          7 / 24,
        ],
        [
          documentTop(courses) +
            courses.offsetHeight -
            window.innerHeight * 0.3,
          8.35 / 24,
        ],
        [focal('#contact'), 0.53],
        [focal('#faq'), 0.65],
        [
          Math.min(
            maxScroll - window.innerHeight * 0.2,
            focal('.section--bottom'),
          ),
          0.82,
        ],
        [maxScroll, 1],
      ];

      timeline = [];

      for (const [position, frame] of raw) {
        const y = Math.max(
          0,
          Math.min(maxScroll, position),
        );

        if (
          timeline.length &&
          y <= timeline[timeline.length - 1][0]
        ) {
          continue;
        }

        timeline.push([y, frame]);
      }

      if (
        !timeline.length ||
        timeline[timeline.length - 1][0] < maxScroll
      ) {
        timeline.push([maxScroll, 1]);
      }
    };

    const filmProgress = (scrollY: number) => {
      if (!timeline.length) return 0;

      for (let i = 1; i < timeline.length; i += 1) {
        const [end, to] = timeline[i];
        const [start, from] = timeline[i - 1];

        if (scrollY <= end) {
          return (
            from +
            (to - from) *
              clamp(
                (scrollY - start) /
                  Math.max(1, end - start),
              )
          );
        }
      }

      return 1;
    };

    /*
     * Scene boundaries are intentionally not based on arbitrary thirds.
     * The clips are selected from the actual film progress so a clip
     * cannot unexpectedly restart at a visual beat.
     */
    const getSceneIndex = (value: number) => {
      if (value < 7 / 24) return 0;
      if (value < 8.35 / 24) return 1;
      return 2;
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        mobile.matches ? 1 : 1.25,
      );

      canvas.width = Math.max(
        1,
        Math.round(rect.width * dpr),
      );

      canvas.height = Math.max(
        1,
        Math.round(rect.height * dpr),
      );

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      dirty = true;
      scheduleDraw();
    };

    const drawSource = (
      index: number,
      alpha = 1,
    ) => {
      const video = videos[index];
      const poster = posters[index];

      const source: CanvasImageSource | null =
        !mobile.matches &&
        video.readyState >= 2 &&
        video.videoWidth > 0
          ? video
          : poster.complete &&
              poster.naturalWidth > 0
            ? poster
            : null;

      if (!source) return false;

      const sourceWidth =
        video.videoWidth ||
        poster.naturalWidth ||
        1920;

      const sourceHeight =
        video.videoHeight ||
        poster.naturalHeight ||
        1080;

      const width = canvas.width / (
        Math.min(
          window.devicePixelRatio || 1,
          mobile.matches ? 1 : 1.25,
        )
      );

      const height = canvas.height / (
        Math.min(
          window.devicePixelRatio || 1,
          mobile.matches ? 1 : 1.25,
        )
      );

      const canvasAspect =
        width / Math.max(1, height);

      const sourceAspect =
        sourceWidth / sourceHeight;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceAspect > canvasAspect) {
        drawWidth =
          height * sourceAspect;

        offsetX =
          (width - drawWidth) / 2;
      } else {
        drawHeight =
          width / sourceAspect;

        offsetY =
          (height - drawHeight) / 2;
      }

      ctx.globalAlpha = alpha;

      ctx.drawImage(
        source,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

      return true;
    };

    const draw = () => {
      drawRaf = 0;

      if (!dirty) return;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        mobile.matches ? 1 : 1.25,
      );

      const width =
        canvas.width / dpr;

      const height =
        canvas.height / dpr;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#090609';

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      /*
       * NO CROSSFADE.
       *
       * A crossfade between two videos was visually wrong because
       * both clips contain the hand. The old frame must end, then the
       * next clip must continue from its continuity frame.
       */
      drawSource(
        activeIndex,
        1,
      );

      ctx.globalAlpha = 1;

      dirty = false;
    };

    function scheduleDraw() {
      dirty = true;

      if (drawRaf) return;

      drawRaf =
        requestAnimationFrame(draw);
    }

    const stopVideo =
      (index: number) => {
        const video = videos[index];

        video.pause();

        /*
         * The videos are NEVER allowed to autoplay.
         * currentTime is controlled exclusively by scroll.
         */
      };

    const ensureVideoLoaded =
      (index: number) => {
        if (
          mobile.matches ||
          reducedMotion.matches ||
          loaded[index]
        ) {
          return;
        }

        loaded[index] = true;

        const video =
          videos[index];

        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.loop = false;
        video.autoplay = false;

        /*
         * Preload the entire source once. This prevents a black frame
         * or a delayed "hand suddenly appears" frame when crossing a
         * clip boundary.
         */
        video.load();
      };

    const setScene =
      (nextIndex: number) => {
        if (
          nextIndex === activeIndex
        ) {
          return;
        }

        activeIndex = nextIndex;

        const video =
          videos[activeIndex];

        ensureVideoLoaded(
          activeIndex,
        );

        const startAt =
          clipStartOffset[
            activeIndex
          ];

        const setStart = () => {
          try {
            video.currentTime =
              Math.min(
                startAt,
                Math.max(
                  0,
                  video.duration - 0.05,
                ),
              );
          } catch {}

          video.pause();

          dirty = true;
          scheduleDraw();
        };

        if (
          video.readyState >= 1
        ) {
          setStart();
        } else {
          video.addEventListener(
            'loadedmetadata',
            setStart,
            { once: true },
          );
        }
      };

    /*
     * This is the critical part.
     *
     * There is NO easing from target -> progress.
     * When Lenis reports a new scroll position, the film jumps to
     * exactly that frame. Lenis itself remains smooth.
     */
    const syncVideoToScroll =
      () => {
        if (
          mobile.matches ||
          reducedMotion.matches
        ) {
          return;
        }

        const video =
          videos[activeIndex];

        if (
          video.readyState < 2 ||
          !video.duration ||
          !Number.isFinite(
            video.duration,
          )
        ) {
          return;
        }

        const now =
          performance.now();

        /*
         * During rapid wheel input we still seek often enough to feel
         * continuous, but do not spam the decoder with identical seeks.
         */
        if (
          now - lastSeekAt < 16 &&
          Math.abs(
            progress -
              lastSeekProgress,
          ) < 0.001
        ) {
          return;
        }

        const segmentStart =
          activeIndex === 0
            ? 0
            : activeIndex === 1
              ? 7 / 24
              : 8.35 / 24;

        const segmentEnd =
          activeIndex === 0
            ? 7 / 24
            : activeIndex === 1
              ? 8.35 / 24
              : 1;

        const local =
          clamp(
            (progress -
              segmentStart) /
              Math.max(
                0.0001,
                segmentEnd -
                  segmentStart,
              ),
          );

        const start =
          clipStartOffset[
            activeIndex
          ];

        const end =
          Math.max(
            start + 0.1,
            video.duration - 0.04,
          );

        const nextTime =
          start +
          (end - start) *
            local;

        if (
          Math.abs(
            video.currentTime -
              nextTime,
          ) > 0.018
        ) {
          try {
            video.currentTime =
              nextTime;
          } catch {}
        }

        /*
         * NEVER play the video.
         *
         * Scroll is the timeline.
         */
        video.pause();

        lastSeekAt = now;
        lastSeekProgress =
          progress;

        dirty = true;
        scheduleDraw();
      };

    const applyMotion =
      () => {
        /*
         * Only a tiny camera drift remains. It is deterministic and
         * tied directly to scroll, so it cannot continue moving after
         * the user stops scrolling.
         */
        const scale =
          1.045 +
          progress * 0.035;

        const x =
          (progress - 0.5) *
          -16;

        const y =
          (progress - 0.5) *
          -8;

        canvas.style.transform =
          `translate3d(${x}px,${y}px,0) scale(${scale})`;

        canvas.style.transformOrigin =
          '50% 50%';
      };

    const updateFromScroll =
      (scrollY: number) => {
        lastScroll =
          Math.max(0, scrollY);

        const maxScroll =
          Math.max(
            1,
            document.documentElement
              .scrollHeight -
              window.innerHeight,
          );

        const normalized =
          clamp(
            lastScroll /
              maxScroll,
          );

        /*
         * DIRECT MAPPING:
         * no second easing layer.
         */
        progress =
          filmProgress(
            normalized *
              maxScroll,
          );

        const nextIndex =
          getSceneIndex(
            progress,
          );

        if (
          nextIndex !==
          activeIndex
        ) {
          setScene(
            nextIndex,
          );
        }

        ensureVideoLoaded(
          activeIndex,
        );

        syncVideoToScroll();
        applyMotion();

        const shade =
          root.querySelector<HTMLElement>(
            '.backdrop__shade',
          );

        const readability =
          root.querySelector<HTMLElement>(
            '.backdrop__readability',
          );

        const darkness =
          clamp(
            (lastScroll -
              window.innerHeight *
                0.35) /
              Math.max(
                1,
                window.innerHeight *
                  0.55,
              ),
          );

        if (shade) {
          shade.style.opacity =
            String(
              0.55 *
                darkness,
            );
        }

        if (readability) {
          readability.style.opacity =
            String(
              1 - darkness,
            );
        }

        scheduleDraw();
      };

    const stopImmediately =
      () => {
        videos.forEach(
          (video) =>
            video.pause(),
        );
      };

    const onNativeScroll =
      () => {
        updateFromScroll(
          window.scrollY,
        );
      };

    const onLenisScroll =
      (
        event: LenisScrollEvent,
      ) => {
        updateFromScroll(
          event.detail.scroll,
        );

        /*
         * Lenis tells us the scroll has stopped.
         * Freeze the exact current video frame immediately.
         */
        if (
          event.detail
            .isScrolling === false
        ) {
          stopImmediately();
        }
      };

    const onResize =
      () => {
        refreshSceneAnchors();
        resize();
        updateFromScroll(
          lastScroll,
        );
      };

    const onMediaChange =
      () => {
        if (mobile.matches) {
          videos.forEach(
            (video) => {
              video.pause();
              video.removeAttribute(
                'src',
              );
              video.load();
            },
          );

          loaded = [
            false,
            false,
            false,
          ];

          activeIndex = 0;
          resize();
          scheduleDraw();
        } else {
          ensureVideoLoaded(
            activeIndex,
          );

          updateFromScroll(
            lastScroll,
          );
        }
      };

    videos.forEach(
      (video, index) => {
        video.loop = false;
        video.autoplay = false;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';

        video.addEventListener(
          'loadeddata',
          () => {
            if (
              index ===
              activeIndex
            ) {
              syncVideoToScroll();
              scheduleDraw();
            }
          },
        );

        video.addEventListener(
          'canplay',
          () => {
            if (
              index ===
              activeIndex
            ) {
              syncVideoToScroll();
              scheduleDraw();
            }
          },
        );
      },
    );

    posters.forEach(
      (poster) =>
        poster.addEventListener(
          'load',
          scheduleDraw,
        ),
    );

    refreshSceneAnchors();

    progress =
      filmProgress(
        lastScroll,
      );

    activeIndex =
      getSceneIndex(
        progress,
      );

    resize();

    if (
      !mobile.matches &&
      !reducedMotion.matches
    ) {
      /*
       * Load current + next clip before the user reaches the boundary.
       * This is the key fix for the sudden hand/black frame.
       */
      ensureVideoLoaded(
        activeIndex,
      );

      if (
        activeIndex < 2
      ) {
        ensureVideoLoaded(
          activeIndex + 1,
        );
      }

      videos.forEach(
        (video) =>
          video.pause(),
      );
    }

    updateFromScroll(
      lastScroll,
    );

    /*
     * Background is completely paused after initial positioning.
     */
    stopImmediately();

    window.addEventListener(
      'resize',
      onResize,
    );

    window.addEventListener(
      'scroll',
      onNativeScroll,
      { passive: true },
    );

    window.addEventListener(
      'multum-lenis-scroll',
      onLenisScroll as EventListener,
    );

    mobile.addEventListener(
      'change',
      onMediaChange,
    );

    const observer =
      new ResizeObserver(
        () => {
          refreshSceneAnchors();
          updateFromScroll(
            lastScroll,
          );
        },
      );

    observer.observe(
      document.querySelector(
        'main',
      ) || root,
    );

    const fontsReady =
      document.fonts?.ready.then(
        () => {
          refreshSceneAnchors();
          updateFromScroll(
            lastScroll,
          );
          scheduleDraw();
        },
      );

    return () => {
      window.removeEventListener(
        'resize',
        onResize,
      );

      window.removeEventListener(
        'scroll',
        onNativeScroll,
      );

      window.removeEventListener(
        'multum-lenis-scroll',
        onLenisScroll as EventListener,
      );

      mobile.removeEventListener(
        'change',
        onMediaChange,
      );

      if (raf) {
        cancelAnimationFrame(
          raf,
        );
      }

      if (drawRaf) {
        cancelAnimationFrame(
          drawRaf,
        );
      }

      observer.disconnect();

      void fontsReady;

      videos.forEach(
        (video) => {
          video.pause();
          video.removeAttribute(
            'src',
          );
          video.load();
        },
      );
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="backdrop"
      aria-hidden="true"
    >
      <div className="backdrop__readability" />
      <canvas className="backdrop__canvas" />

      <video
        className="backdrop__video"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/videos/bloom-bg-1.mp4"
          type="video/mp4"
        />
      </video>

      <video
        className="backdrop__video"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/videos/bloom-bg-2.mp4"
          type="video/mp4"
        />
      </video>

      <video
        className="backdrop__video"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/videos/bloom-bg-3.mp4"
          type="video/mp4"
        />
      </video>

      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}

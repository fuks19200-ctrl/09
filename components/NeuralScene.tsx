'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Scene = dynamic(() => import('./NeuralSceneInner'), { ssr: false });

export default function NeuralScene() {
  return (
    <div className="neural-scene" aria-hidden="true">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}

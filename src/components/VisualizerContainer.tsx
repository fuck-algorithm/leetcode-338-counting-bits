import { useState } from 'react'
import CountingBitsLesson from './CountingBitsLesson'
import type { LessonAlgorithm } from '../teaching/countingBits'

export default function VisualizerContainer() {
  const [algorithm, setAlgorithm] = useState<LessonAlgorithm>('brianKernighan')
  const [n, setN] = useState(13)

  return (
    <CountingBitsLesson
      algorithm={algorithm}
      n={n}
      onAlgorithmChange={setAlgorithm}
      onNChange={setN}
    />
  )
}

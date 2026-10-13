import { useEffect, useMemo, useState } from 'react'
import AlgorithmSelector from './AlgorithmSelector'
import {
  algorithmLessons,
  buildLessonSteps,
  type LessonAlgorithm,
  type LessonStep,
} from '../teaching/countingBits'

interface CountingBitsLessonProps {
  algorithm: LessonAlgorithm
  n: number
  onAlgorithmChange: (_selectedAlgorithm: LessonAlgorithm) => void
  onNChange: (_nextN: number) => void
}

const comparisonFormulas = [
  ['逐个数 1', 'x = x & (x − 1)'],
  ['最高位', 'bits[i] = bits[i − highBit] + 1'],
  ['最低位', 'bits[i] = bits[i >> 1] + (i & 1)'],
  ['清除最低位', 'bits[i] = bits[i & (i − 1)] + 1'],
]


function BinaryBits({ value, active = false }: { value: number; active?: boolean }) {
  const binary = value.toString(2)
  return (
    <div className={`binary-bits ${active ? 'binary-bits-active' : ''}`} aria-label={`${value} 的二进制 ${binary}`}>
      {binary.split('').map((bit, index) => (
        <span className={bit === '1' ? 'bit-one' : 'bit-zero'} key={`${index}-${bit}`}>{bit}</span>
      ))}
    </div>
  )
}

function CountArray({ step, n }: { step: LessonStep; n: number }) {
  return (
    <div className="answer-array" role="list" aria-label="从 0 到 n 的 1 的个数">
      {Array.from({ length: n + 1 }, (_, value) => {
        const hasResult = value < step.results.length
        const isCurrent = step.phase !== 'complete' && value === step.number
        return (
          <div
            className={`answer-cell ${hasResult ? 'answer-cell-complete' : 'answer-cell-pending'} ${isCurrent ? 'answer-cell-current' : ''}`}
            key={value}
            role="listitem"
            aria-label={`${value} 的 1 的个数：${hasResult ? step.results[value] : '待计算'}`}
          >
            <span className="answer-number">{value}</span>
            <strong>{hasResult ? step.results[value] : '·'}</strong>
          </div>
        )
      })}
    </div>
  )
}

function StepReason({ algorithm, step }: { algorithm: LessonAlgorithm; step: LessonStep }) {
  if (step.phase === 'start') {
    return <div className="reason-equation"><span>bits[0]</span><b>=</b><strong>0</strong></div>
  }

  if (step.phase === 'complete') {
    return <div className="reason-equation"><span>bits[0…n]</span><b>=</b><strong>{step.results.join(', ')}</strong></div>
  }

  if (algorithm === 'comparison') {
    return (
      <div className="reason-equation">
        <span>bits[{step.number}]</span><b>=</b><strong>{step.ones}</strong><span className="equation-caption">四种方法都会得到这个答案</span>
      </div>
    )
  }

  if (algorithm === 'brianKernighan') {
    return (
      <div className="reason-equation">
        <span>{step.binary}₂</span><b>→</b><strong>{step.operationCount} 次清除</strong><b>=</b><strong>{step.ones} 个 1</strong>
      </div>
    )
  }

  if (algorithm === 'dpHighestBit') {
    return (
      <div className="reason-equation">
        <span>bits[{step.number}]</span><b>=</b><span>bits[{step.dependency}]</span><b>+</b><span className="equation-accent">1</span><b>=</b><strong>{step.ones}</strong>
      </div>
    )
  }

  if (algorithm === 'dpLowestBit') {
    return (
      <div className="reason-equation">
        <span>bits[{step.number}]</span><b>=</b><span>bits[{step.dependency}]</span><b>+</b><span className="equation-accent">{step.bit}</span><b>=</b><strong>{step.ones}</strong>
      </div>
    )
  }

  return (
    <div className="reason-equation">
      <span>bits[{step.number}]</span><b>=</b><span>bits[{step.dependency}]</span><b>+</b><span className="equation-accent">1</span><b>=</b><strong>{step.ones}</strong>
    </div>
  )
}

function BitClearing({ step }: { step: LessonStep }) {
  if (!step.operations.length) return null
  const states = [...step.operations, 0]
  return (
    <div className="bit-clearing" aria-label="逐次清除最低位的 1">
      {states.map((value, index) => (
        <div className="clear-state" key={`${value}-${index}`}>
          <BinaryBits value={value} active={index < states.length - 1} />
          {index < states.length - 1 && <span className="clear-arrow" aria-hidden="true">↓ 清除最右边的 1</span>}
        </div>
      ))}
      <span className="clear-total">清除了 {step.operationCount} 个 1</span>
    </div>
  )
}

export default function CountingBitsLesson({ algorithm, n, onAlgorithmChange, onNChange }: CountingBitsLessonProps) {
  const [stepIndex, setStepIndex] = useState(1)
  const [playing, setPlaying] = useState(false)
  const steps = useMemo(() => buildLessonSteps(algorithm, n), [algorithm, n])
  const step = steps[Math.min(stepIndex, steps.length - 1)]
  const currentLesson = algorithmLessons.find(item => item.id === algorithm)
  const finished = stepIndex >= steps.length - 1

  useEffect(() => {
    setStepIndex(1)
    setPlaying(false)
  }, [algorithm, n])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setStepIndex(index => {
        if (index >= steps.length - 1) {
          setPlaying(false)
          return index
        }
        return index + 1
      })
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setPlaying(false)
        setStepIndex(index => Math.min(steps.length - 1, index + 1))
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setPlaying(false)
        setStepIndex(index => Math.max(0, index - 1))
      } else if (event.key === ' ') {
        event.preventDefault()
        if (finished) setStepIndex(0)
        setPlaying(value => !value)
      } else if (event.key.toLowerCase() === 'r') {
        setPlaying(false)
        setStepIndex(1)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [finished, steps.length])

  const move = (delta: number) => {
    setPlaying(false)
    setStepIndex(index => Math.max(0, Math.min(steps.length - 1, index + delta)))
  }

  return (
    <div className="lesson-shell">
      <header className="lesson-header">
        <div className="lesson-heading">
          <div className="lesson-title-line">
            <span className="problem-number">338</span>
            <h1>比特位计数</h1>
          </div>
          <p>算出 0 到 n，每个数的二进制里有几个 1。</p>
        </div>
        <label className="limit-control">
          <span>算到</span>
          <span className="limit-n">n =</span>
          <input
            type="number"
            min="0"
            max="30"
            value={n}
            aria-label="设置上限 n，范围 0 到 30"
            onChange={event => {
              const value = Number(event.target.value)
              if (Number.isInteger(value) && value >= 0 && value <= 30) onNChange(value)
            }}
          />
        </label>
      </header>

      <AlgorithmSelector currentAlgorithm={algorithm} onSelectAlgorithm={onAlgorithmChange} />

      <main className="lesson-content">
        <section className="lesson-focus" aria-live="polite">
          <div className="focus-topline">
            <div className="focus-step">{step.phase === 'start' ? '从起点开始' : step.phase === 'complete' ? '全部算完' : `正在计算第 ${step.number} 个数`}</div>
            <div className="focus-counter">{stepIndex + 1} <span>/</span> {steps.length}</div>
          </div>

          <div className="number-workbench">
            <div className="number-display">
              <span className="field-label">当前数字</span>
              <strong>{step.number}</strong>
            </div>
            <div className="binary-display-new">
              <span className="field-label">二进制</span>
              <BinaryBits value={step.number} active />
              <div className="bit-place-values" aria-hidden="true">
                {step.binary.split('').map((_, index) => <span key={index}>2<sup>{step.binary.length - index - 1}</sup></span>)}
              </div>
            </div>
            <div className="answer-display">
              <span className="field-label">其中 1 的个数</span>
              <strong>{step.ones}</strong>
            </div>
          </div>

          <div className="reason-panel">
            <div className="reason-heading">
              <span>{algorithm === 'comparison' ? '同一个答案，不同的推导' : currentLesson?.title}</span>
              <code>{algorithm === 'comparison' ? 'bits[i]' : currentLesson?.formula}</code>
            </div>
            <StepReason algorithm={algorithm} step={step} />
            <p className="reason-copy">{step.phase === 'start' ? 'bits[i] 表示数字 i 的二进制中，1 的数量。先从 0 开始，答案就是 0。' : step.explanation}</p>
            {algorithm === 'brianKernighan' && step.phase === 'compute' && <BitClearing step={step} />}
            {algorithm === 'dpHighestBit' && step.phase === 'compute' && <div className="dependency-note"><span>{step.number} = {step.highBit} + {step.dependency}</span><small>最高位是 2 的幂，只贡献 1；剩下的 {step.dependency} 已经算过。</small></div>}
            {algorithm === 'dpLowestBit' && step.phase === 'compute' && <div className="dependency-note"><span>{step.number}{' >> 1'} = {step.dependency} · {step.number}{' & 1'} = {step.bit}</span><small>右移拿到旧答案，最低位决定要不要多加 1。</small></div>}
            {algorithm === 'dpLeastSignificantBit' && step.phase === 'compute' && <div className="dependency-note"><span>{step.number} & ({step.number} − 1) = {step.dependency}</span><small>清掉一个 1 后，直接复用 {step.dependency} 的答案 {step.dependencyBits}。</small></div>}
            {algorithm === 'comparison' && (
              <div className="formula-list">
                {comparisonFormulas.map(([name, formula]) => <div key={name}><span>{name}</span><code>{formula}</code></div>)}
              </div>
            )}
          </div>

          <div className="array-heading">
            <div><strong>答案数组</strong><span>每一格对应一个数字</span></div>
            <span>{step.results.length} / {n + 1} 已完成</span>
          </div>
          <CountArray step={step} n={n} />
        </section>
      </main>

      <footer className="lesson-controls" aria-label="演示控制">
        <button className="control-icon" onClick={() => move(-1)} disabled={stepIndex === 0} aria-label="上一步" title="上一步（←）">←</button>
        <button className="control-play" onClick={() => {
          if (finished) setStepIndex(1)
          setPlaying(value => !value)
        }} aria-label={playing ? '暂停' : '播放'} title="播放/暂停（空格）">{playing ? 'Ⅱ' : '▶'}</button>
        <button className="control-icon" onClick={() => move(1)} disabled={finished} aria-label="下一步" title="下一步（→）">→</button>
        <div className="timeline-control">
          <input aria-label="演示进度" type="range" min="0" max={steps.length - 1} value={stepIndex} onChange={event => {
            setPlaying(false)
            setStepIndex(Number(event.target.value))
          }} />
          <span>步骤 {stepIndex + 1} / {steps.length}</span>
        </div>
        <button className="control-reset" onClick={() => {
          setPlaying(false)
          setStepIndex(1)
        }} title="重新开始（R）">重新开始</button>
        <span className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd> 步进 <kbd>空格</kbd> 播放 <kbd>R</kbd> 重置</span>
      </footer>
    </div>
  )
}

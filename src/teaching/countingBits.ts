import {
  countBitsBrianKernighan,
  countBitsDPHighestBit,
  countBitsDPLowestBit,
  countBitsDPLeastSignificantBit,
} from '../algorithms/index.ts'

export type LessonAlgorithm = 'brianKernighan' | 'dpHighestBit' | 'dpLowestBit' | 'dpLeastSignificantBit' | 'comparison'

export interface AlgorithmLesson {
  id: LessonAlgorithm
  shortName: string
  navLabel: string
  title: string
  idea: string
  formula: string
  explanation: string
  dependency: (value: number) => number | null
  compute: (limit: number) => number[]
}

export interface LessonStep {
  number: number
  binary: string
  ones: number
  dependency: number | null
  dependencyBits: number | null
  bit: number | null
  highBit: number | null
  operations: number[]
  operationCount: number
  phase: 'start' | 'compute' | 'complete'
  results: number[]
  explanation: string
}

const highBit = (value: number) => 2 ** Math.floor(Math.log2(value))

export const algorithmLessons: AlgorithmLesson[] = [
  {
    id: 'brianKernighan',
    shortName: '逐个数 1',
    navLabel: '消掉一个 1',
    title: '每次消掉最低位的 1',
    idea: '一个数里有几个 1，就能消掉几次。',
    formula: 'x = x & (x − 1)',
    explanation: 'x 和 x−1 做按位与，会刚好清除 x 最右边的那个 1。重复到 0，操作次数就是答案。',
    dependency: () => null,
    compute: countBitsBrianKernighan,
  },
  {
    id: 'dpHighestBit',
    shortName: '找最高位',
    navLabel: '拆出最高位',
    title: '最高位之外，答案以前算过',
    idea: '去掉最高位的 1，剩下的是一个更小的数。',
    formula: 'bits[i] = bits[i − highBit] + 1',
    explanation: 'highBit 是不超过 i 的最大 2 的幂。它的二进制只有一个 1，所以加上剩余部分的答案即可。',
    dependency: value => value === 0 ? null : value - highBit(value),
    compute: countBitsDPHighestBit,
  },
  {
    id: 'dpLowestBit',
    shortName: '看最低位',
    navLabel: '右移一位',
    title: '右移一位，再看被移出的位',
    idea: '右移后的数已经有答案；最低位若是 1，再加一。',
    formula: 'bits[i] = bits[i >> 1] + (i & 1)',
    explanation: '右移会去掉最右边一位。i & 1 只可能是 0 或 1，代表这位有没有贡献一个 1。',
    dependency: value => value === 0 ? null : value >> 1,
    compute: countBitsDPLowestBit,
  },
  {
    id: 'dpLeastSignificantBit',
    shortName: '清除最低位',
    navLabel: '清除最低的 1',
    title: '清除一个 1，复用剩余答案',
    idea: '把最低位的 1 清掉，结果就来自一个更小的数。',
    formula: 'bits[i] = bits[i & (i − 1)] + 1',
    explanation: 'i & (i−1) 会清除最低位的 1。清除前后 1 的数量只差一个，因此旧答案加一。',
    dependency: value => value === 0 ? null : value & (value - 1),
    compute: countBitsDPLeastSignificantBit,
  },
]

export function buildLessonSteps(algorithm: LessonAlgorithm, n: number): LessonStep[] {
  const boundedN = Math.max(0, Math.min(30, Math.floor(n)))
  const results = algorithm === 'comparison'
    ? countBitsDPLowestBit(boundedN)
    : algorithmLessons.find(item => item.id === algorithm)!.compute(boundedN)
  const lesson = algorithmLessons.find(item => item.id === algorithm)
  const steps: LessonStep[] = [{
    number: 0,
    binary: '0',
    ones: 0,
    dependency: null,
    dependencyBits: null,
    bit: null,
    highBit: null,
    operations: [],
    operationCount: 0,
    phase: 'start',
    results: [0],
    explanation: '从 0 开始。0 的二进制没有 1，所以答案是 0。',
  }]

  for (let value = 1; value <= boundedN; value += 1) {
    const dependency = lesson?.dependency(value) ?? null
    const bit = value & 1
    const operations: number[] = []
    let remaining = value
    while (remaining > 0) {
      operations.push(remaining)
      remaining &= remaining - 1
    }

    const currentResults = results.slice(0, value + 1)
    const explanation = algorithm === 'brianKernighan'
      ? `${value} 的二進制里有 ${results[value]} 个 1；每次清掉一个，正好做 ${results[value]} 次。`
      : algorithm === 'dpHighestBit'
        ? `${value} = ${highBit(value)} + ${dependency}；最高位贡献 1，剩余部分已有答案 ${results[dependency!] }。`
        : algorithm === 'dpLowestBit'
          ? `${value} 右移后是 ${dependency}，最低位是 ${bit}；所以 ${results[dependency!] } + ${bit} = ${results[value]}。`
          : algorithm === 'dpLeastSignificantBit'
            ? `${value} 清除最低位的 1 后变成 ${dependency}；已有 ${results[dependency!] } 个 1，再加被清除的 1。`
            : `${value} 的二进制里有 ${results[value]} 个 1；四种方法都会得到这个答案。`

    steps.push({
      number: value,
      binary: value.toString(2),
      ones: results[value],
      dependency,
      dependencyBits: dependency === null ? null : results[dependency],
      bit: algorithm === 'dpLowestBit' ? bit : null,
      highBit: algorithm === 'dpHighestBit' ? highBit(value) : null,
      operations,
      operationCount: operations.length,
      phase: 'compute',
      results: currentResults,
      explanation,
    })
  }

  steps.push({
    number: boundedN,
    binary: boundedN.toString(2),
    ones: results[boundedN],
    dependency: null,
    dependencyBits: null,
    bit: null,
    highBit: null,
    operations: [],
    operationCount: 0,
    phase: 'complete',
    results,
    explanation: `完成：从 0 到 ${boundedN}，每个数的 1 的个数都已填入答案数组。`,
  })

  return steps
}

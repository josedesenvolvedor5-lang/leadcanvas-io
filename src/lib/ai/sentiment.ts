import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false; // Always fetch models from the hub/CDN
// Keep browser cache on for speed in subsequent loads (default true)

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

let classifierPromise: Promise<any> | null = null;

async function getClassifier() {
  if (!classifierPromise) {
    const useWebGPU = typeof navigator !== 'undefined' && (navigator as any).gpu;
    classifierPromise = pipeline(
      'sentiment-analysis',
      // Multilingual sentiment model (PT/EN/ES...)
      'Xenova/twitter-xlm-roberta-base-sentiment',
      useWebGPU ? { device: 'webgpu' } : undefined
    );
  }
  return classifierPromise;
}

export async function analyzeSentiment(text: string): Promise<{ label: SentimentLabel; score: number }> {
  const classifier = await getClassifier();
  const out = await classifier(text);
  const pred = Array.isArray(out) ? out[0] : out;
  const raw = String(pred.label || '').toLowerCase();
  let label: SentimentLabel = 'neutral';
  if (raw.includes('positive')) label = 'positive';
  else if (raw.includes('negative')) label = 'negative';
  return { label, score: typeof pred.score === 'number' ? pred.score : 0 };
}

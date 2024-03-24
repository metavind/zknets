export * from '@/models/circles/model';

export interface InferenceModel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  compatibleFrameworks: string[];
  inputShape: number[];
  outputShape: number[];
  // run(input: number[]): number[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
}

import { Framework } from '@/frameworks';

export * from '@/models/circles/model';

export interface InferenceModel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  supportedFrameworks: Framework[];
  inputShape: number[];
  inputScalingFactor: number;
  outputShape: number[];
  isClassifier: boolean;
}

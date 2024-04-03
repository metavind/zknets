import { InferenceModel } from '@/models/index';
import { Framework } from '@/frameworks';

export class CirclesModel implements InferenceModel {
  id = 'circles';

  name = 'Circles';

  description = 'Binary classification of concentric circles';

  thumbnail = `/thumbnails/${this.id}.png`;

  supportedFrameworks = [Framework.Circom, Framework.Noir];

  inputShape = [2];

  inputScalingFactor = 1e6;

  outputShape = [1];

  isClassifier = true;
}

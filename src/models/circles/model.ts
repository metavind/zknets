import { InferenceSession, Tensor } from 'onnxruntime-web';
import { InferenceModel } from '@/models/index';
import { Framework } from '@/frameworks';
import { argMax } from '@/utils/array';

export class CirclesModel implements InferenceModel {
  id = 'circles';

  name = 'Circles';

  description = 'Binary classification of concentric circles';

  thumbnail = '/thumbnails/circles.png';

  supportedFrameworks = [Framework.Circom, Framework.Noir];

  inputShape = [2];

  outputShape = [1];

  scalingFactor = 1e6;

  async runInference(input: number[]): Promise<number[]> {
    const session = await InferenceSession.create('models/circles/model.onnx');

    const inputScaled = input.map((elem) =>
      Math.round(elem * this.scalingFactor)
    );

    const tensorData = Float32Array.from(inputScaled);
    const tensor = new Tensor('float32', tensorData, [1, this.inputShape[0]]);

    const outputs = await session.run({ input: tensor });
    const outputTensor = outputs.output;

    const outputData = Array.from(outputTensor.data as Float32Array);

    return [argMax(outputData)];
  }
}

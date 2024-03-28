import { InferenceSession, Tensor } from 'onnxruntime-web';
import { InferenceModel } from '@/models/index';
import { Framework } from '@/frameworks';

export class CirclesModel implements InferenceModel {
  id = 'circles';

  name = 'Circles';

  description = 'Binary classification of concentric circles';

  thumbnail = '/thumbnails/circles_visualization.png';

  supportedFrameworks = [Framework.Noir];

  inputShape = [2];

  outputShape = [1];

  async run(input: number[]): Promise<number[]> {
    const session = await InferenceSession.create(
      'models/circles/model.onnx'
    );

    const tensorData = Float32Array.from(input);
    const tensor = new Tensor('float32', tensorData, [1, this.inputShape[0]]);

    const outputs = await session.run({ input: tensor });
    const outputTensor = outputs.output;

    const outputData = Array.from(outputTensor.data as Float32Array);

    return outputData;
  }
}

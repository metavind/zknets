import { InferenceSession, Tensor } from 'onnxruntime-web';
import { InferenceModel } from '@/models';
import { prepareInputForInference } from '@/utils/math';
import { argMax } from '@/utils/array';

const runInference = async (
  model: InferenceModel,
  input: number[]
): Promise<number[]> => {
  const modelPath = `models/${model.id}/model.onnx`;

  const session = await InferenceSession.create(modelPath);

  const inferenceInput = prepareInputForInference(
    input,
    model.inputScalingFactor
  );

  const tensorData = Float32Array.from(inferenceInput);
  const tensor = new Tensor('float32', tensorData, [1, model.inputShape[0]]);

  const outputs = await session.run({ input: tensor });
  const outputTensor = outputs.output;

  let outputData = Array.from(outputTensor.data as Float32Array);

  if (model.isClassifier) {
    outputData = [argMax(outputData)];
  }

  return outputData;
};

export default runInference;

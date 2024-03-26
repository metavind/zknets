import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { CompiledCircuit } from '@noir-lang/types';

export async function getCircuit(modelName: string) {
  const fm = createFileManager('/');
  const mainPath = new URL(
    `/circuits/noir/circles/src/main.nr`,
    window.location.origin
  );
  const nargoTomlPath = new URL(
    `/circuits/noir/${modelName}/Nargo.toml`,
    window.location.origin
  );

  const mainResponse = await fetch(mainPath);
  if (!mainResponse.ok) throw new Error('Failed to fetch main.nr');

  const nargoTomlResponse = await fetch(nargoTomlPath);
  if (!nargoTomlResponse.ok) throw new Error('Failed to fetch Nargo.toml');

  const main = mainResponse.body as ReadableStream<Uint8Array>;
  const nargoToml = nargoTomlResponse.body as ReadableStream<Uint8Array>;

  await fm.writeFile('./src/main.nr', main);
  await fm.writeFile('./Nargo.toml', nargoToml);

  const result = await compile(fm);
  if (!('program' in result)) {
    throw new Error('Compilation failed');
  }

  return result.program as CompiledCircuit;
}

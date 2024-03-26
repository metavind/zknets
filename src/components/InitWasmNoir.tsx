import React, { useEffect, useState } from 'react';
import initACVM from '@noir-lang/acvm_js';
import initNoirC from '@noir-lang/noirc_abi';

interface InitWasmNoirProps {
  children: React.ReactNode;
}

const InitWasmNoir: React.FC<InitWasmNoirProps> = ({ children }) => {
  const [init, setInit] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWasmNoir = async () => {
      await Promise.all([
        initACVM(
          new URL(
            '@noir-lang/acvm_js/web/acvm_js_bg.wasm',
            import.meta.url
          ).toString()
        ),
        initNoirC(
          new URL(
            '@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm',
            import.meta.url
          ).toString()
        ),
      ]);
      setInit(true);
    };

    initializeWasmNoir().catch(() => {
      setInitError('Failed to initialize the application. Please try again.');
    });
  }, []);

  if (initError) {
    return <div>Error: {initError}</div>;
  }

  return init ? children : null;
};

export default InitWasmNoir;

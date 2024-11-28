import { cookieStorage, createStorage } from "@wagmi/core";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import { sepolia } from "@reown/appkit/networks";

export const projectId = "92a8b5133c12f8a9fed67d226ae7a4f4";

export const networks = [sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

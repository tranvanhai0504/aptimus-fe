// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.DEVNET })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_GOOGLE_ID
  // "50127724323-pl7vs0b4ei6ob4se25asmv3k6drhrle1.apps.googleusercontent.com";

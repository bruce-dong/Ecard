import {
  createThirdwebClient,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";

import { config } from "dotenv";

import { privateKeyToAccount } from "thirdweb/wallets";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "thirdweb/extensions/erc1155";
import { createNewPack } from "thirdweb/extensions/pack";
import { sepolia } from "thirdweb/chains";

config();

const main = async () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not set");
  }

  try {
    const EDITION_CONTRACT_ADDRESS = "0x11BAE9C839BfdA8d2a46A1Ac8d494E8a9e186052";
    const PACK_CONTRACT_ADDRESS = "0xb0Fd2a99363f260b5A718665394c1d73A5aCc3db";

    const chain = sepolia;

    // Initialize the client and the account
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const account = privateKeyToAccount({
      client,
      privateKey: process.env.PRIVATE_KEY,
    });

    // Get the contracts

    const contractEdition = getContract({
      address: EDITION_CONTRACT_ADDRESS,
      chain,
      client,
    });

    const contractPack = getContract({
      address: PACK_CONTRACT_ADDRESS,
      chain,
      client,
    });

    // Check if the Account is approved

    const isApproved = await isApprovedForAll({
      contract: contractEdition,
      owner: account.address,
      operator: PACK_CONTRACT_ADDRESS,
    });
    console.log("Account is approved");

    if (!isApproved) {
      const transaction = setApprovalForAll({
        contract: contractEdition,
        operator: PACK_CONTRACT_ADDRESS,
        approved: true,
      });

      const approvalData = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      console.log(`Approval Transaction hash: ${approvalData.transactionHash}`);
    }

    // Create a new Pack of Cards

    const transactionPack = createNewPack({
      contract: contractPack,
      client,
      recipient: account.address,
      tokenOwner: account.address,
      packMetadata: {
        name: "Magician and Dragon",
        image:
          "https://7f0b5999668161486ec0393394efc124.ipfscdn.io/ipfs/bafybeiery7bvpasufjz4mbdjjyk24zrjmpwxhwluwts53w32qizcu2ydv4/",
        description: "Duel Pack, contains 3 rare cards",
      },

      openStartTimestamp: new Date(),

      erc1155Rewards: [
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(12),
          quantityPerReward: 1,
          totalRewards: 5,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(11),
          quantityPerReward: 1,
          totalRewards: 5,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(6),
          quantityPerReward: 1,
          totalRewards: 5,
        },
      ],
      amountDistributedPerOpen: BigInt(3),
    });

    const dataPack = await sendAndConfirmTransaction({
      transaction: transactionPack,
      account,
    });

    console.log(`Pack Transaction hash: ${dataPack.transactionHash}`);
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

main();

import { HardhatUserConfig } from 'hardhat/config'
import { Wallet } from '@ethersproject/wallet'
import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import 'hardhat-gas-reporter'
dotenv.config()
const bip39 = require('bip39')
const mnemonic = process.env.TEST_MNEMONIC || bip39.generateMnemonic()

let accounts
let hardhatEvmAccounts

if (mnemonic) {
	accounts = {
		mnemonic
	}
	hardhatEvmAccounts = []
	for (let i = 0; i < 10; i++) {
		const wallet = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + i)
		hardhatEvmAccounts.push({
			privateKey: wallet.privateKey,
			balance: '1000000000000000000000'
		})
	}
}

const config: HardhatUserConfig = {
	solidity: '0.8.14',
	mocha: {
		timeout: 100000000
	},
	networks: {
		hardhat: {
			forking: {
				url: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY}`,
				blockNumber: 18945970
			}
		},
		arbitrumGoerli: {
			url: `https://goerli-rollup.arbitrum.io/rpc`,
			chainId: 421613,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : accounts,
			gas: 500000000
		}
	},
	etherscan: {
		apiKey: {
			arbitrumGoerli: process.env.ARBISCAN_API_KEY as string
		},
		customChains: [
			{
				network: 'arbitrumGoerli',
				chainId: 421613,
				urls: {
					apiURL: 'https://api-goerli.arbiscan.io/api',
					browserURL: 'https://goerli.arbiscan.io'
				}
			}
		]
	}
}

export default config

import { HardhatUserConfig } from 'hardhat/config'
import { Wallet } from '@ethersproject/wallet'
import '@nomicfoundation/hardhat-toolbox'
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
	networks: {
		hardhat: {
			forking: {
				url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY}`
			}
		},
		arbitrumGoerli: {
			url: `https://goerli-rollup.arbitrum.io/rpc`,
			chainId: 421613,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : accounts,
			gas: 500000000
		}
	}
}

export default config

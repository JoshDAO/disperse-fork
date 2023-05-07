import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import dotenv from 'dotenv'
import { Disperse, IERC20 } from '../typechain-types'
import { Signer } from 'ethers'
import fs from 'fs'
import path from 'path'
dotenv.config()
const bip39 = require('bip39')

let disperse: Disperse
let usdc: IERC20
let sender: Signer
const usdcAddress = '0x408c5755b5c7a0a28D851558eA3636CfC5b5b19d'
const addresses: string[] = fs
	.readFileSync(path.resolve(__dirname, '../addresses.txt'), 'utf-8')
	.split(',')

console.log(addresses)
for (let i = 0; i < 10; i++) {
	const wallet = ethers.Wallet.fromMnemonic(bip39.generateMnemonic(), "m/44'/60'/0'/0/" + i)
	addresses.push(wallet.address)
}

console.log({ addresses })
describe('Disperse', async () => {
	before(async function () {
		await network.provider.request({
			method: 'hardhat_reset',
			params: [
				{
					forking: {
						jsonRpcUrl: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY}`,
						chainId: 42161,
						blockNumber: 18947789
					}
				}
			]
		})
		sender = await ethers.getImpersonatedSigner('0xF8F8E45A1f470E92D2B714EBf58b266AabBeD45D')
	})
	describe('Deployment', async () => {
		it('deploys the disperse contract', async () => {
			usdc = await ethers.getContractAt('IERC20', usdcAddress)
			const disperseFactory = await ethers.getContractFactory('Disperse')
			disperse = await disperseFactory.deploy()
			expect(disperse).to.haveOwnProperty('disperseToken')
		})
	})
	describe('sends tx', async () => {
		it('sends tx', async () => {
			const blocknum = await ethers.provider.getBlockNumber()
			const senderAddress = await sender.getAddress()
			const senderBalance = await usdc.connect(sender).balanceOf(senderAddress)
			const values = new Array(addresses.length).fill(ethers.utils.parseUnits('100', 6))
			await usdc
				.connect(sender)
				.approve(disperse.address, ethers.utils.parseUnits('10000000000', 6))
			const allowance = await usdc.allowance(sender.address, disperse.address)
			const balanceBefore = await ethers.provider.getBalance(senderAddress)
			for (let i = 0; i < addresses.length; i += 500) {
				await disperse
					.connect(sender)
					.disperseTokenSimple(usdcAddress, addresses.slice(i, i + 500), values.slice(i, i + 500))
			}
			const balanceAfter = await ethers.provider.getBalance(senderAddress)

			for (let i = 0; i < addresses.length; i++) {
				expect(await usdc.balanceOf(addresses[i])).to.eq(ethers.utils.parseUnits('100', 6))
			}
			const cost = ethers.utils.formatEther(balanceBefore.sub(balanceAfter))
			console.log(cost)
		})
	})
})

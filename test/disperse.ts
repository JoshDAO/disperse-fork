import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Lock', function () {
	describe('Deployment', function () {
		it('deploys the disperse contract', async () => {
			const disperseFactory = await ethers.getContractFactory('Disperse')
			const disperse = await disperseFactory.deploy()
			expect(disperse).to.haveOwnProperty('disperseToken')
		})
	})
})

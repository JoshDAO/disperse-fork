import hre, { ethers } from 'hardhat'

async function main() {
	const disperseFactory = await ethers.getContractFactory('Disperse')
	const disperse = await disperseFactory.deploy()
	const address = disperse.address

	try {
		await hre.run('verify:verify', {
			address: address,
			constructorArguments: []
		})
		console.log('disperse verified')
	} catch (err: any) {
		console.log(err)
		if (err.message.includes('Reason: Already Verified')) {
			console.log('Disperse contract already verified')
		}
	}

	console.log(address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
	console.error(error)
	process.exitCode = 1
})

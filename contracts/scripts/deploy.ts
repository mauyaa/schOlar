import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const STABLE_TOKEN_ADDRESS =
    process.env.STABLE_TOKEN_ADDRESS || deployer.address; // replace with stablecoin when available
  if (!process.env.STABLE_TOKEN_ADDRESS) {
    console.warn(
      "STABLE_TOKEN_ADDRESS not set. Using deployer address for local testing."
    );
  }

  const ScholarshipFactory = await ethers.getContractFactory("ScholarshipFactory");
  const factory = await ScholarshipFactory.deploy(STABLE_TOKEN_ADDRESS, deployer.address);
  await factory.waitForDeployment();

  console.log("ScholarshipFactory deployed at:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

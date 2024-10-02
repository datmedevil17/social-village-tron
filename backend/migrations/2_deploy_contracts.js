const TrophyToken = artifacts.require("./contracts/TrophyToken");
const SocialMediaPlatform = artifacts.require("./contracts/SocialMediaPlatform");

module.exports = async function(deployer) {
  // Deploy TrophyToken first
  await deployer.deploy(TrophyToken);
  const trophyToken = await TrophyToken.deployed();

  // Now deploy SocialMediaPlatform with the address of the deployed TrophyToken contract
  await deployer.deploy(SocialMediaPlatform, trophyToken.address);
};

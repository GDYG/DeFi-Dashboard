const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFiToken", function () {
  let DeFiToken;
  let defiToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    DeFiToken = await ethers.getContractFactory("DeFiToken");
    defiToken = await DeFiToken.deploy(
      "DeFi Dashboard Token",
      "DDT",
      owner.address
    );
    await defiToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await defiToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await defiToken.balanceOf(owner.address);
      expect(await defiToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct token info", async function () {
      const tokenInfo = await defiToken.getTokenInfo();
      expect(tokenInfo.tokenName).to.equal("DeFi Dashboard Token");
      expect(tokenInfo.tokenSymbol).to.equal("DDT");
      expect(tokenInfo.tokenDecimals).to.equal(18);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await defiToken.mint(addr1.address, mintAmount);
      
      expect(await defiToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        defiToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(defiToken, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting beyond max supply", async function () {
      const maxSupply = await defiToken.MAX_SUPPLY();
      const currentSupply = await defiToken.totalSupply();
      const excessAmount = maxSupply - currentSupply + ethers.parseEther("1");
      
      await expect(
        defiToken.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("DeFiToken: Max supply exceeded");
    });

    it("Should emit TokensMinted event", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(defiToken.mint(addr1.address, mintAmount))
        .to.emit(defiToken, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint some tokens to addr1 for testing
      await defiToken.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("500");
      const initialBalance = await defiToken.balanceOf(addr1.address);
      
      await defiToken.connect(addr1).burn(burnAmount);
      
      expect(await defiToken.balanceOf(addr1.address)).to.equal(
        initialBalance - burnAmount
      );
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("500");
      
      await expect(defiToken.connect(addr1).burn(burnAmount))
        .to.emit(defiToken, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should allow burning with allowance", async function () {
      const burnAmount = ethers.parseEther("500");
      
      // Approve addr2 to spend addr1's tokens
      await defiToken.connect(addr1).approve(addr2.address, burnAmount);
      
      // addr2 burns addr1's tokens
      await defiToken.connect(addr2).burnFrom(addr1.address, burnAmount);
      
      expect(await defiToken.balanceOf(addr1.address)).to.equal(
        ethers.parseEther("500")
      );
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      // Mint some tokens to addr1 for testing
      await defiToken.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("500");
      
      await defiToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await defiToken.balanceOf(addr1.address)).to.equal(
        ethers.parseEther("500")
      );
      expect(await defiToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.parseEther("2000");
      
      await expect(
        defiToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(defiToken, "ERC20InsufficientBalance");
    });
  });
}); 
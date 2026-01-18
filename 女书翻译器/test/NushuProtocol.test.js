const { expect } = require("chai");

describe("NushuProtocol", function () {
  let NushuProtocol;
  let nushuProtocol;
  let owner;
  let addr1;
  let ethers;
  
  beforeEach(async function () {
    ethers = hre.ethers;
    NushuProtocol = await ethers.getContractFactory("NushuProtocol");
    [owner, addr1] = await ethers.getSigners();
    nushuProtocol = await NushuProtocol.deploy();
  });
  
  describe("Deployment", function () {
    it("Should set the right initial points constants", async function () {
      expect(await nushuProtocol.INITIAL_POINTS()).to.equal(50);
      expect(await nushuProtocol.POINTS_PER_ETH()).to.equal(10000);
      expect(await nushuProtocol.SERVICE_COST()).to.equal(5);
    });
  });
  
  describe("Claim Initial Points", function () {
    it("Should allow new users to claim 50 initial points", async function () {
      await nushuProtocol.connect(addr1).claimInitialPoints();
      expect(await nushuProtocol.points(addr1.address)).to.equal(50);
    });
    
    it("Should not allow users to claim points twice", async function () {
      await nushuProtocol.connect(addr1).claimInitialPoints();
      await expect(nushuProtocol.connect(addr1).claimInitialPoints()).to.be.revertedWith("Already claimed initial points");
    });
  });
  
  describe("Buy Points", function () {
    it("Should allow users to buy points with ETH", async function () {
      // 直接使用1e18 wei作为数值
      await nushuProtocol.connect(addr1).buyPoints({ value: "1000000000000000000" });
      expect(await nushuProtocol.points(addr1.address)).to.equal(10000);
    });
    
    it("Should not allow users to buy points with 0 ETH", async function () {
      await expect(nushuProtocol.connect(addr1).buyPoints({ value: 0 })).to.be.revertedWith("Must send ETH to buy points");
    });
  });
  
  describe("Use Service", function () {
    it("Should deduct 5 points when using the service", async function () {
      await nushuProtocol.connect(addr1).claimInitialPoints();
      await nushuProtocol.connect(addr1).useService(1, "test-image-url");
      expect(await nushuProtocol.points(addr1.address)).to.equal(45);
    });
    
    it("Should emit TranslationRequested event when using the service", async function () {
      await nushuProtocol.connect(addr1).claimInitialPoints();
      await expect(nushuProtocol.connect(addr1).useService(1, "test-image-url"))
        .to.emit(nushuProtocol, "TranslationRequested")
        .withArgs(addr1.address, 1, "test-image-url");
    });
    
    it("Should not allow users to use service with insufficient points", async function () {
      await expect(nushuProtocol.connect(addr1).useService(1, "test-image-url")).to.be.revertedWith("Insufficient points");
    });
  });
});

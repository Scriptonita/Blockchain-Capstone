const truffleAssert = require("truffle-assertions");
const ERC721Mintable = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new("JHG Token", "JHG", {
        from: account_one
      });

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, 1, { from: account_one });
      await this.contract.mint(account_two, 2, { from: account_one });
      await this.contract.mint(account_one, 3, { from: account_one });
      await this.contract.mint(account_two, 4, { from: account_one });
      await this.contract.mint(account_one, 5, { from: account_one });
    });

    it("should return total supply", async function () {
      const total = await this.contract.totalSupply.call();
      assert.equal(parseInt(total), 5, "Total supply in not correct");
    });

    it("should get token balance", async function () {
      const balance_one = await this.contract.balanceOf(account_one);
      assert.equal(balance_one, 3, "Balance is not correct");
      const balance_two = await this.contract.balanceOf(account_two);
      assert.equal(balance_two, 2, "Balance is not correct");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      const tokenId = 1;
      const baseTokenURI =
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
      const tokenURI = baseTokenURI + tokenId;

      const token = await this.contract.tokenURI(tokenId);

      assert.equal(tokenURI, token, "TokenURI is incorrect");
    });

    it("should transfer token from one owner to another", async function () {
      const tokenId = 1;
      const tx = await this.contract.transferFrom(
        account_one,
        account_two,
        tokenId
      );
      truffleAssert.eventEmitted(tx, "Transfer");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new("JHG Token", "JHG", {
        from: account_one
      });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let failed = false;
      try {
        await this.contract.mint(account_two, 6, { from: account_two });
      } catch (error) {
        failed = true;
      }

      assert.equal(
        failed,
        true,
        "Mint did not fail when called by a not contract owner"
      );
    });

    it("should return contract owner", async function () {
      const owner = await this.contract.getOwner.call({
        from: account_one,
        gas: 444444
      });

      assert.equal(owner, account_one, "Owner is not correct");
    });
  });
});

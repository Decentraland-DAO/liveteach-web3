const { assert, expect } = require("chai");

describe("TeachContractClassroomAdmin", function () {
  let owner;
  let user1;
  let user2;
  let teachContract;

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");

    let accounts = await ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    let landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
    let landContractAddress = await landContract.target;
    teachContract.connect(owner).setLANDRegistry(landContractAddress);
  })

  // classroom admin
  it("Can create classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).isClassroomAdmin(user1);
    assert.equal("true", result.toString()); // string conversion to assert actual true rather than truthy value
    result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(4, result.landCoordinates.length);
  });

  it("Cannot create a classroom admin with already assigned land ids.", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).createClassroomAdmin(user2, [4, 5]))
      .to.be.revertedWith("Provided id invalid.");
  });

  it("Cannot create a double classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).createClassroomAdmin(user1, [4, 5]))
      .to.be.revertedWith("Provided wallet already has role.");
  });

  it("Can get all classroom admins", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(user2, [5, 6]);

    let result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(2, result.length);
    let classroomAdmin1 = result[0];
    let classroomAdmin2 = result[1];

    assert.equal(user1.address, classroomAdmin1.walletAddress);
    assert.equal(user2.address, classroomAdmin2.walletAddress);

    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
    assert.equal([5n, 6n].toString(), classroomAdmin2.landIds);
  });

  it("Can get single classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(user2, [5, 6]);

    let classroomAdmin1 = await teachContract.connect(owner).getClassroomAdmin(user1.address);

    assert.equal(user1.address, classroomAdmin1.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
  });

  it("Cannot get single non existing classroom admin", async function () {
    await expect(teachContract.connect(owner).getClassroomAdmin(user1.address))
      .to.be.revertedWith("Classroom admin not found.");
  });


  it("Can update existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), result.landIds.toString());
    await teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]);
    result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([5n, 6n].toString(), result.landIds.toString());
  });

  it("Cannot update existing classroom admin with already assigned land ids", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user2, [5, 6]);
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), result.landIds.toString());
    await expect(teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]))
      .to.be.revertedWith("Provided id invalid.");
  });

  it("Cannot update a non classroom admin", async function () {
    await expect(teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

  it("Can delete classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(1, result.length);
    await teachContract.connect(owner).deleteClassroomAdmin(user1);
    result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(result.length, 0);
  });

  it("Cannot delete non existing classroom admin", async function () {
    await expect(teachContract.connect(owner).deleteClassroomAdmin(user1))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

});

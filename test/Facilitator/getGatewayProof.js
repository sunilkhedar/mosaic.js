const chai = require('chai');
const sinon = require('sinon');
const Facilitator = require('../../src/Facilitator');
const TestMosaic = require('../../test_utils/GetTestMosaic');
const AssertAsync = require('../../test_utils/AssertAsync');
const SpyAssert = require('../../test_utils/SpyAssert');

const { assert } = chai;

describe('Facilitator.getGatewayProof()', () => {
  let mosaic;
  let facilitator;
  let messageHash;

  let getLatestAnchorInfoResult;
  let getProofResult;

  let spyGetLatestAnchorInfo;
  let spyGetProof;
  let spyCall;

  const setup = () => {
    spyCall = sinon.spy(facilitator, 'getGatewayProof');
    spyGetLatestAnchorInfo = sinon.replace(
      facilitator.coGateway,
      'getLatestAnchorInfo',
      sinon.fake.resolves(getLatestAnchorInfoResult),
    );
    spyGetProof = sinon.replace(
      facilitator,
      'getProof',
      sinon.fake.resolves(getProofResult),
    );
  };

  const teardown = () => {
    spyCall.restore();
    sinon.restore();
  };

  beforeEach(() => {
    mosaic = TestMosaic.mosaic();
    facilitator = new Facilitator(mosaic);
    messageHash =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    getLatestAnchorInfoResult = sinon.fake();
    getProofResult = true;
  });

  it('should throw an error when message hash is undefined', async () => {
    await AssertAsync.reject(
      facilitator.getGatewayProof(),
      `Invalid message hash: ${undefined}.`,
    );
  });

  it('should pass with valid constructor arguments', async () => {
    setup();
    const result = await facilitator.getGatewayProof(messageHash);
    assert.strictEqual(
      result,
      getProofResult,
      'Result of getGatewayProof must be true.',
    );

    SpyAssert.assert(spyGetLatestAnchorInfo, 1, [[]]);
    SpyAssert.assert(spyCall, 1, [[messageHash]]);
    SpyAssert.assertCall(spyGetProof, 1);

    assert.strictEqual(
      typeof spyGetProof.args[0][0],
      'object',
      'First argument for get proof call must be object',
    );

    assert.strictEqual(
      spyGetProof.args[0][1],
      facilitator.gateway.gatewayAddress,
      'Second argument for get proof call must be gateway contract address',
    );

    assert.strictEqual(
      spyGetProof.args[0][2],
      getLatestAnchorInfoResult,
      'Third argument for get proof call must be the fake object',
    );

    assert.strictEqual(
      spyGetProof.args[0][3],
      messageHash,
      'Fourth argument for get proof call must be the message hash',
    );

    teardown();
  });
});

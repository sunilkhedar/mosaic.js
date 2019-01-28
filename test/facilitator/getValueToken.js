// Copyright 2019 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const chai = require('chai');
const sinon = require('sinon');
const Web3 = require('web3');
const Facilitator = require('../../libs/Facilitator/Facilitator');

const assert = chai.assert;

describe('Facilitator.getValueToken()', () => {
  let facilitator;
  let web3;
  let gatewayAddress;
  let coGatewayAddress;

  beforeEach(() => {
    // runs before each test in this block
    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9546'));
    gatewayAddress = '0x52c50cC9bBa156C65756abd71b172B6408Dde006';
    coGatewayAddress = '0xbF03E1680258c70B86D38A7e510F559A6440D06e';
    facilitator = new Facilitator(
      web3,
      web3,
      gatewayAddress,
      coGatewayAddress
    );
  });

  it('should return correct base token', async function() {
    this.timeout(5000);

    let expectedValueTokenAddress =
      '0x4e4ea3140f3d4a07e2f054cbabfd1f8038b3b4b0';

    // Mock an instance of gateway contract.
    const mockGatewayContract = sinon.mock(
      facilitator.contracts.Gateway(gatewayAddress)
    );
    const gatewayContract = mockGatewayContract.object;

    // Fake the value token call.
    sinon.stub(gatewayContract.methods, 'token').callsFake(() => {
      return function() {
        return Promise.resolve(expectedValueTokenAddress);
      };
    });

    // Fake the Gateway call to return gatewayContract object;
    sinon.stub(facilitator.contracts, 'Gateway').callsFake(() => {
      return gatewayContract;
    });

    // Add spy on Facilitator.getValueToken.
    const spy = sinon.spy(facilitator, 'getValueToken');

    // Get value token address.
    const valueToken = await facilitator.getValueToken();

    // Assert the returned value.
    assert.strictEqual(
      valueToken,
      expectedValueTokenAddress,
      'Value token address must not be different.'
    );

    // Assert if the function was called with correct argument.
    assert.strictEqual(
      spy.calledWith(),
      true,
      'Function not called with correct argument.'
    );

    // Assert if the function was called only once.
    assert.strictEqual(
      spy.withArgs().calledOnce,
      true,
      'Function must be called once'
    );

    // Restore all mocked and spy objects.
    mockGatewayContract.restore();
    spy.restore();
  });
});

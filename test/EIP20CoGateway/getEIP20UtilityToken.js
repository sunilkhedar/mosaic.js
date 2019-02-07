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
const Web3 = require('web3');
const sinon = require('sinon');
const EIP20CoGateway = require('../../src/ContractInteract/EIP20CoGateway');
const SpyAssert = require('../../test_utils/SpyAssert');

const assert = chai.assert;

describe('EIP20CoGateway.getEIP20UtilityToken()', () => {
  let web3;
  let coGatewayAddress;
  let coGateway;

  let getUtilityTokenAddressResult;

  let spyCall;
  let spyGetUtilityTokenAddress;

  const setup = () => {
    spyGetUtilityTokenAddress = sinon.replace(
      coGateway,
      'getUtilityToken',
      sinon.fake.resolves(getUtilityTokenAddressResult),
    );
    spyCall = sinon.spy(coGateway, 'getEIP20UtilityToken');
  };

  const tearDown = () => {
    sinon.restore();
    spyCall.restore();
  };

  beforeEach(() => {
    web3 = new Web3();
    coGatewayAddress = '0x0000000000000000000000000000000000000002';
    coGateway = new EIP20CoGateway(web3, coGatewayAddress);
    getUtilityTokenAddressResult =
      '0x0000000000000000000000000000000000000003';
  });

  it('should return EIP20UtilityToken object', async () => {
    setup();
    const result = await coGateway.getEIP20UtilityToken();
    assert.strictEqual(
      result.web3,
      web3,
      'Function should return EIP20Token object with correct web3.',
    );
    assert.strictEqual(
      result.tokenAddress,
      getUtilityTokenAddressResult,
      'Function should return EIP20Token object with correct contract address.',
    );

    SpyAssert.assert(spyGetUtilityTokenAddress, 1, [[]]);
    SpyAssert.assert(spyCall, 1, [[]]);
    tearDown();
  });

  it('should return EIP20UtilityToken object from the instance variable', async () => {
    setup();
    const firstCallResult = await coGateway.getEIP20UtilityToken();
    assert.strictEqual(
      firstCallResult.web3,
      web3,
      'Function should return EIP20Token object with correct web3.',
    );
    assert.strictEqual(
      firstCallResult.tokenAddress,
      getUtilityTokenAddressResult,
      'Function should return EIP20Token object with correct contract address.',
    );

    SpyAssert.assert(spyGetUtilityTokenAddress, 1, [[]]);
    SpyAssert.assert(spyCall, 1, [[]]);

    const secondCallResult = await coGateway.getEIP20UtilityToken();
    assert.strictEqual(
      secondCallResult.web3,
      web3,
      'Function should return EIP20Token object with correct web3.',
    );
    assert.strictEqual(
      secondCallResult.tokenAddress,
      getUtilityTokenAddressResult,
      'Function should return EIP20Token object with correct contract address.',
    );

    SpyAssert.assert(spyGetUtilityTokenAddress, 1, [[]]);
    SpyAssert.assert(spyCall, 2, [[], []]);

    tearDown();
  });
});

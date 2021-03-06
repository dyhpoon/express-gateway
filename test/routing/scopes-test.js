let testHelper = require('../common/routing.helper');
let config = require('../../lib/config');
let originalGatewayConfig = config.gatewayConfig;

describe('When scopes defined for apiEndpoint', () => {
  let helper = testHelper();

  before('setup', () => {
    config.gatewayConfig = {
      http: { port: 9089 },
      apiEndpoints: {
        test_default: {
          scopes: [
            { scope: 'admin', verbs: 'GET' },
            { scope: 'profile', verbs: ['GET', 'POST'] }
          ]
        }
      },
      policies: ['test'],
      pipelines: {
        pipeline1: {
          apiEndpoints: ['test_default'],
          policies: { test: {} }
        }
      }
    };

    helper.setup();
  });

  after('cleanup', (done) => {
    config.gatewayConfig = originalGatewayConfig;
    helper.cleanup();
    done();
  });

  it('should set scopes to egContext', helper.validateSuccess({
    setup: {
      url: '/'
    },
    test: {
      url: '/',
      scopes: [
        { scope: 'admin', verbs: 'GET' },
        { scope: 'profile', verbs: ['GET', 'POST'] }
      ]
    }
  }));
});

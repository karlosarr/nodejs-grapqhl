/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');

const Permission = require('../../../../src/models/permission');
const {
  expressServer,
  closeExpressServer,
} = require('../../../../src/server/server');
const {
  mutationAddPermission,
} = require('./features/mutation/mutation.addPermission');
const { isAuthorized } = require('../../../../src/middleware/isAuthorized');

jest.mock('../../../../src/middleware/isAuthorized');

describe('Add permission unit test', () => {
  let app;

  beforeAll(async () => {
    app = await expressServer({});
  });
  beforeEach(() => {
    isAuthorized.mockClear();
  });

  it('Can Add a new permission', async () => {
    isAuthorized.mockReturnValue(true);
    await Permission.deleteMany({});
    const response = await request(app)
      .post('/')
      .set('content-type', 'application/json')
      .set('uer-agent', 'jest')
      .send({
        query: mutationAddPermission,
        variables: {
          name: 'test 1',
          description: 'test permission 1',
        },
      });
    const expectData = {
      id: expect.any(String),
      name: 'test 1',
      description: 'test permission 1',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };
    await expect(response.errors).toBeUndefined();
    await expect(response.body.data.addPermission).toMatchObject(expectData);
    await closeExpressServer();
  });
});

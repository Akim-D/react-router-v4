import {readFileSync} from 'fs';

describe('index', () => {
  const reactDom = {
    render: jest.fn(),
  };
  const router = {
    BrowserRouter: () => null,
  };
  const serviceWorker = {
    register: jest.fn(),
    unregister: jest.fn(),
  };
  const root = () => document.getElementById('root');

  beforeEach(loadHtml);

  test('mounts the application', () => {
    require('./index');

    expect(root().children.length).toBeGreaterThan(0);
  });

  test('sets up routing', () => {
    jest.doMock('react-dom', () => reactDom);
    jest.doMock('react-router-dom', () => router);

    require('./index');

    expect(reactDom.render.mock.calls[0][0].type).toEqual(router.BrowserRouter);
  });

  test('unregisters the service worker', () => {
    jest.doMock('./serviceWorker', () => serviceWorker);

    require('./index');

    expect(serviceWorker.unregister).toBeCalled();
  });
});

function loadHtml() {
  document.documentElement.innerHTML = readFileSync('./public/index.html').toString();
}

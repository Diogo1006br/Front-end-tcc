jest.mock('@nanostores/react', () => ({
    listenKeys: jest.fn(),
    persistentAtom: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
    // Adicione outras funções ou valores necessários aqui.
  }));
  
const User = jest.fn(() => ({
  save: jest.fn(),
}));

module.exports = User;

const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError');

exports.register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepository.create({ name, email, password: hashedPassword });
  const token = generateToken({ id: user._id });

  return { user: { id: user._id, name: user.name, email: user.email }, token };
};

exports.login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken({ id: user._id });

  return { user: { id: user._id, name: user.name, email: user.email }, token };
};

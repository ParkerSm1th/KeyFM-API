const User = require('../models/user');
const Community = require('../models/community');
const lengths = [1, 2, 4, 8];
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numsNoZero = '123456789';
const nums = '0123456789';

function generateUniqueId() {
  var uniqueId = "";
  var length = lengths[Math.floor(Math.random() * (lengths.length - 1))];
  for (var i = 0; i < (16 / length); i++) {
    var substr = Math.ceil(Math.random() * (Math.pow(10, length))).toString();
    while (substr.length < length) {
      substr = "0" + substr;
    }
    if (substr.length > length) {
      substr = substr.substring(0, length);
    }
    uniqueId = uniqueId + substr;
  }
  return uniqueId;
}

function randomNum(usernameId) {
  const num = nums[Math.floor(Math.random() * nums.length)];
  if (num == usernameId[usernameId.length - 2]) {
    return randomNum(usernameId)
  } else {
    return num;
  }
}

function generateUsernameId() {
  var usernameId = [];
  usernameId.push(numsNoZero[Math.floor(Math.random() * numsNoZero.length)]);
  for (var i = 0; i < 3; i++) {
    usernameId.push(randomNum(usernameId));
  }
  return usernameId.join("");
}

function getNewUsernameId(username) {
  var id = generateUsernameId();
  i = 0;
  if (!User.countPerUsernameAndId(username, id) > 0) {
    do {
      id = generateUsernameId();
    } while (User.countPerUsernameAndId(username, id) > 0 && i <= 20);
  }
  if (User.countPerUsernameAndId(username, id) > 0 && i == 20) {
    return null;
  } else {
    return id;
  }
}

const getNewUserId = async () => {
  var userId = generateUniqueId();
  while (await User.findByUserId(userId) != null) {
    userId = generateUniqueId();
  }
  return userId;
}

const getNewCommunityId = async () => {
  var communityId = generateUniqueId();
  while (await Community.findByCommunityId(communityId) != null) {
    communityId = generateUniqueId();
  }
  return communityId;
}

const getNewChannelId = async (communityId) => {
  var channelId = generateUniqueId();
  while (await Community.findChannelByChannelId(communityId, channelId) != null) {
    channelId = generateUniqueId();
  }
  return channelId;
}

function generateToken(length) {
  var token = "";
  for (var i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

const getNewConfirmationToken = async () => {
  var token = generateToken(64);
  while (await User.findByConfirmationToken(token) != null) {
    token = generateToken(64);
  }
  return token;
}

module.exports.getNewUserId = getNewUserId;
module.exports.getNewConfirmationToken = getNewConfirmationToken;
module.exports.getNewUsernameId = getNewUsernameId;
module.exports.getNewCommunityId = getNewCommunityId;
module.exports.getNewChannelId = getNewChannelId;
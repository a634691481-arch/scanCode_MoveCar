'use strict';
let vk = uniCloud.vk;
const dbName = require('../../dao/config.js');

const db = uniCloud.database();
const _ = db.command;
const $ = _.aggregate;

const cloudObject = {
  isCloudObject: true,

  _before: async function () {
    vk = this.vk;
  },

  _after: async function (options) {
    let { err, res } = options;
    if (err) {
      if (err instanceof Error) {
        return;
      }
      return err;
    }
    return res;
  },

  getList: async function (data) {
    let res = { code: 0, msg: '' };
    let { uid } = this.getClientInfo();

    return res;
  },

  test: async function (data) {
    let res = { code: 0, msg: '' };
    let { uid } = this.getClientInfo();

    return res;
  },
};

module.exports = cloudObject;

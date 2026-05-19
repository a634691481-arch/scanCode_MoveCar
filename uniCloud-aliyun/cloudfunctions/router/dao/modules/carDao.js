const { BaseDao, Tables } = require('../base.js');

class CarDao extends BaseDao {
  constructor(obj) {
    super(obj);
    this.tableName = Tables.carInfo;
  }

  async findByPlate(plate) {
    return await this.findByWhereJson({ plate: plate.toUpperCase() });
  }

  async findByUserId(userId) {
    return await this.findByWhereJson({ uid: userId });
  }

  async findByUserIdWithList(userId) {
    return await this.select({
      whereJson: { uid: userId },
      pageSize: -1,
      sortArr: [{ name: 'isDefault', type: 'desc' }, { name: '_add_time', type: 'desc' }],
    });
  }
}

module.exports = CarDao;

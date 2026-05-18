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
    return await this.findByWhereJson({ user_id: userId });
  }
}

module.exports = CarDao;

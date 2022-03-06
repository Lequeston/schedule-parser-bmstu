class DatabaseParent {
  async addInDB(value) {
    throw new Error('Не объявлен метод addInDb');
  }
  async addArrayInDB(data) {
    const res = new Map();
    for (const value of data) {
      const dbValue = await this.addInDB(value);
      dbValue && res.set(value, dbValue._id);
    }
    return res;
  }
}

export default DatabaseParent;
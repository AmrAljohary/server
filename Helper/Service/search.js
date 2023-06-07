const search = async (model, skip, limit, search, fields) => {
  let data;
  if (search) {
    const columns = [
      ...fields.map((field) => {
        return {
          [field]: { $regex: search },
        };
      }),
    ];
    data = await model.find({ $or: columns }).limit(limit).skip(skip);
  } else {
    data = await model.find({}).limit(limit).skip(skip);
  }
  return data;
};

module.exports = {
  search,
};

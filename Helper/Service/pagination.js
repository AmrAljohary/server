const pagination = (page, size) => {
  try {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size) {
      size = 3;
    }
    let skip = (page - 1) * size;
    return { skip, limit: size };
  } catch (error) {
    return error;
  }
};

module.exports = { pagination };

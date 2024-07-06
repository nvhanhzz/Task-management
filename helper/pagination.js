module.exports.pagination = (query, limit, total) => {
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;
    const final = Math.ceil(total / limit);

    const res = {
        page: page,
        skip: skip,
        limit: limit,
        total: total,
        final: final
    };

    return res;
}
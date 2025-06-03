function selectPage(list, page, perPage) {
    if (page == null) return list;

    const limit = Number(perPage) ?? 20;
    const startIndex = Number(page) * limit;

    if (startIndex >= list.length) return list;

    const endIndex = Math.min(startIndex + limit, list.length);

    return list.slice(startIndex, endIndex);
}

module.exports = { selectPage }
  /* 
  pagination
  */
  export function paginateResponse(data, page, limit) {

    const [result, total] = data;
    const totalPage = Math.ceil(total / limit);
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {

      data: [...result],
      count: total,
      currentPage: parseInt(page),
      prevPage: prevPage,
      totalPage: totalPage,
    }
  }
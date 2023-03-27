function dateConvert(vnDate) {
  const date = vnDate.split("-");
  let day = date[0];
  let month = date[1];
  let year = date[2];

  return `${year}-${month}-${day}`;
}

export default dateConvert;

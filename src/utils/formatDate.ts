const formatter = new Intl.DateTimeFormat('ru');

const formattedDate = (date: string) => {
  const result = formatter.format(new Date(date));
  return result;
};

export default formattedDate;

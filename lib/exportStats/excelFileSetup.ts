import excel from "excel4node";

export const excelFileSetup = async () => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Letters");

  const headingStyle = workbook.createStyle({
    font: {
      bold: true,
      size: 14,
    },
  });

  worksheet.cell(1, 1).string("Class name").style(headingStyle);
  worksheet.cell(1, 2).string("Register number").style(headingStyle);
  worksheet.cell(1, 3).string("Destination").style(headingStyle);

  return { workbook, worksheet };
};

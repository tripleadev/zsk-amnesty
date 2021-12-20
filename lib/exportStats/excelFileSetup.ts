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

  worksheet.column(1).setWidth(15);
  worksheet.column(2).setWidth(20);
  worksheet.column(3).setWidth(50);
  worksheet.column(5).setWidth(60);

  worksheet.cell(1, 1).string("Class name").style(headingStyle);
  worksheet.cell(1, 2).string("Register number").style(headingStyle);
  worksheet.cell(1, 3).string("Destination").style(headingStyle);

  worksheet.cell(1, 5).string("Stats").style(headingStyle);

  return { workbook, worksheet };
};

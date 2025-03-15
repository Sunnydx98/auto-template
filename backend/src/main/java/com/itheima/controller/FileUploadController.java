package com.itheima.controller;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @PostMapping("/parseHive")
    public ResponseEntity<?> parseFile(@RequestParam("file") MultipartFile file,
                                       @RequestParam("sheetName") String sheetName,
                                       @RequestParam("partitionNum") String partitionNum,
                                       @RequestParam("factName") String factName,
                                       @RequestParam("loadName") String loadName) throws IOException {

        List<String> hqlStatementsFact = new ArrayList<>();
        List<String> hqlStatementsLoad = new ArrayList<>();

        // 解析文件并生成 HQL 语句
        List<String[]> parsedData = parseExcelFile(file);

        for (String[] row : parsedData) {
            String columnName = row[0];
            String columnType = row[1];

            String factHql = generateHql(factName, columnName, columnType);
            String loadHql = generateHql(loadName, columnName, columnType);

            hqlStatementsFact.add(factHql);
            hqlStatementsLoad.add(loadHql);
        }

        // 返回分页的结果
        int pageSize = 10; // 每页显示10条HQL语句
        int totalPages = (int) Math.ceil((double) hqlStatementsFact.size() / pageSize);

        return ResponseEntity.ok(new FileParseResponse(hqlStatementsFact, hqlStatementsLoad, totalPages, pageSize));
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadHqlFile(@RequestParam("fileName") String fileName,
                                             @RequestParam MultiValueMap<String, String> params) {
        try {
            // 解析 HQL 语句
            List<String> hqlStatements = params.get("hqlStatements");
            if (hqlStatements == null || hqlStatements.isEmpty()) {
                return ResponseEntity.badRequest().body("HQL Statements are missing.");
            }

            // 创建一个临时文件
            File tempFile = File.createTempFile(fileName, ".txt");
            BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));
            for (String hql : hqlStatements) {
                writer.write(hql);
                writer.newLine();
            }
            writer.close();

            // 返回下载文件
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + fileName + ".txt")
                    .body(new FileSystemResource(tempFile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing HQL statements: " + e.getMessage());
        }
    }



    private List<String[]> parseExcelFile(MultipartFile file) throws IOException {
        List<String[]> data = new ArrayList<>();

        // 创建 Excel 工作簿
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0); // 假设我们处理第一个工作表

            // 读取每一行
            for (Row row : sheet) {
                String[] rowData = new String[2];
                rowData[0] = row.getCell(0).getStringCellValue(); // 第一列：属性名
                rowData[1] = row.getCell(1).getStringCellValue(); // 第二列：属性类型
                data.add(rowData);
            }
        }
        return data;
    }

    private String generateHql(String tableName, String columnName, String columnType) {
        return "CREATE TABLE " + tableName + " (" + columnName + " " + columnType + ");";
    }
}

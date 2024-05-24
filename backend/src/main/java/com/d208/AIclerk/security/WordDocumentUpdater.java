package com.d208.AIclerk.security;


import com.d208.AIclerk.entity.File;
import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.Participant;
import com.d208.AIclerk.meeting.repository.FileRepository;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.meeting.repository.ParticipantRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Log4j2
public class WordDocumentUpdater {

    private final FileRepository fileRepository;
    private final MeetingDetailRepository meetingDetailRepository;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .region(Region.of("ap-northeast-2"))
                .build();
    }


    public static void main(String[] args) {
    }

    public InputStream getFileFromS3(String bucketName, String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Client.getObject(getObjectRequest);
    }

    public static String getCurrentTimeFormatted() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        return sdf.format(new Date());
    }

    public void updateDocument(InputStream is, String bucketName, String newKey, String title, String content, List<String> participantNames, Long meetingRoomId, String formattedDate) {
        try (XWPFDocument doc = new XWPFDocument(is)) {
            for (XWPFTable table : doc.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            for (XWPFRun run : paragraph.getRuns()) {
                                if (run.text().contains("회의 일자")) {
                                    replaceText(run, formattedDate);
                                }
                                if (run.text().contains("제목을 입력하세요")) {
                                    replaceText(run, title);
                                }
                                if (run.text().contains("내용을 입력하세요")) {
                                    replaceText(run, content);
                                }
                            }
                        }
                        if (cell.getText().contains("참석자 명단")) {
                            cell.removeParagraph(0); // Remove existing content

                            for (String participantName : participantNames) {
                                XWPFParagraph participantParagraph = cell.addParagraph();
                                setParagraphText(participantParagraph, "참석자: " + participantName + " (인)", false, 10, ParagraphAlignment.CENTER);
                            }
                        }
                    }
                }
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.write(baos);
            try (InputStream newDocStream = new ByteArrayInputStream(baos.toByteArray())) {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(newKey)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(newDocStream, baos.size()));

                Optional<MeetingDetail> meetingDetailOptional = meetingDetailRepository.findById(meetingRoomId);
                if (meetingDetailOptional.isPresent()) {
                    File newFile = File.builder()
                            .name(title)
                            .url("https://" + bucketName + ".s3.amazonaws.com/" + newKey)
                            .meetingDetail(meetingDetailOptional.get())
                            .build();
                    fileRepository.save(newFile);
                } else {
                    throw new RuntimeException("MeetingDetail not found");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private static void replaceText(XWPFRun run, String newText) {
        run.setText(newText, 0);
    }

    private static void setParagraphText(XWPFParagraph paragraph, String text, boolean bold, int fontSize, ParagraphAlignment alignment) {
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setBold(bold);
        run.setFontSize(fontSize);
        paragraph.setAlignment(alignment);
    }
}

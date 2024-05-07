package com.d208.AIclerk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meeting_detail")
public class MeetingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_detail_id")
    private Long id;

    @Column(name = "title", columnDefinition = "TEXT")
    private String title;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "total_time")
    private Long totalTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private MeetingRoom meetingRoom;

}

package com.hello.travelogic.companion.domain;

import com.hello.travelogic.member.domain.MemberEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_companion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert //  기본값 적용을 위해 추가
public class CompanionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "companion_id", nullable = false)
    private Integer companionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_code", nullable = false)
    private MemberEntity member;

    @Column(name = "companion_title", length = 50, nullable = false)
    private String companionTitle;

    @Column(name = "companion_content", nullable = false, columnDefinition = "TEXT")
    private String companionContent;

    @Column(name = "companion_created_at", nullable = false)
    private LocalDateTime companionCreatedAt;

    @Column(name = "companion_modified_at")
    private LocalDateTime companionModifiedAt;

    @Column(name = "companion_view_count", nullable = false)
    @ColumnDefault("0")
    private Integer companionViewCount;

    @Column(name="companion_notice", nullable = false)
    @ColumnDefault("false") //데이터에비스 레벨 기본값
    @Builder.Default
    private boolean companionNotice = false;

    // 이미지 파일 경로를 저장할 필드 추가 (여러 개일 경우 쉼표 등으로 구분하여 저장)
    @Column(name = "companion_image_urls", columnDefinition = "TEXT")
    private String companionImageUrls; // 이미지 URL 목록 저장

}
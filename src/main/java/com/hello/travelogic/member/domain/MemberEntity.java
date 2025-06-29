package com.hello.travelogic.member.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tbl_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})      // Jackson의 Hibernate 프록시 속성 무시
public class MemberEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="member_code")
    private Long memberCode;

    @Column(name="member_name", nullable = false, length = 20)
    private String memberName;

    @Column(name="member_id", nullable = false, length = 255, unique = true)
    private String memberId;

    @Column(name="member_password", length = 255)
    private String memberPassword;

    @Column(name="member_email", nullable = false, length=30, unique = true)
    private String memberEmail;

    @Column(name ="member_phone", nullable = true, length = 20)
    private String memberPhone;

    @Column(name="member_profileImageUrl", length = 255)
    private String memberProfileImageUrl;

    @Column(name="member_registerdate", nullable = false)
    private LocalDateTime memberRegisterdate;

    @Column(name="member_enddate")
    private LocalDateTime memberEnddate;

    @Column(name="member_endstatus", length = 20, nullable = false)
    @Builder.Default
    private String memberEndstatus = "N";

    @Column(name="admin_active", length = 20)
    @Builder.Default
    private String adminActive = "Y";

    @Column(name="social_type", length=255)
    private String socialType;

    @Column(name="social_account_id")
    private Long socialAccountId;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch=FetchType.LAZY)
    @JsonIgnore     // 서버에서 클라이언트로 전송되는 JSON 응답의 순환 참조로 인한 무한 루프 방지
    @Builder.Default
    private Set<MemberRoleEntity> roles = new HashSet<>();


}

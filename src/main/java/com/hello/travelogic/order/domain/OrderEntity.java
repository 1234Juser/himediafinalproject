package com.hello.travelogic.order.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hello.travelogic.member.domain.MemberEntity;
import com.hello.travelogic.order.dto.OrderDTO;
import com.hello.travelogic.product.domain.ProductEntity;
import com.hello.travelogic.review.domain.ReviewEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_order")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"review", "product", "member", "option"})
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderCode;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private ProductEntity product;      // 상품1 - 주문N

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "option_code", nullable = false)
    @JsonIgnore
    private OptionEntity option;    // 옵션1 - 주문1

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_code", nullable = false)
    @JsonIgnore
    private MemberEntity member;     // 회원1 - 주문N

    @NotNull
    @Column( name = "booking_uid", nullable = false, unique = true )
    private String bookingUid;

    @NotNull
    @Column( name = "order_adult_price", nullable = false )
    private int orderAdultPrice;

    @Column( name = "order_child_price", nullable = true )
    private Integer orderChildPrice;

    @NotNull
    @Column( name = "total_price", nullable = false )
    private int totalPrice;

    @NotNull
    @Column( name = "order_date", nullable = false )
    private LocalDateTime orderDate;

    @NotNull
    @Column( name = "order_status", nullable = false, length = 20 )
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Column(name = "is_reviewed", nullable = false)
    private boolean isReviewed = false;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private ReviewEntity review;

    public OrderEntity(OrderDTO dto, ProductEntity product, OptionEntity option, MemberEntity member) {
        this.product = product;
        this.option = option;
        this.member = member;
        this.bookingUid = dto.getBookingUid();
        this.orderAdultPrice = dto.getOrderAdultPrice();
        this.orderChildPrice = dto.getOrderChildPrice();
        this.totalPrice = dto.getTotalPrice();
        this.orderDate = dto.getOrderDate();
        this.orderStatus = dto.getOrderStatus();
        this.isReviewed = dto.isReviewed();
    }

    public boolean hasReview() {
        return this.review != null;
    }

    public void setReview(ReviewEntity review) {
        this.review = review;
        if (review != null) {
            this.isReviewed = true;
            review.setOrder(this);
        } else {
            this.isReviewed = false;
        }
    }

    public void removeReview() {
        if (this.review != null) {
            this.review.setOrder(null);
            this.isReviewed = false;
            this.review = null;
        }
    }
}

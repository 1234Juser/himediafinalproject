import {useEffect, useRef, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {getInfoForWriteReview, submitReview} from '../../service/reviewService';
import SimpleModal from '../../components/common/SimpleModal';
import ReviewFormCom from "../../components/review/ReviewFormCom";

function MyReviewWriteCon({ accessToken }) {
    const { orderCode } = useParams();
    const [productTitle, setProductTitle] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const fileInputRef = useRef(null);
    const selectedFileRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 수정용
    const [reviewData, setReviewData] = useState({
        reviewRating: 5,
        reviewContent: '',
        reviewPicFile: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (!accessToken) {
                    alert("로그인이 필요합니다.");
                    navigate("/login");
                    return;
                }

                const data = await getInfoForWriteReview(orderCode, accessToken);
                if (!data.optionCode || data.optionCode === 0) {
                    alert("리뷰 작성을 위한 정보가 충분하지 않습니다. 고객센터에 문의해주세요.");
                }
                if (!data.productTitle) {
                    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
                    navigate(-1);
                    return;
                }
                setProductTitle(data.productTitle || "알 수 없는 상품");
                setSelectedRating(data.reviewRating || 0);
                setReviewContent(data.reviewContent || "");
                if (data.reviewPic) {
                    const imageBlob = await fetch(`/review/${data.reviewPic}/image`);
                    if (!imageBlob.ok) {
                        throw new Error("이미지를 불러오는 중 오류가 발생했습니다.");
                    }
                    const imageUrl = URL.createObjectURL(await imageBlob.blob());
                    setImagePreview(imageUrl);
                }
            } catch (e) {
                alert("리뷰 작성 정보 로딩에 실패했습니다.");
                if (e.response) {
                    const status = e.response.status;
                    if (status === 403) {
                        alert("이 리뷰를 작성할 권한이 없습니다.");
                    } else if (status === 404) {
                        alert("주문 정보를 찾을 수 없습니다.");
                    } else {
                        alert("리뷰를 불러오는 중 오류가 발생했습니다.");
                    }
                } else {
                    alert("서버와의 연결에 실패했습니다.");
                }
                navigate(-1);
            }
        };
        fetchInfo();
    }, [orderCode, accessToken, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFileRef.current = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    // 업로드 하려고 선택한 사진 삭제 기능
    const handleFileRemove = () => {
        selectedFileRef.current = null;
        setImagePreview(null);
        fileInputRef.current.value = "";  // 파일 선택 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("orderCode", orderCode);
        formData.append("reviewRating", selectedRating);
        formData.append("reviewContent", reviewContent);
        if (selectedFileRef.current) {
            formData.append("reviewPic", selectedFileRef.current);
        }
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken || accessToken === "null" || accessToken === "undefined") {
                alert("로그인이 필요합니다.");
                window.location.href = "/login";
                return;
            }
            if (selectedRating === 0) {
                alert("별점을 선택해주세요.");
                return;
            }
            if (!reviewContent.trim()) {
                alert("리뷰 내용을 작성해주세요.");
                return;
            }
            const trimmedContent = reviewContent.trim();
            if (trimmedContent.length < 10) {
                alert("리뷰는 10자 이상 500자 이하로 작성해주세요.");
                return;
            }
            if (trimmedContent.length > 500) {
                alert("리뷰는 500자 이하로 작성해주세요.");
                return;
            }
            const result = await submitReview(orderCode, selectedRating, trimmedContent, selectedFileRef.current, accessToken);
            // 성공 메시지 판단
            if (result.success) {
            setIsModalOpen(true);
            } else {
                // alert("리뷰 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                alert(result.message || "리뷰 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            }
        } catch (e) {
            alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false);
        navigate("/my/reservations"); // 예약 목록 페이지로 이동
    };

    return (
        <>
            <ReviewFormCom
                productTitle={productTitle}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                imagePreview={imagePreview}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleFileRemove={handleFileRemove}
                handleSubmit={handleSubmit}
                setReviewContent={setReviewContent}
            />
            {isModalOpen && (
                <SimpleModal
                    message="감사합니다! 리뷰가 성공적으로 등록되었습니다."
                    onConfirm={handleModalConfirm}
                />
            )}
        </>
    );
}
export default MyReviewWriteCon;
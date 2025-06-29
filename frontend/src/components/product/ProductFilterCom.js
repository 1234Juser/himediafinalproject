import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트 정의
const FilterContainer = styled.div`
    margin-bottom: 2rem;
    padding: 1.5rem 2rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background-color: #ffffff;
    font-family: 'Arial', sans-serif;

    @media (max-width: 768px) {
        padding: 1rem 1.2rem;
        margin-bottom: 1.5rem;
    }
`;

const FilterRow = styled.div`
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-bottom: 1rem;

    // 버튼들을 위한 스타일 조정 (새로운 버튼 그룹 Row를 위해)
    &.button-row {
        justify-content: flex-end; // 버튼들을 오른쪽으로 정렬
        margin-top: 0.5rem; // 필터 요소들과의 간격
        margin-bottom: 0; // 마지막 줄이므로 하단 마진 제거
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;

        // 버튼 row에 대한 모바일 스타일 조정
        &.button-row {
            flex-direction: row; // 모바일에서도 버튼은 가로로 정렬
            justify-content: flex-start; // 양쪽 끝 정렬
            margin-top: 1rem; // 간격 조정
        }
    }
`;

const FilterSection = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 0.4rem;
        font-weight: 600;
        color: #343a40;
        font-size: 0.9rem;
    }

    & > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    @media (max-width: 768px) {
        label {
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
        }
        & > div {
            gap: 0.4rem;
        }
    }
`;



// 4. Input / Select 공통 느낌
const inputStyle = `
    padding: 0.65rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.95rem;
    background-color: #f9f9f9;
    color: #212529;
    transition: border-color 0.15s ease-in-out;

    &:focus {
        border-color: #339af0;
        outline: none;
    }
    
     @media (max-width: 768px) {
        padding: 0.5rem 0.6rem;
        font-size: 0.9rem;
    }
`;

const Input = styled.input`${inputStyle}`;
const Select = styled.select`
    ${inputStyle};
    width: 200px;


    @media (max-width: 768px) {
        //width: 100%; // 모바일에서는 전체 너비 사용
    }
`;

const DateInput = styled(Input)`
    flex-grow: 1; /* DateInput이 가능한 너비를 차지하도록 */
`;

const Button = styled.button`
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 6px;
    background-color: #339af0;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    height: fit-content;
    align-self: flex-end;
    margin-left: auto;

    &:active {
        transform: translateY(1px);
    }

    // 초기화 버튼을 위한 스타일 추가 (선택적)

    &.reset-button {
        background-color: #ffffff; // 다른 색상
        border: 1px solid #dfdede;
        color: #000000;
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        margin-left: 0; // 버튼들의 왼쪽 마진 제거
    }
`;

const PriceRangeSeparator = styled.span`
    margin: 0 0.25rem;
    color: #868e96; /* 구분자 색상 변경 */
    align-self: center; /* 수직 중앙 정렬 */

    @media (max-width: 768px) {
        margin: 0 0.2rem;
    }
`;



function ProductFilterCom({ onFilterChange }) {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const handlePriceChange = (setter) => (e) => {
        const value = e.target.value;
        // 숫자만 입력 가능 (정수), 음수 방지
        if (value === "" || (/^\d+$/.test(value) && parseInt(value, 10) >= 0)) {
            setter(value);
        }
    };

    const handleApplyFilter = () => {
        onFilterChange({ minPrice, maxPrice, status, startDate, endDate });
    };

    const handleResetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setStatus("");
        setStartDate("");
        setEndDate("");
        // 초기화 후 바로 부모 컴포넌트에 변경사항 알림 (필터 적용)
        onFilterChange({ minPrice: "", maxPrice: "", status: "", startDate: "", endDate: "" });
    };

    return (
        <FilterContainer>
            <FilterRow>
                <FilterSection style={{ flexGrow: 1, minWidth: '230px' }}> {/* 가격대 전체의 최소 너비 확보 */}
                    <label>가격대</label>
                    <div>
                        <Input style={{ width: '100px' }} type="number" placeholder="최소" value={minPrice} onChange={handlePriceChange(setMinPrice)} />
                        <PriceRangeSeparator>~</PriceRangeSeparator>
                        <Input style={{ width: '100px' }} type="number" placeholder="최대" value={maxPrice} onChange={handlePriceChange(setMaxPrice)} />
                    </div>
                </FilterSection>
                <FilterSection style={{ flexGrow: 1, flexShrink: 0 }}>
                    <label>판매 상태</label>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">전체</option>
                        <option value="ON_SALE">판매중</option>
                        <option value="CLOSED">판매종료</option>
                        <option value="SOLD_OUT">매진</option>
                    </Select>
                </FilterSection>
                <FilterSection style={{ flexGrow: 1, minWidth: '300px' }}> {/* 출발 기간 전체의 최소 너비 확보 */}
                    <label>출발 기간</label>
                    <div>
                        <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <PriceRangeSeparator>~</PriceRangeSeparator>
                        <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </FilterSection>
                <FilterRow className="button-row">
                    <Button className="reset-button" onClick={handleResetFilters}>필터 초기화</Button>
                    <Button onClick={handleApplyFilter}>필터 적용</Button>
                </FilterRow>
            </FilterRow>
        </FilterContainer>
    );
}

export default ProductFilterCom;

import WishGroupCom from "../../components/wish/WishGroupCom";
import React, {useEffect, useReducer, useState} from "react";
import { reducer, initialState } from "../../modules/wishModule";
import WishListCom from "../../components/wish/WishListCom";
import {getGroups, getItemsInGroup, deleteWish, deleteGroup} from "../../service/wishService";
import {useNavigate, useParams} from "react-router-dom";
import {toggleWish} from "../../service/ProductService";

function WishCon({accessToken}) {
    const { groupCode } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { groups, selectedGroupCode, wishList } = state;
    const isGroupView = !groupCode;
    const isListView = !!groupCode && !isNaN(parseInt(groupCode, 10));
    const selectedGroup = groups.find(group => group.groupCode === selectedGroupCode);
    const [targetProductCode, setTargetProductCode] = useState(null);
    const navigate = useNavigate();

    // <ThumbImg />클릭시 해당 그룹에 담긴 위시상품들 리스트 페이지로 이동한다.
    const handleClickGroup = (groupCode) => {
        navigate(`/wish/groups/${groupCode}/items`);
    };
    const handleClickProduct = (productUid) => {
        navigate(`/products/${productUid}`);
    };

    useEffect(() => {
        if (!accessToken) return;

        getGroups(accessToken)
            .then((data) => {
                dispatch({ type: "SET_GROUPS", data });
            })
            .catch((err) => {
            });
    }, [accessToken]);

    useEffect(() => {
        if (groupCode && accessToken) { // groupCode와 accessToken이 모두 있을 때만 호출
            const groupCodeNum = parseInt(groupCode, 10);
            dispatch({ type: "SET_SELECTED_GROUP", data: groupCodeNum });

            getItemsInGroup(groupCodeNum, accessToken)
                .then((data) => {
                    dispatch({ type: "SET_WISH_LIST", data });
                })
                .catch((err) => {
                });
        }
    }, [groupCode, accessToken]);

    useEffect(() => {
        const handleToggleAndRefresh = async () => {
            if (!targetProductCode || !accessToken) return;

            dispatch({ type: "SET_LOADING", data: true });
            try {
                const status = await toggleWish(targetProductCode, accessToken);
                const groups = await getGroups(accessToken);
                dispatch({ type: "SET_GROUPS", data: groups });
            } catch (err) {
                dispatch({ type: "SET_ERROR", data: err });
            } finally {
                dispatch({ type: "SET_LOADING", data: false });
                setTargetProductCode(null); // 실행 후 초기화
            }
        };

        handleToggleAndRefresh();
    }, [targetProductCode, accessToken]);

    const handleGroupClick = (groupCode) => {
        dispatch({ type: "SET_SELECTED_GROUP", data: groupCode });
        getItemsInGroup(groupCode, accessToken)
            .then((data) => {
                dispatch({ type: "SET_WISH_LIST", data });
            })
            .catch((err) => {
            });
    };

    const handleDeleteWish = (wishCode) => {
        deleteWish(wishCode, accessToken)
            .then((data) => {
                dispatch({ type: "SET_WISH_LIST", data });
            })
            .catch(() => {
                alert("찜 취소에 실패했습니다. 다시 시도해 주세요.");
            });
    };

    const handleDeleteGroup = (groupCode) => {
        deleteGroup(groupCode, accessToken)
            .then((data) => {
                dispatch({ type: "SET_GROUPS", data });
                dispatch({ type: "SET_WISH_LIST", data: [] });
                dispatch({ type: "SET_SELECTED_GROUP", data: null });
            })
            .catch(() => {
                alert("그룹 삭제에 실패했습니다. 다시 시도해 주세요.");
            });
    };

    return(
        <>
            {isGroupView && (<WishGroupCom
                groups={groups}
                onClickGroup={handleClickGroup}
                onDeleteGroup={handleDeleteGroup}
            />)}
            {isListView && (<WishListCom
                groups={groups}
                wishList={wishList}
                onDeleteWish={handleDeleteWish}
                selectedGroupCode={selectedGroupCode}
                groupTitle={selectedGroup?.groupTitle}
                onClickProduct={handleClickProduct}
                onBack={() => navigate("/wish/groups")}
            />)}
        </>
    );
}
export default WishCon;
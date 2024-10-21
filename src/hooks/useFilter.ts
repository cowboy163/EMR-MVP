import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { SharedSelection } from "@nextui-org/react";
import { filterSlice, paginationSlice, useDispatch, useSelector } from "@/lib/redux";
import { GenderType, OrderType } from "@/types/constantsType";
import { IconType } from "react-icons/lib";

type GenderListType = {
    value: GenderType,
    icon: IconType
}

type OrderByListType = {
    label: string,
    value: OrderType
}

const orderByList: OrderByListType[] = [
    { label: 'Last active', value: 'updated' },
    { label: 'Newest members', value: 'created' }
]

const genderList: GenderListType[] = [
    { value: 'male', icon: FaMale },
    { value: 'female', icon: FaFemale }
]

export const useFilters = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filter.filters);
    // for loading
    const [isPending, startTransition] = useTransition();
    // for pagination
    const pageNumber = useSelector(state => state.pagination.pagination.pageNumber);
    const pageSize = useSelector(state => state.pagination.pagination.pageSize);

    const { gender, ageRange, orderBy, withPhoto } = filters;

    useEffect(() => {
        if(gender || ageRange || orderBy || withPhoto) {
            dispatch(paginationSlice.actions.setPage(1));
        }
    }, [ageRange, gender, orderBy, dispatch, withPhoto])

    // any filter change, replace the router
    useEffect(() => {
        startTransition(() => {
            const searchParams = new URLSearchParams();

            if (gender) searchParams.set('gender', gender.join(','));
            if (ageRange) searchParams.set('ageRange', ageRange.toString());
            if (orderBy) searchParams.set('orderBy', orderBy)
            if (pageSize) searchParams.set('pageSize', pageSize.toString());
            if (pageNumber) searchParams.set('pageNumber', pageNumber.toString());
            searchParams.set('withPhoto', withPhoto.toString());

            router.replace(`${pathname}?${searchParams}`);
        })
    }, [ageRange, gender, orderBy, pathname, router, pageSize, pageNumber, withPhoto])

    const handleAgeSelect = (value: number[]) => {
        dispatch(filterSlice.actions.setFilters({ filterName: 'ageRange', value }))
    }

    const handleOrderSelect = (value: SharedSelection) => {
        if (value instanceof Set) {
            dispatch(filterSlice.actions.setFilters({ filterName: 'orderBy', value: value.values().next().value!.toString() }));
        }
    }

    const handleGenderSelect = (value: GenderType) => {
        // check if the gender already selected
        // if yes: it means user try to unselect this gender
        // if no: it means user try to select this gender
        if (gender.includes(value)) {
            dispatch(filterSlice.actions.setFilters({ filterName: 'gender', value: gender.filter(g => g !== value) }));
        } else {
            dispatch(filterSlice.actions.setFilters({ filterName: 'gender', value: [...gender, value] }));
        }
    }

    const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterSlice.actions.setFilters({filterName: 'withPhoto', value: e.target.checked}));
    }

    return {
        orderByList,
        genderList,
        selectAge: handleAgeSelect,
        selectOrder: handleOrderSelect,
        selectGender: handleGenderSelect,
        filters,
        isPending,
        selectWithPhoto: handleWithPhotoToggle
    }
}
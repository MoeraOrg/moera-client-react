import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { searchLoadMore } from "state/search/actions";
import { Button, Loading } from "ui/control";
import "./SearchShowMore.css";

interface Props {
    loading: boolean;
}

export default function SearchShowMore({loading}: Props) {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    return (
        <div className="show-more">
            {!loading ?
                <Button variant="outline-primary" onClick={() => dispatch(searchLoadMore())}>
                    {tTitle(t("show-more-results"))}
                </Button>
            :
                <Loading/>
            }
        </div>
    );
}

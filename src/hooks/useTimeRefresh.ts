import {useEffect, useState} from "react";
import {formatDistance, formatDistanceToNow} from "date-fns";
import useBaseClockContext from "@/contexts/BaseClockProvider.tsx";

export default function useTimeRefresh({eventTime}: { eventTime: string | undefined}) {

    const [timeLabel, setTimeLabel] = useState<string>("")
    const {baseClock} = useBaseClockContext();

    useEffect(() => {
        const update = () => {
            if(!eventTime) return

            setTimeLabel(formatDistanceToNow(eventTime,  {addSuffix: true }));
        };
        update(); // run immediately
    }, [eventTime, baseClock])

    return {timeLabel}
}

// function formatDistance(
//     laterDate: string | number | Date,
//     earlierDate: string | number | Date,
//     options?: FormatDistanceOptions
// ): string

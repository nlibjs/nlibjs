import {IntervalR} from './types';
import {sortIntervalR2} from './sort';

export const unionIntervalR = (...IntervalRs: Array<IntervalR>): IntervalR | null => {
    const nextIntervalR = IntervalRs.shift();
    if (!nextIntervalR) {
        return null;
    }
    let [leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag] = nextIntervalR;
    while (1) {
        const nextIntervalR = IntervalRs.shift();
        if (!nextIntervalR) {
            break;
        }
        const [
            [lFlag1, lEnd1, rEnd1, rFlag1],
            [lFlag2, lEnd2, rEnd2, rFlag2],
        ] = sortIntervalR2([leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag], nextIntervalR);
        if (rEnd1 < lEnd2 || (rEnd1 === lEnd2 && !(rFlag1 || lFlag2))) {
            return null;
        }
        if (rEnd1 < rEnd2) {
            rightEnd = rEnd2;
            rightInclusiveFlag = rFlag2;
        } else if (rEnd1 === rEnd2) {
            rightEnd = rEnd2;
            rightInclusiveFlag = rFlag1 || rFlag2;
        } else {
            rightEnd = rEnd1;
            rightInclusiveFlag = rFlag1;
        }
        leftInclusiveFlag = lFlag1;
        leftEnd = lEnd1;
    }
    return [leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag];
};
